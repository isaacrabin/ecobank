/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { LoadingService } from '../_services/loading.service';
import { ModalController } from '@ionic/angular';
import { OtpFormComponent } from './otp-form/otp-form.component';
import { ProgressService } from '../_services/progress.service';
import { Auth } from '../_models/data-models';
import { DataStoreService } from '../_services/data-store.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { trimPayload } from '../_helpers/payload-trimmer';
import {  encrypt, encryptPayload } from '../_helpers/string-encryptor';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  authForm: FormGroup;
  termsAccepted: boolean = false;

  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;

  // siteKey: string = "6LeeUt4pAAAAACcoX3NQ2Nk3hfWM2eqwu3fS3SIN";
  siteKey: string = "6LdT6lspAAAAAJF4rE4A4ZkX8ZQlkqazhAaFBlcF";
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;
  public progress = 0;
  auth: Auth = {}

  get f() {
    return this.authForm.controls;
  }


  constructor(
    private fb: FormBuilder,
    private progressService: ProgressService,
    public loader: LoadingService,
    private  modalCtrl: ModalController,
    public dataStore: DataStoreService,
    private router: Router,
    private toastr: ToastrService,
    private apiService: ApiService
  ) {
    this.authForm = this.fb.group({
      phone: ['', Validators.required],
      recaptcha: ['', Validators.required],
      emailAddress: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ]
    });

    setInterval(() => {
      this.progress += 0.01;

      // Reset the progress bar when it reaches 100%
      // to continuously show the demo
      if (this.progress > 1) {
        setTimeout(() => {
          this.progress = 0;
        }, 1000);
      }
    }, 50);

  }

  ngOnInit() {
    this.dataStore.auth = JSON.parse(localStorage.getItem("auth") ?? '');
  }

  onTermsChange(event: any){
    this.termsAccepted = event.detail.checked;;
  }


  checkboxChanged(){}

  handleSuccess(data: any) {
    this.captchaSuccess = true;
    this.captchaResponse = data;
  }

  handleReset(){}

  handleExpire(){}
  handleLoad(){}



  async validateOtp(data: any){
    const modal = await this.modalCtrl.create({
      component: OtpFormComponent,
      componentProps:{ auth: data},
    });
    await modal.present();
  }

  // Login
  login() {
    this.loader.loading = true;
    const {phone,emailAddress,recaptcha} = this.authForm.value;

     // Get the form values
     this.auth.phoneNumber = phone.e164Number.replace("+", "");
     this.auth.emailAddress = emailAddress;
     this.auth.userType = this.dataStore.auth.userType ?? "";
     this.auth.accountType = this.dataStore.auth.accountType ?? "";
     this.auth.customerCategory = "";
     this.auth.country = phone.countryCode
     this.auth.bundleCode = this.dataStore.auth.bundleCode ?? "";
     this.auth.multipleAccountsAllowed =
      this.dataStore.auth.multipleAccountsAllowed ?? "";
     this.auth.currency = this.dataStore.auth.currency ?? "KES";
     this.auth.name = this.dataStore.auth.name ?? "";
     this.auth.key = encrypt(phone.e164Number.replace("+", ""));

     trimPayload(this.auth);
     // Save Payload to service
     this.dataStore.auth = this.auth;
     // Set cookies
     localStorage.setItem("auth", JSON.stringify(this.auth));
     // Send payload

     this.apiService.login(this.auth).subscribe({

        next:(res) => {
          this.loader.loading = false;
          if (res.successful) {
            this.toastr.success(res.message);
            this.validateOtp(this.auth);
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

}
