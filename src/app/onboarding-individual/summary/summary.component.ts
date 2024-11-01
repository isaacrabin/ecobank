/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/_services/api.service';
import { DataStoreService } from 'src/app/_services/data-store.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit, AfterViewChecked {
  loading: boolean = false;
  fetchSummary: boolean = false;
  summary: any = null;
  auth: any;
  imageUrl: string = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private dataStore: DataStoreService,
    public loader: LoadingService,
    private toastr: ToastrService
  ) {
    this.imageUrl = environment.imageUrl
  }

  ngOnInit() {}

  ngAfterViewChecked() {
    if (!this.fetchSummary) {
      this.getSummary();

      this.fetchSummary = true;
    }
  }

  createAccount() {
    this.cleanEditLocalStorage();

    //Create Pure Save Account
    this.pureSave();
    // switch (this.summary.accountCode) {
    //   case '1002':
    //     switch (this.summary.multipleAccountsFlag) {
    //       case 'Y':
    //         this.jointAcc();
    //         break;
    //       case 'N':
    //         this.pureSave();
    //         break;
    //       default:
    //         break;
    //     }
    //     break;
    //   case '1003':
    //     this.pureSave();
    //     break;
    //   case '6002':
    //     this.childAcc();
    //     break;
    //   default:
    //     break;
    // }
  }

  pureSave() {
    if (this.auth?.customerCategory === 'Invited') {
      this.loader.loading = true;
      this.apiService.triggerJointAccount().subscribe({
        next: (response) => {
          this.loader.loading = false;

          if (response.successful) {
            this.router.navigate(['/onboarding/success'], {
              queryParams: { success: true },
            });
          } else {
            this.toastr.show('Error creating joint account');
          }
        },
        error: (error) => {
          this.loader.loading = false;
          this.toastr.show('Error creating joint account');
        },
      });
    } else {
      this.loader.loading = true;
      this.apiService.createAccount().subscribe({
        next: (res) => {
          if (res.successful) {
            this.loader.loading = false;
            this.router.navigate(['/onboarding/success'], {
              queryParams: { success: res.successful },
            });
          } else {
            this.router.navigate(['/onboarding/success'], {
              queryParams: { success: res.successful },
            });
          }
        },
        error: (err) => {
          this.loader.loading = false;
        },
      });
    }
  }

  async jointAcc() {
    if (this.dataStore.auth.customerCategory === 'Invited') {
      this.pureSave();
    } else {
      const accountMember = {
        custNumber: this.summary.customerNumber,
        name: this.summary.name,
        idNumber: this.summary.nationalId,
        selected: false,
        email: this.summary.emailAddress,
        phoneNumber: this.summary.phoneNumber,
      };
      let members = [];
      members.push(accountMember);
      localStorage.setItem('jointMember', JSON.stringify(members));
      setTimeout(()=>{
        this.router.navigate(['/onboarding/joint/members']);
      },200)

      // if (this.dataStore.joint.length > 0) {
      //   console.log('LEN', this.dataStore.joint)
      //   this.router.navigate(['/onboarding/joint/members']);
      // } else {
      //   console.log('EMPTY', this.dataStore.joint)
      //   this.dataStore.joint.push(accountMember);
      //   this.router.navigate(['/onboarding/joint/members']);
      //   localStorage.setItem('jointMember', JSON.stringify(accountMember));
      // }
    }
  }

  childAcc() {
    this.router.navigate(['/onboarding/child']);
  }

  getSummary() {
    this.apiService.getSummary().subscribe({
      next: (res) => {
          this.fetchSummary = true;
          if (res.successful) {
            this.summary = res.object;

            const principalMember ={
              customerNumber: this.summary.customerNumber,
              memberType: 'PRINCIPAL'
            }
            localStorage.setItem('principalMember', JSON.stringify(principalMember));
          }
      },
      error: (error) => {
        this.fetchSummary = true;
      }
    });
  }

  /** make flag on local storage to return the user back to this page  */
  editSection(selection: String) {
    switch (selection) {
      case 'IDENTIFICATION': // no need for flag .. page has resume capability
        this.fetchSummary = false;
        this.router.navigateByUrl('/onboarding/auth', { replaceUrl: false });
        break;
      case 'ACCOUNT PREFERENCES':
        this.fetchSummary = false;
        this.router
          .navigateByUrl('/onboarding/preferences', { replaceUrl: false })
          .then(() => {
            localStorage.setItem(
              'summary_edit_flag',
              '/onboarding/preferences'
            );
          });

        break;
      case 'NEXT OF KIN':
        this.fetchSummary = false;
        this.router
          .navigateByUrl('/onboarding/preferences', { replaceUrl: false })
          .then(() => {
            localStorage.setItem(
              'summary_edit_flag',
              '/onboarding/preferences'
            );
          });

        break;
      case 'OCCUPATION':
        this.fetchSummary = false;
        this.router
          .navigateByUrl('/onboarding/occupation', { replaceUrl: false })
          .then(() => {
            localStorage.setItem('summary_edit_flag', '/onboarding/occupation');
          });

        break;
    }
  }

  cleanEditLocalStorage() {
    this.fetchSummary = false;
    localStorage.removeItem('summary_edit_flag');
  }

containsObject(obj: any, list: any[]){
    var x;
    for (x in list) {
        if (list.hasOwnProperty(x) && list[x] === obj) {
            return true;
        }
    }

    return false;
}
}
