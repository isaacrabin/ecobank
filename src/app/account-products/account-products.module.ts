import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountProductsPageRoutingModule } from './account-products-routing.module';

import { AccountProductsPage } from './account-products.page';
import { ApiService } from '../_services/api.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgOptimizedImage,
    AccountProductsPageRoutingModule
  ],
  declarations: [AccountProductsPage],
  providers: [ApiService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountProductsPageModule {}
