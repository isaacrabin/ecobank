/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.scss'],
  imports:[IonicModule],
  standalone: true
})
export class ViewMoreComponent  implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
  ) { }

  ngOnInit() {}

  close(){
    this.modalCtrl.dismiss();
  }

  viewRequirements(){
    this.modalCtrl.dismiss();
    this.router.navigate(['requirements']);
  }

}
