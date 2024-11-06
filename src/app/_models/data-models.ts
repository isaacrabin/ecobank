export interface Auth {
  accountType?: string;
  customerCategory?: string;
  emailAddress?: string;
  phoneNumber?: string;
  idNumber?: string;
  userType?: string;
  country?: string;
  existsOnT24?: string;
  multipleAccountsAllowed?: string;
  bundleCode?: string;
  name?: string;
  currency?: any;
  accountName?: string;
  existingYN?: string;
  key?: string;
}

export interface Identification {
  documentType?: string;
  idType?: string;
  passportCaptured?: any;
  signCaptured?: any;
  backId: {
    backIdBase64?: string;
    backIdFile?: File;
    backIdCaptured?: any;
    backIdFileNormal?: any;
  };
  frontId: {
    frontIdBase64?: string;
    frontIdCaptured?: any;
    frontIdFile?: any;
    frontIdOcrText?: string;
    frontIdFileNormal?: any;
  };
  ocrKey?: string;
  frontSaved?: boolean;

  backSaved?: boolean;
  passportBase64?: string;
  passportFileNormal?: any;
  passportFile?: File;
  passportSaved?: boolean;
  signatureBase64?: string;
  signatureFile?: any;
  signatureSaved?: boolean;
  taxBase64?: string;
  taxFile?: File;
  taxSaved?: boolean;
  nationalId?: string;
}

export interface Preferences {
  branch?: string;
  employeeIdentificationNumber?: string;
  nameOfNextofKin?: string;
  orderDebitCard?: string;
  phoneNumberOfnextOfKin?: string;
  physicalAddress?: string;
  promoCode?: string;
  relationshipWithNextOfKin?: string;
  residence?: string;
  systemTenantId?: string;
  usMailingAddress?: string;
  usPostalCode?: string;
  usSocialSecurityNumber?: string;
  wpfFormString?: string;
  accountBundle?: string;

  accountName?: string;
  accountNumber?: string;
  swiftCode?: string;
  getiBANNumber?: string;
  dividendDisposal?: string;
  phoneNumber?: string;
  taxBracket?: string;
  accountProduct?: [];
}

export interface Occupation {
  accountProduct?: string;
  dada?: string;
  dadaSegment?: string;
  employerName?: string;
  industry?: string;
  monthlyIncome?: string;
  occupation?: string;
  otherDescription?: string;
}

export interface Selfie {
  selfieBase64?: string;
  selfieFile?: any;
}

export interface Child {
  certFile?: File;
  certBase64?: string;
  certificateIssueDate?: string;
  certificateNumber?: string;
  childName?: string;
  currency?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface JointPrincipal {
  memberType?: String;
  customerNumber?: String;
}

export interface AccountProduct {
  accountType: string;
  benefits: string;
  bundleCode?: string;
  bundleId: string;
  features?: string;
  id: string;
  initialBalance?: string;
  monthlyFee?: string;
  multipleAccountsAllowed?: string;
  name: string;
  openningBalance: string;
  policyDecription: string;
  policyImageName?: string;
  policyTitle: string;
  targetMarket?: string;
}

export interface AccountMember {
  custNumber?: string;
  email?: string;
  idNumber?: string;
  name?: string;
  phoneNumber?: string;
  selected?: boolean;
}
