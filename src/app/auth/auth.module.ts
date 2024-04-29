import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BrowserModule } from '@angular/platform-browser';
import { LoadingService } from '../_services/loading.service';
import { OtpFormComponent } from './otp-form/otp-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../_services/api.service';
import { ToastrService } from 'ngx-toastr';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    HttpClientModule,



    NgxIntlTelInputModule,
    NgOtpInputModule,
    ReactiveFormsModule,
  ],
  declarations: [AuthPage,OtpFormComponent],
  providers:[LoadingService,ApiService,ToastrService]
})
export class AuthPageModule {}
