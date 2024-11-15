/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { Item } from 'src/app/_models/types';
import { ApiService } from 'src/app/_services/api.service';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { LoadingService } from 'src/app/_services/loading.service';


@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
})
export class PreferencesComponent  implements OnInit {

  @ViewChild('modal', { static: true }) modal!: IonModal;

  dataForm: FormGroup;
  termsAccepted: boolean = false;

  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;

  selectedFruitsText: any = '0 Items';
  selectedFruits: string[] = [];
  showDebitCard: boolean = false;
  fatca: boolean = false;

  branches = [];
  countries: any = [];
  relationships = [];
  auth: any = {};

  //Instruments
  enableDebitCard: boolean = false;
  enableChequebook: boolean = false;
  enableOnlineBanking: boolean = false;

  branchesSample = [{
    branchCode:"KE0010019",
    branchEmail: "CSB_Buruburu@mail.standardbank.com",
    branchId:"40",
    branchName:"Buruburu"
  }];

  countrySample = [{
    countryCode:"KE",
    countryId:"92",
    countryName:"Kenya"
  }]

  currentPage = 1;
  hasMoreData = true;

  get f() {
    return this.dataForm.controls;
  }


  constructor(
    private fb: FormBuilder,
    public loader: LoadingService,
    private router: Router,
    private  modalCtrl: ModalController,
    private dataStore: DataStoreService,
    private toastr: ToastrService,
    private apiServie: ApiService  ) {
    this.dataForm = this.fb.group({
      residence: ['', Validators.required],
      branch: ['', Validators.required],
      address: ['', Validators.required],
      building: ["", [Validators.required]],
      usPostalCode: [""],
      usSocialSecurityNumber:[""],
      usMailingAddress: [""],
    });

    this.dataStore.preferences = {
      ...JSON.parse(localStorage.getItem("preferences") as string),
      ...JSON.parse(localStorage.getItem("nextofkin") as string),
    };
    this.auth = JSON.parse(localStorage.getItem("auth") as string);
    this.branches = JSON.parse(localStorage.getItem("branches") as string) ?? this.branchesSample;
    this.countries = JSON.parse(localStorage.getItem("countries") as string) ?? this.countrySample;

    if (this.auth?.accountType === '29' || this.auth?.accountType === '32'){
      this.showDebitCard = true;
    }
    else{
      this.showDebitCard = false;
    }
    this.dataStore.auth = JSON.parse(localStorage.getItem("auth") as string);
  }

  ngOnInit() {
  }

  verifyUser(){}




  checkboxChanged(){}


  countryChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    if(event.value.countryCode === 'US') this.fatca = true;

    if(event.value.countryCode !== 'US') this.fatca = false;
  }

  onSelect(event: any){

  }

  loadData(event: any) {
    // Fetch data for the next page
    this.fetchMoreData().then((newData: any) => {
      this.countries = [...this.countries, ...newData];
      this.currentPage++;

      // Check if there's more data to load
      this.hasMoreData = newData.length > 0;

      event.target.complete();
    });
  }

  fetchMoreData() {
    // Implement your data fetching logic here, e.g., using a service or API call
    // ...
    return new Promise(resolve => {
      // Simulate data fetching
      setTimeout(() => {
        const newData = [...Array(10)].map(x => ({ id: Math.random(), text: 'Item' }));
        resolve(newData);
      }, 1000);
    });
  }

  branchChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {}

  changeDebitCard(event: any){
    if(event.detail.checked) this.enableDebitCard = true;
  }

  changeChequeBook(event: any){
    if(event.detail.checked) this.enableChequebook = true;
  }

  // changeOnlineBanking(event: any){
  //   if(event.detail.checked) this.enableOnlineBanking = true;
  // }

  toNextOfKin(){
    this.loader.loading = true;
    setTimeout(()=>{
      this.loader.loading = false;
      const {residence, branch, address, building, usPostalCode, usSocialSecurityNumber, usMailingAddress} = this.dataForm.value;
      let debitCard = "N";
      let chequeBook = 'N';

      if(this.enableDebitCard) debitCard = "Y";
      if(this.enableChequebook) chequeBook = "Y";

      const preference = {
        residence: residence.countryCode ?? "",
        branch: branch?.branchCode ?? "",
        physicalAddress: `${address}#${building}`,
        orderDebitCard: debitCard,
        orderChequeBook: chequeBook,
        employeeIdentificationNumber: "",
        promoCode: "",
        rmCode: "",
        systemTenantId: "",
        usMailingAddress: usMailingAddress ?? "",
        usPostalCode: usPostalCode ?? "",
        usSocialSecurityNumber: usSocialSecurityNumber ?? "",
        wpfFormString:"",
        accountBundle: this.dataStore.preferences.accountBundle ?? "",
      }

      sessionStorage.setItem('preference', JSON.stringify(preference));
      this.toastr.success("Preference details saved");
      this.router.navigate(['/onboarding/next-of-kin'])
    },300)
  }

  formatSSN() {
    console.log("formatSSN");
    let val = this.dataForm.value.usSocialSecurityNumber.replace(/\D/g, '');
    let newVal = '';

    if (val.length > 4) {
      this.dataForm.patchValue({ usSocialSecurityNumber: val });
    }
    if (val.length > 3 && val.length < 6) {
      newVal += val.substr(0, 3) + '-';
      val = val.substr(3);
    }
    if (val.length > 5) {
      newVal += val.substr(0, 3) + '-';
      newVal += val.substr(3, 2) + '-';
      val = val.substr(5);
    }
    newVal += val;
    this.dataForm.patchValue({ usSocialSecurityNumber: newVal });
  }
}


