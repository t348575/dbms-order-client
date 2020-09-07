import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../../constants';
import * as qs from 'query-string';
@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    constructor(private http: HttpClient) { }
    browse(page: number, numPerPage: number) {
        const query = qs.stringify({
            pageSize: numPerPage,
            page
        });
        return this.http.get(`${Constants.server}/products/browse?${query}`);
    }
}
