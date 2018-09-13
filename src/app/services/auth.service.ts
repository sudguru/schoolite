import { AppConfig } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<any>(`${AppConfig.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(res => {
                console.log(res);
                // login successful if there's a user in the response
                if (res.data) {
                    // store user details and basic auth credentials in local storage
                    // to keep user logged in between page refreshes
                    // user.authdata = window.btoa(username + ':' + password);
                    // token is contained in user object from php
                    localStorage.setItem('token', JSON.stringify(res.data));
                }

                return res;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('token');
    }
}
