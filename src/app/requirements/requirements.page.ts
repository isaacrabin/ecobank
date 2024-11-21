/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TermsModalComponent } from './terms-modal/terms-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.page.html',
  styleUrls: ['./requirements.page.scss'],
})
export class RequirementsPage implements OnInit {

  constructor(
    private router: Router,
    private modalController: ModalController

  ) { }

  ngOnInit() {
  }

  viewRequirements(){
    this.router.navigate(['requirements']);
  }

  gotoAuth(){
    this.router.navigate(['auth']);
  }

  async openTerms() {
    await this.router.navigate(['auth']);
    // const modal = await this.modalController.create({
    // component: TermsModalComponent,
    //   cssClass: 'terms-modal',
    // });

    // modal.onWillDismiss().then((data: any) => {
    //   if(data.data === true){
    //     this.router.navigate(['auth']);
    //     return;
    //   }
    // })

    // return await modal.present();
  }

}
