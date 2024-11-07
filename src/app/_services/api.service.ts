import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { environment } from 'src/environments/environment';
import { MainAccountDetails, ResAccountProducts } from '../_models/business-model';
import { DataStoreService } from './data-store.service';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = environment.baseUrl;

  constructor(
    private dataStore: DataStoreService,
    private http: HttpClient) {}

  /** fetch MainAccountDetails *GET*  request*/
  getMainAccountDetails(): Observable<MainAccountDetails> {
    return this.http.get<MainAccountDetails>(environment.businessUrlV1 + 'fetchParentAccounts');
  }

  // Get Account Types
  getAccountTypes(): Observable<any> {
    return this.http.get(this.baseUrl + 'accountType');
  }

   // Get account type bundle product
   getAccountTypeBundleProduct(tagId: string): Observable<ResAccountProducts> {
    return this.http.get<any>(environment.businessUrlV2 + 'bundleProduct?accountTag=' + tagId);
  }


  // Auth service
  login(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + 'auth', payload);
  }

  // Verify OTP
  verifyOTP(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + 'otp', payload);
  }

  // Verify OTP
  verifyID(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + 'auth', payload);
  }


  validateCDSAccount(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + 'account-check/cv-account-validation', payload);
  }


  // Scan Front ID
  // Scan Front ID
  // scanFrontID(payload: any): Observable<any> {

  //   const header1= {'API_KEY': environment.apiKey,};
  //   const customExif = JSON.stringify({
  //     timestamp: new Date().toISOString(),
  //     customField: 'prof_nas_fcr'
  //   });


  //   // Convert the encryption process to an Observable
  //   const encryptedExif = this.dataStore.enkript(customExif);
  //   // Handle the form data and HTTP request

  //       const formData = new FormData();
  //       for (const key in payload) {
  //         if (payload.hasOwnProperty(key)) {
  //           formData.append('image', payload[key]);
  //         }
  //       }
  //       formData.append('pamba', encryptedExif);

  //       return this.http.post<any>(`${environment.devOcr}frontid`, formData, { headers: header1 });

  // }

  // Scan Back ID / Passport
  // scanBackID(payload: any): Observable<any> {

  //   let header1;
  //   let customExif;


  //   if (this.dataStore.scanningPassport) { // settings for Passport

  //     header1= {'API_KEY': environment.apiKey,};
  //     customExif = JSON.stringify({
  //       timestamp: new Date().toISOString(),
  //       customField: 'prof_nas_pcr'
  //     });


  //   } else { // setting for Back ID

  //     header1= {'API_KEY': environment.apiKey,};
  //     customExif = JSON.stringify({
  //       timestamp: new Date().toISOString(),
  //       customField: 'prof_nas_bcr'
  //     });

  //   }


  //   // Convert the encryption process to an Observable
  //   const encryptedExif = this.dataStore.enkript(customExif);
  //   // Handle the form data and HTTP request

  //   const formData = new FormData();
  //       for (const key in payload) {
  //         if (payload.hasOwnProperty(key)) {
  //           formData.append('image', payload[key]);
  //         }
  //       }
  //       formData.append('pamba', encryptedExif);

  //   return this.http.post<any>(`${environment.devOcr}frontid`, formData, { headers: header1 });

  // }


  scanMrz(payload: any): Observable<any> {
    return this.http.post(`${environment.ocrUrl}ocr_mrz`, payload);
  }

  scanFrontIDNormal(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.ocrUrl}frontid`, payload);
  }

  // Save Images
  saveImage(payload: any): Observable<any> {
    const formData = new FormData();
    for (const key in payload) {
      if (payload) {
        formData.append(key, payload[key]);
      }
    }
    return this.http.post(this.baseUrl + 'image', formData,{
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)

  );
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }




  // Save Preferences
  savePreferences(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + 'preferences', payload);
  }

  // Get branches
  getBranches(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/branch');
  }

  // Get countries
  getCountries(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/country');
  }

  // Get employers
  getEmployers(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/employer');
  }

  // Get industries
  getIndustries(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/industry');
  }

  // Get occupations
  getOccupations(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/occupation');
  }

  // Get occupations
  getRelationships(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/relation');
  }

  // Get Incomes
  getIncomes(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/income');
  }

  // Get currencies
  getCurrencies(): Observable<any> {
    return this.http.get(this.baseUrl + 'dropdown/currency');
  }

  // Save Occupation
  saveOccupation(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + 'occupation', payload);
  }



  // Save Selfie
  saveSelfie(payload: any): Observable<any> {
    const formData = new FormData();
    for (const key in payload) {
      if (payload) {
        formData.append(key, payload[key]);
      }
    }
    return this.http.post(this.baseUrl + 'selfie', formData,{
      reportProgress: true,
      observe: 'events'
    });
  }

  // Create Account
  createAccount(): Observable<any> {
    return this.http.post(this.baseUrl + 'confirmation', {});
  }

  // Create Joint Account
  triggerJointAccount(): Observable<any> {

    return this.http.post(this.baseUrl + 'joint/invited', {});

  }

  // Create a child account
  createChild(payload: any): Observable<any> {
    const formData = new FormData();
    for (const key in payload) {
      if (payload) {
        formData.append(key, payload[key]);
      }
    }
    return this.http.post(this.baseUrl + 'child', formData);
  }

  // create joint account
  createJointAcc(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + 'joint', payload);
  }

  // Get Joint Account Inviter Details
  getJointAccountInviter(): Observable<any> {
    return this.http.get(this.baseUrl + 'joint');
  }

  // Get Summary of user account
  getSummary(): Observable<any> {
    return this.http.get(this.baseUrl + 'selfie');
  }

  // Notification account details
  getReminderDetails(): Observable<any> {
    return this.http.get(this.baseUrl + 'reminder');
  }


  // Save selfie for business of foreign directors
  saveImageForeignBIZ(payload: any): Observable<any> {

  const formData = new FormData();
  for (const key in payload) {
    if (payload) {
      formData.append(key, payload[key]);
    }
  }
  return this.http.post(environment.businessUrlV2 + 'foreignerDetails', formData,{
    reportProgress: true,
    observe: 'events'
  }).pipe(
    catchError(this.errorMgmt)

);
}

  // Save Images  TODO: HACK FOR BIZ
  saveImageBIZ(payload: any): Observable<any> {
    const formData = new FormData();
    for (const key in payload) {
      if (payload) {
        formData.append(key, payload[key]);
      }
    }
    return this.http.post(environment.businessUrlV1 + 'identityDocument', formData,{
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)

  );
  }

}
