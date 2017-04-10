import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { ItemDetailsPage } from '../item-details/item-details';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{tcOwner: string, tcDate: string, tcEmpType: string, tcType: string, tcStatus: string, tcpk: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http:Http) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    /*this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];   */


    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    var url = 'http://localhost:3001/timecardlist';
    var response = this.http.get(url).map(res => res.json()).subscribe(data => {

        this.items = [];
        let datepipe = new DatePipe('en-US');

        for(let i of data) {

          let latest_date =datepipe.transform(i.TimecardDate, 'MM/dd/yyyy');
          let statusName='';
          if(i.Status == 0)
            statusName = 'Submitted'
          else if(i.Status == 1)
            statusName = 'Manager Approved'
          else if(i.Status == 2)
            statusName = 'PM Approved'
          else if(i.Status == 3)
            statusName = 'Processing'
          else if(i.Status == 4)
            statusName = 'Posted'
          this.items.push({
            tcOwner: i.ManagerName,
            tcDate: i.TimecardDate,
            tcEmpType: i.EmployeeTypeName,
            tcType: i.TimecardTypeName,
            tcStatus: statusName,
            tcpk: i.TimecardPK
            //icon: this.icons[Math.floor(Math.random() * this.icons.length)]
          });
        }

    });

  }

  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }
}
