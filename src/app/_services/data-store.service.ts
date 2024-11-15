import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import * as aesjs from 'aes-js';
import base64url from 'base64url';
import {
  AccountMember,
  Auth,
  Child,
  Identification,
  JointPrincipal,
  Occupation,
  Preferences,
  Selfie,
} from '../_models/data-models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataStoreService {

  public selectedAccountProducts = new BehaviorSubject<any[]>([]);
  public selectedAccountProductsCount = new BehaviorSubject<number>(0);

  get selectedAccountProducts$(){
    return this.selectedAccountProducts.asObservable();
  }

  get selectedAccountProductsCount$(){
    return this.selectedAccountProductsCount.asObservable();
  }

  addAccountProduct(product: any){
    const currentValue = this.selectedAccountProducts.value;
    const updatedValue = [...currentValue, product];
    this.selectedAccountProducts.next(updatedValue);
    this.selectedAccountProductsCount.next(updatedValue.length);
  }

  removeAccountProduct(productToRemove: any){
    const currentValue = this.selectedAccountProducts.value;
    const updatedValue = currentValue.filter(product => product !== productToRemove);
    this.selectedAccountProducts.next(updatedValue);
    this.selectedAccountProductsCount.next(updatedValue.length);

}

  public scanningPassport: boolean = false;
  public selectedProducts: any = signal([]);

  constructor(private http: HttpClient) {}

  public auth: Auth = {};

  public identification: Identification = {
    frontId:{},
    backId:{}
  };

  private frontPayloadSubject = new BehaviorSubject<any | null>(null);
  frontPayload$ = this.frontPayloadSubject.asObservable();

  setFrontPayload(payload: any) {
    this.frontPayloadSubject.next(payload);
  }

  getFrontPayload(): any | null {
    return this.frontPayloadSubject.value;
  }

  public preferences: Preferences = {};

  public occupation: Occupation = {};

  public selfie: Selfie = {};

  public summary: any = {};

  public branches = [];

  public countries = [];

  public relationships = [];

  public occupations = [];

  public industries = [];

  public employers = [];

  public incomes = [];

  public joint: AccountMember[] = [];
  public jointPrincipal: JointPrincipal = {}

  public child: Child = {};

  enkript(msg: string): string {
    const key = '$EM8-NAYA?>#9xd2';
    const iv = 'B0l!nG-4L6TXSwB5';

    const keyBytes = aesjs.utils.utf8.toBytes(key);
    const ivBytes = aesjs.utils.utf8.toBytes(iv);

    const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
    const textBytes = aesjs.utils.utf8.toBytes(msg);
    const padded = aesjs.padding.pkcs7.pad(textBytes);
    const encryptedBytes = aesCbc.encrypt(padded);

    // Convert Uint8Array to Buffer
    const encryptedBuffer = Buffer.from(encryptedBytes);

    return base64url.encode(encryptedBuffer);
  }

  encryptFromPayload(payload: any): any {
    const customExif = JSON.stringify({
      timestamp: new Date().toISOString(),
      customField: payload.choice, //prof_nas_fcr
      file : payload.file
    });

    return this.enkript(customExif);
  }

}
