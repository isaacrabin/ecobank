/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ViewMoreComponent } from './view-more/view-more.component';
import { Router } from '@angular/router';
import { ObjectMainAccountDetails } from '../_models/business-model';
import { LoadingService } from '../_services/loading.service';
import { ApiService } from '../_services/api.service';
import { DataStoreService } from '../_services/data-store.service';
import { environment } from 'src/environments/environment';
import { AccountProduct } from '../_models/data-models';

@Component({
  selector: 'app-account-products',
  templateUrl: './account-products.page.html',
  styleUrls: ['./account-products.page.scss'],
})
export class AccountProductsPage implements OnInit {

  loading: boolean = false;
  intro_txt: string = '';

  products: AccountProduct[] = [];
  imageUrl: string = environment.imageUrl;
  accountToOpen : ObjectMainAccountDetails = {
    id: '',
    shortDescription: '',
    longDescription: '',
    image: ''
  };

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slideShadows: true,
    slidesPerView: 1,

    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      spaceBetween: 50,
      modifier: 1,
      slideShadows: true,
    },
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },

  };


  constructor(
   private modalCtrl: ModalController,
   private router: Router,
   public loader: LoadingService,
   private apiService: ApiService,
   private dataStore: DataStoreService
  ) {
    this.accountToOpen = JSON.parse(localStorage.getItem('account-to-open') as string) ?? {};
    this.products = [
      {
        accountType:"1002",
        benefits:"<ul><li>Retrenchment Cover of up to Kes 450,000*.This is available to salaried clients</li><li>Life Cover of 6 months gross income/salary capped at Kes 900,000*</li><li>Funeral Cover of up Kes 100,000*</li><li>Ability to make payments locally and internationally via our digital channels</li><li>Access to Silver debit and credit card with no joining fees</li><li>Access to monthly cash advance via mobile banking</li><li>Free salary credit</li><li>Free Internet Banking access from anywhere in the world</li><li>Free e-statements</li>*Terms and conditions apply</ul><div><h5><span class=\"quote\">Do you require more information about the Smart Direct Account? SMS SMART to 22208 and we will call you back.&#160;</span></h5></div>",
        bundleCode:"",
        bundleId:"28",
        features:"<ul><li>Access to multiple current accounts in different currencies for the bundle fee</li><li>Available to salaried individuals</li><li>No minimum operating balance</li><li>Ability to deposit funds via M-Pesa</li><li>Pay as you transact for all transactions with an instant ledger fee of Kes 40 for non-self-service transactions i.e. transactions done at the branch</li></ul>",
        id:"28",
        initialBalance:"Kes 1000",
        monthlyFee:"Kes 200",
        multipleAccountsAllowed:"N",
        name:"Smart Direct",
        openningBalance:"Kes 1000",
        policyDecription: "For a nominal fee of Kes 200 per month, enjoy transactional banking which will enable you to make payments by cheques, bank transfers, debit card payments, drafts or online transfers and only pay when you transact.&#160;<br>",
        policyImageName:"POLICY_IMAGES/SmartDirect20210721114947.jpeg",
        policyTitle:"Smart Direct",
        targetMarket:"<ul><li>Preferable for salaried individuals earning between Kes 15,000 and Kes 150,000</li><li>Must be a Kenyan Citizen</li><li>Must be 18 years and above in age</li><li>Must have a valid KRA PIN</li></ul>"
      }
    ]
   }

  ngOnInit() {
    this.getAccountTypes();

  }


    // Get account Types
    getAccountTypes() {
      this.loader.loading = true;
      switch(this.accountToOpen?.shortDescription) {
        case 'Joint Account':
          this.intro_txt  = 'this Joint Account';
          break;

          case 'Individual Account':
            this.intro_txt  = 'one type of Individual Account';
            break;
      }

        this.apiService.getAccountTypeBundleProduct(this.accountToOpen?.id).subscribe({
          next: (res: any)=>{
            if (res.successful) {
              this.loader.loading = false;
              this.products = res.object;

              this.products.forEach((value: any) => {
                value.currency = {
                  kes: false,
                  usd: false,
                  eur: false,
                }

              });
            } else {
              this.products = [];
              this.loader.loading = false;
            }
          },
          error: (err: any) => {
            this.loader.loading = false;
        }
      });
    }

  async onViewMore(i: number){
    const product = await this.products[i];
    const modal = await this.modalCtrl.create({
      component: ViewMoreComponent,
      componentProps:{
        data: product
      },
    });
    await modal.present();
  }

   // Select the account type you wish to create
   async selectProduct(i: number) {
    const product = await this.products[i];

    this.dataStore.auth.accountType = product.bundleId;
    this.dataStore.preferences.accountBundle = product.bundleId;
    this.dataStore.occupation.accountProduct = product.bundleId;
    this.dataStore.auth.bundleCode = product.accountType;
    this.dataStore.auth.multipleAccountsAllowed =
      product.multipleAccountsAllowed;
    this.dataStore.auth.name = product.name;
    this.dataStore.auth.userType = "NORMAL";
    localStorage.setItem("auth", JSON.stringify(this.dataStore.auth));
    localStorage.setItem(
      "preferences",
      JSON.stringify(this.dataStore.preferences)
    );
    localStorage.setItem(
      "nextofkin",
      JSON.stringify(this.dataStore.preferences)
    );
    localStorage.setItem(
      "occupation",
      JSON.stringify(this.dataStore.occupation)
    );
    this.modalCtrl.dismiss();
    this.router.navigate(['requirements']);
  }
}
