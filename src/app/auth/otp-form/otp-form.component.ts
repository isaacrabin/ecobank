/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';

import { LoadingService } from 'src/app/_services/loading.service';
import { timer, Subscription } from 'rxjs';
import { take } from "rxjs/operators";
import { Auth } from 'src/app/_models/data-models';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-otp-form',
  templateUrl: './otp-form.component.html',
  styleUrls: ['./otp-form.component.scss'],
})
export class OtpFormComponent  implements OnInit {

  @Input() auth: Auth = {};
  resend: boolean = false;

  countDown: Subscription;
  counter = 56;
  tick = 1000;
  smsCode: string = '';
  public progress = 0;

  constructor(
    private fb: FormBuilder,
    public loader: LoadingService,
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService,
    private modalCtrl: ModalController
  ) {

    this.countDown = timer(0, this.tick)
    .pipe(take(this.counter))
    .subscribe(() => {
      --this.counter;
      if (this.counter == 0) {
        this.countDown.unsubscribe();
        this.resend = true;
      }
    });

    this.progress =34
  }

  ngOnInit() {

  }

   // Verify Sms Code then redirect to the correct step if the user had dropped off at some point
   verifyOtp() {

    this.loader.loading = true;
      this.apiService
        .verifyOTP({
          phoneNumber: this.auth.phoneNumber,
          smsCode: this.smsCode
        })
        .subscribe(
          {
            next: (res) => {
            if (res.successful) {
              this.loader.loading = false;
              this.modalCtrl.dismiss();
                switch (res.stepCode){
                  case 100:
                    this.router.navigate(['/onboarding/identification']);
                    break;
                  case 101:
                    this.router.navigate(['/onboarding/identification']);
                    break;
                  case 102:
                    this.router.navigate(['/onboarding/identification']);
                    break;
                  case 103:
                    this.router.navigate(['/onboarding/identification']);
                    break;
                  case 104:
                    this.router.navigate(['/onboarding/identification']);
                    break;
                  case 105:
                    this.router.navigate(["/onboarding/preferences"]);
                    break;
                  case 106:
                    this.router.navigate(["/onboarding/occupation"]);
                    break;
                  case 107:
                    this.router.navigate(["/liveliness/new-selfie"]);
                    break;
                  case 108:
                    this.router.navigate(["/onboarding/summary"]);
                    break;
                  default:
                    break;
                }

            } else {
              this.loader.loading = false;
              this.toastr.error(res.message);
            }
          },
          error:(error) => {
            this.loader.loading = false;
            this.toastr.error("Request error try again.");
          }}
        );

    }

  resendCode(){
    this.loader.loading = true;

    console.log("AUTH PAYLOAD", this.auth)

    this.apiService.login(this.auth).subscribe({

      next:(res) => {
        this.loader.loading = false;
        if (res.successful) {
          this.toastr.success(res.message);
        }
        else{
          this.toastr.error(res.message);
        }
      },
      error:(err) => {
         this.loader.loading = false;
         this.toastr.error(err.message);
      }
     });
  }

  back(){
    this.modalCtrl.dismiss();
  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }

  onOtpChange(e: any){
    this.smsCode = e;
  }

  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };

  getFirstFourChars(str: any): string {
    return str?.slice(0, 4) || '';
  }

  getLastFourChars(str: any): string {
    return str?.slice(-4) || '';
  }


}
