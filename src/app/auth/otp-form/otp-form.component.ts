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
  otpForm: FormGroup;
  resend: boolean = false;

  countDown: Subscription;
  counter = 56;
  tick = 1000;


  get of() {
    return this.otpForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    public loader: LoadingService,
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService,
    private modalCtrl: ModalController
  ) {
    this.otpForm = this.fb.group({
      smsCode: ["", [Validators.required]],
    });

    this.countDown = timer(0, this.tick)
    .pipe(take(this.counter))
    .subscribe(() => {
      --this.counter;
      // console.log(this.counter);
      if (this.counter == 0) {
        this.countDown.unsubscribe();
        this.resend = true;
      }
    });
  }

  ngOnInit() {

  }

   // Verify Sms Code then redirect to the correct step if the user had dropped off at some point
   verifyOtp() {
    this.loader.loading = true;
      this.apiService
        .verifyOTP({
          phoneNumber: this.auth.phoneNumber,
          smsCode: this.of['smsCode'].value,
        })
        .subscribe(
          {
            next: (res) => {
            if (res.successful) {
              this.loader.loading = false;
              this.modalCtrl.dismiss();
                switch (res.stepCode){
                  case 100:
                    this.router.navigate(["/onboarding/account-options"]);
                    break;
                  case 101:
                    this.router.navigate(["/onboarding/account-options"]);
                    break;
                  case 102:
                    this.router.navigate(["/onboarding/account-options"]);
                    break;
                  case 103:
                    this.router.navigate(["/onboarding/account-options"]);
                    break;
                  case 104:
                    this.router.navigate(["/onboarding/account-options"]);
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
        ); // end call
    }

  resendCode(){}

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }

}
