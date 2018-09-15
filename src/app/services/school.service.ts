import { AppConfig } from './../../environments/environment.prod';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerResponse } from '../models/login-response.model';


@Injectable({ providedIn: 'root' })
export class SchoolService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<ServerResponse>(`${AppConfig.apiUrl}/api/schools`);
    }
}
