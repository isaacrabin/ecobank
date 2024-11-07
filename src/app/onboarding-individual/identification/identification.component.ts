/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer, take } from 'rxjs';
import { CameraComponent } from 'src/app/_components/camera/camera.component';
import { encrypt } from 'src/app/_helpers/string-encryptor';
import { Auth, Identification } from 'src/app/_models/data-models';
import { ApiService } from 'src/app/_services/api.service';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-identification',
  templateUrl: './identification.component.html',
  styleUrls: ['./identification.component.scss'],
})
export class IdentificationComponent  implements OnInit {
  @Input() auth: Auth = {};
  identification: Identification = {
    frontId:{},
    backId:{}
  };


  side: string = '';
  frontImage: any = '';
  progress: number = 0;
  backImage: any = '';
  signImage: any = '';
  passportImage: any = '';
  selectedDocument: any = 'ID';


  constructor(
    private fb: FormBuilder,
    public loader: LoadingService,
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private httpClient: HttpClient,
    private dataStore: DataStoreService
  ) { }

  ngOnInit() {}

  selectDocument(doc: string){
    this.selectedDocument = doc;
    this.dataStore.identification.documentType = doc;
  }

  toIdScan() {
  this.router.navigate(['/onboarding/id-scan']);
  }

  resendCode(){}

  back(){
    this.modalCtrl.dismiss();
  }


  selectDocToScan(type: string): void {
    switch (type) {
      case 'ID':
        if (this.loader.savedFront && this.loader.savedBack) {
          this.toastr.info('Id already uploaded');
        } else {
          this.router.navigate(['/onboarding/id-sides']);
        }
        break;
      case 'PASSPORT':
        this.openCamera('passport');
        break;
      case 'SIGNATURE':
        if (this.loader.savedPassport || this.loader.savedFront) {
          this.openCamera('signature');
        } else {
          this.toastr.info('Scan the document first');
        }
        break;
      case 'SELFIE':
        this.openCamera('selfie');
        break;
      default:
        break;
    }
  }

  async openCamera(side: string) {
    this.side = side;
    const modal = await this.modalCtrl.create({
      component: CameraComponent,
      cssClass: 'my-custom-class',
      componentProps: { side },
    });

    modal.onWillDismiss().then(async (data: any) => {
      if (data.data.cancelled) {
      } else {
        this.identification = await data.data.data;
        if (this.side === 'signature') {
          const formData = new FormData();
          formData.append('file', this.identification.signatureFile);
          this.loader.frontCaptured = true;
          this.loader.backCaptured = true;
          this.loader.signCaptured = true;
          localStorage.setItem('SIGN', this.identification.signCaptured);
          setTimeout(() => {
            this.signImage = localStorage.getItem('SIGN');
          }, 200);
          this.verifySignature(formData);
        }

        if (this.side === 'passport') {
          this.loader.passportCaptured = true;
          localStorage.setItem(
            'PASSPORT',
            this.identification.passportCaptured
          );
          setTimeout(() => {
            this.passportImage = localStorage.getItem('PASSPORT');
          }, 200);
          this.scanPassport();
        }
      }
    });
    return await modal.present();
  }

  async scanningSolutions() {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      mode: 'md',
      cssClass: 'my-custom-class',
      header: 'SCANNING FAILED',
      message: `<h6>Take note of the following concerns as your make another scanning attempt
                </h6> \n \n
                <ol>
                  <li>Ensure you are scanning the correct side of the ID.</li>
                  <li>Ensure your ID fits into the box guideline of the camera.</li>
                  <li>Ensure you are scanning in a well lit room. i.e Avoid dark areas.</li>
                </ol>
                `,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Save the front id
          },
        },
      ],
    });
    await alert.present();
  }

  //Verify signature image before saving it


  async verifySignature(payload: any){
    this.loader.scanningSignature = true;
    this.loader.signatureScanSuccess = true;

    await this.httpClient.post(`${environment.ocrUrl}signature`, payload).subscribe({
      next: (resp: any) => {
        this.loader.loading = false;
        this.loader.savingSignature = false;
        if(resp.is_signed){
          this.saveImage("signature", {
            file: this.identification.signatureFile,
            idType: "",
            imageType: "SIGNATURE",
            match: "",
            nationalId: "",
          });
        }
        else{
          this.toastr.error("Ensure your signature is signed on a plain white paper");
        }
      },
      error: (err: any) => {
        this.loader.scanningSignature = false;
        this.loader.signatureScanSuccess = false;
        this.toastr.error("An error verifying your signature. Please try again");
      }
    })
  }

  toPreference() {
    this.router.navigate(['/onboarding/preferences']);
  }

  scanPassport() {
    this.loader.scanningPassport = true;

    const backIdData = new FormData();
    backIdData.append('file', this.identification.passportFileNormal);


      this.apiService
        .scanMrz(backIdData)
        .subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this.loader.scanningPassport = false;
              this.dataStore.scanningPassport = false;

              this.identification.nationalId = res.data.document_number;
              this.identification.ocrKey = encrypt(res.data.document_number);

              // Verify that the passport is correct
              this.verifyPassport(this.identification.nationalId);
            } else {
              this.loader.scanningPassport = false;
              this.dataStore.scanningPassport = false;
              this.toastr.warning(
                'Ensure that your Passport is visible and clear in the picture.',
                'Take a clearer photo'
              );
              // this.scanningSolutions();
            }
          },
          error: (err) => {
            this.toastr.error(
                'Ensure that your Passport is visible and clear in the picture.',
                'Take a clearer photo'
            );
            this.loader.passportScanSuccess = false;
            this.loader.scanningPassport = false;
          },
        }); // end api call
  }

  async verifyPassport(passportNumber: any) {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      cssClass: 'my-custom-class',
      header: 'CONFIRM',
      mode:'ios',

      message: `<h5>Please confirm that this is your Passport Number? \n
                </h5> \n
                <h5><strong>Note:</strong> Ensure the passport number is captured correctly</h5>
                <h1>${passportNumber}<h1>
                `,
      buttons: [
        {
          text: 'Retake',
          role: 'cancel',

          cssClass: 'my-secondary',
          handler: () => {
            this.loader.scanningPassport = false;
          },
        },
        {
          text: 'Yes, I Confirm',
          cssClass:'my-primary',
          handler: () => {
            // Save the front id
            this.saveImage('passport', {
              file: this.identification.passportFileNormal,
              idType: 'PASSPORT_ID',
              imageType: 'PASSPORT',
              match: '',
              nationalId: this.identification.nationalId,
              key: this.identification.ocrKey,
            });
          },
        },
      ],
    });
    await alert.present();
  }

  // Save image
  async saveImage(side: any, payload: any) {
    switch (side) {
      case 'passport':
        this.loader.savingPassport = true;
        this.apiService.saveImage(payload).subscribe({
          next: (event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.Sent:
                break;
              case HttpEventType.ResponseHeader:
                break;
              case HttpEventType.UploadProgress:
                if (event.total !== undefined) {
                  this.progress = Math.round(
                    (event.loaded / event.total) * 100
                  );
                } else {
                  // Handle the case where event.total is undefined
                  this.progress = 0; // or some other default value or logic
                }
                break;
              case HttpEventType.Response:
                if (event.body.successful) {
                  this.loader.passportScanSuccess = true;

                  this.loader.savingPassport = false;
                  this.loader.savedPassport = true;
                } else {
                  this.loader.savingPassport = false;
                  this.toastr.error(event.body.message);
                }
                break;
            }
          },
          error: (err) => {
            this.loader.savingPassport = false;
            this.toastr.error('Error saving passport try again.');
          },
        }); // end api call
        break;

      case 'signature':
        this.loader.scanningSignature = false;
        this.loader.savingSignature = true;
        try {
          this.apiService.saveImage(payload).subscribe({
            next: (event: HttpEvent<any>) => {
              switch (event.type) {
                case HttpEventType.Sent:
                  break;
                case HttpEventType.ResponseHeader:
                  break;
                case HttpEventType.UploadProgress:
                  if (event.total !== undefined) {
                    this.progress = Math.round(
                      (event.loaded / event.total) * 100
                    );
                  } else {
                    // Handle the case where event.total is undefined
                    this.progress = 0; // or some other default value or logic
                  }
                  break;
                case HttpEventType.Response:
                  if (event.body.successful) {
                    this.loader.savingSignature = false;
                    this.loader.savedSignature = true;
                    this.dataStore.identification.backSaved = true;

                    this.toastr.success('Documents saved successfully', '', {
                      timeOut: 1500,
                    });
                    setTimeout(() => {
                      //Route to Preferences
                      this.toPreference();
                    }, 1500);
                  } else {
                    this.loader.savingSignature = false;
                    this.toastr.error(event.body.message);
                  }
                  break;
              }
            },
            error: (err) => {
              this.loader.savingSignature = false;
              this.toastr.error('Error saving signature try again.');
            },
          }); // end api call
        } catch (error) {
          this.loader.savingSignature = false;
          this.toastr.error('Error saving signature try again.');
        }
        break;
      default:
        break;
    }
  }

}
