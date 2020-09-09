import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../../constants';
import * as qs from 'query-string';
import {Observable} from 'rxjs';
import {ProductModel} from '../models/product-model';
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
    predict(search: string): Observable<ProductModel[]> {
        return new Observable<ProductModel[]>(observer => {
            const query = qs.stringify({search});
            this.http.get(`${Constants.server}/products/predictSearch?${query}`).subscribe((data: ProductModel[]) => {
                observer.next(data);
            });
        });
    }
}
