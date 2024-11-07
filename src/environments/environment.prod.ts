
const imageUrl = "https://digitalonboard.ecobank.com/self-onboarding/images-sav/kyc-data/getImage/";
const dev = 'https://digitalonboard.ecobank.com/self-onboarding/api/v1/';
const dev1 = 'https://digitalonboard.ecobank.com/self-onboarding/api/business/v1/';
const dev2 = 'https://digitalonboard.ecobank.com/self-onboarding/api/business/v2/';
const ocrUrl = 'https://ai.giktek.io/'



// const dev = 'https://uat-onboarding.stanbicbank.co.ke/rest/individual-onboarding/api/v1/';
// const dev1 = 'https://uat-onboarding.stanbicbank.co.ke/rest/individual-onboarding/api/business/v1/';
// const dev2 = 'https://uat-onboarding.stanbicbank.co.ke/rest/individual-onboarding/api/business/v2/';
// const ocrUrl = 'https://ai.giktek.io/'
// const imageUrl = "https://uat-onboarding.stanbicbank.co.ke/rest/sms-mcs/image/getImage/";


export const environment = {
  production: true,
  imageUrl: imageUrl,
  baseUrl: dev,
  ocrUrl,
  businessUrlV1: dev1,
  businessUrlV2: dev2,
  apiKey : '6a2b7f8e44d6c4efc8f3a9f5b6e9e7c2d4a8e0a1b9c3f6d7e8f5b6c7a2d1e3f4'
};
