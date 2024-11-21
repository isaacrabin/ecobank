/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IAccountType } from '../_models/types';
import { LoadingService } from '../_services/loading.service';
import { MainAccountDetails, ObjectMainAccountDetails } from '../_models/business-model';
import { ApiService } from '../_services/api.service';
import { ScrollDetail } from '@ionic/angular';

@Component({
  selector: 'app-account-types',
  templateUrl: './account-types.page.html',
  styleUrls: ['./account-types.page.scss'],
})
export class AccountTypesPage implements OnInit {

  productDetails: ObjectMainAccountDetails[] = [];
  scrollTop: number = 0;
  isScrolling = false;
  @ViewChild('scrollTarget', { static: false }) private scrollTarget: ElementRef | undefined;

  constructor(
    private router: Router,
    public loader: LoadingService,
    public apiService: ApiService,
  ) { }

  ngOnInit() {
    this.getMainAccountDetails();
  }



  getGreeting(): string {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 5 && hours < 12) {
        return "Good morning";
    } else if (hours >= 12 && hours < 17) {
        return "Good afternoon";
    } else if (hours >= 17 && hours < 21) {
        return "Good evening";
    } else {
        return "Hello";
    }
  }

  handleScrollStart() {
    this.isScrolling = true;
  }

  handleScroll(ev: CustomEvent<ScrollDetail>) {
    this.scrollTop = ev.detail.scrollTop;
  }

  handleScrollEnd() {
    this.isScrolling = false;
  }

    /** Fetch all account details */
  getMainAccountDetails(): void {
    this.loader.loading = true;
      this.apiService.getMainAccountDetails().subscribe({
        next: (res: MainAccountDetails) => {
          this.loader.loading = false;
          localStorage.setItem('all-main-accounts', JSON.stringify(res.object));
          localStorage.setItem('individual-account', JSON.stringify(res.object[0]));
          if (res.successful) {
            this.productDetails = res.object;
          }
        },
        error:(err) => {
          this.loader.loading = false;
        }
      })
  }


   /** Navigation  */
   onSelectAccoutType(i: number) {
    const accountToOpen = localStorage.getItem('individual-account');

    localStorage.setItem('account-to-open', JSON.stringify(this.productDetails[i]));
    switch (this.productDetails[i]?.shortDescription){
      case 'Individual Account':
        if(accountToOpen !== null) localStorage.setItem('account-to-open', accountToOpen);
        this.router.navigate(['account-products']);
        break;
        case 'Joint Account':
          const myJoint = localStorage.getItem('all-main-accounts');
          if( myJoint !== null){
            const jointData = JSON.parse(myJoint)[1]
            localStorage.setItem('account-to-open', JSON.stringify(jointData));
            this.router.navigate(['account-products']);
          }
        break;
        case 'Business Banking':
          this.router.navigate(['account-products']);
        break;

    }
  }

  scrollToBottom() {
    if (this.scrollTarget) {
      this.scrollTarget.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }


}
