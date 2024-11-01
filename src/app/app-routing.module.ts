import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'account-types',
    loadChildren: () => import('./account-types/account-types.module').then( m => m.AccountTypesPageModule)
  },
  {
    path: 'account-products',
    loadChildren: () => import('./account-products/account-products.module').then( m => m.AccountProductsPageModule)
  },
  {
    path: 'requirements',
    loadChildren: () => import('./requirements/requirements.module').then( m => m.RequirementsPageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./onboarding-individual/onboarding-individual.module').then( m => m.OnboardingIndividualModule)
  },
  {
    path: 'onboarding/joint',
    loadChildren: () => import('./onboarding-joint/onboarding-joint.module').then( m => m.OnboardingJointModule)
  },
  {
    path: 'onboarding/business',
    loadChildren: () => import('./onboarding-business/onboarding-business.module').then( m => m.OnboardingBusinessModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
