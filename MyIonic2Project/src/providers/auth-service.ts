import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {URLSearchParams} from '@angular/http';

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

export class User {
  name: string;
  email: string;
 
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Injectable()
export class AuthService {

	currentUser: User;
	public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!


		let params: URLSearchParams = new URLSearchParams();
		params.set('userid', credentials.email);
		params.set('password', credentials.password);

        var url = 'http://localhost:3001/verifyUser';
    	var response = this.http.get(url,{
		   search: params
		 }).map(res => res.text()).subscribe(data =>{
			 	if(data == 'yes'){
			        //this.currentUser = new User('Simon', 'saimon@devdactic.com');
			        observer.next(true);
			        observer.complete();
			    }else{
			    	observer.next(false);
			        observer.complete();
			    }
		   	});
      });
    }
  }
 
  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }
 
  public getUserInfo() : User {
    return this.currentUser;
  }
 
  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

  constructor(public http: Http) {
    //console.log('Hello AuthService Provider');
  }

}
