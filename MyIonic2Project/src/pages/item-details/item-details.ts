import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  selectedItem: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http:Http) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    /*
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    var url = 'http://localhost:3001/timecardlist';
	  var response = this.http.get(url).map(res => res.json()).subscribe(data => {
        console.log(data[0]);
        this.selectedItem.title =data[0].ManagerName;
    });*/


  }
}
