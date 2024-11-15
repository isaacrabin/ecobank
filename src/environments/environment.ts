
// const imageUrl = "https://digitalonboard.ecobank.com/self-onboarding/images-sav/kyc-data/getImage/";
// const dev = 'https://digitalonboard.ecobank.com/self-onboarding/api/v1/';
// const dev1 = 'https://digitalonboard.ecobank.com/self-onboarding/api/business/v1/';
// const dev2 = 'https://digitalonboard.ecobank.com/self-onboarding/api/business/v2/';
// const ocrUrl = 'https://ai.giktek.io/'


const dev = 'https://uat-onboarding.stanbicbank.co.ke/rest/individual-onboarding/api/v1/';
const dev1 = 'https://uat-onboarding.stanbicbank.co.ke/rest/individual-onboarding/api/business/v1/';
const dev2 = 'https://uat-onboarding.stanbicbank.co.ke/rest/individual-onboarding/api/business/v2/';
const imageUrl = "https://uat-onboarding.stanbicbank.co.ke/rest/sms-mcs/image/getImage/";
const ocrUrl = 'https://ai.giktek.io/'


export const environment = {
  production: false,
  imageUrl: imageUrl,
  baseUrl: dev,
  businessUrlV1: dev1,
  businessUrlV2: dev2,
  ocrUrl,
  apiKey : '6a2b7f8e44d6c4efc8f3a9f5b6e9e7c2d4a8e0a1b9c3f6d7e8f5b6c7a2d1e3f4',

};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
