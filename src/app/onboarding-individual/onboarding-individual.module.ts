import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingIndividualRoutingModule } from './onboarding-individual-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdentificationComponent } from './identification/identification.component';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../_services/api.service';
import { IdScanComponent } from './id-scan/id-scan.component';
import { DataStoreService } from '../_services/data-store.service';
import { PreferencesComponent } from './preferences/preferences.component';
import { NextOfKinComponent } from './next-of-kin/next-of-kin.component';
import { OccupationComponent } from './occupation/occupation.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { IonicSelectableComponent } from 'ionic-selectable';
import { TypeaheadComponent } from "../_components/typeahead/typeahead.component";


@NgModule({
    declarations: [
        IdentificationComponent,
        IdScanComponent,
        PreferencesComponent,
        NextOfKinComponent,
        OccupationComponent
    ],
    providers: [ApiService, DataStoreService],
    imports: [
        CommonModule,
        OnboardingIndividualRoutingModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxIntlTelInputModule,
        IonicSelectableComponent,
        TypeaheadComponent
    ]
})
export class OnboardingIndividualModule { }
