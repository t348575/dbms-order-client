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
    browse(page: number, pageSize: number) {
        const query = qs.stringify({
            pageSize,
            page
        });
        return this.http.get(`${Constants.server}/products/browse?${query}`);
    }
    search(
        search: string,
        page: number,
        pageSize: number,
        sortBy: 'prod_price' | 'prod_stock' | 'prod_rating',
        dir: 'asc' | 'desc'
    ): Observable<ProductModel[]> {
        return new Observable<ProductModel[]>(observer => {
            const query = qs.stringify({search, page, pageSize, sortBy, dir});
            this.http.get(`${Constants.server}/products/search?${query}`).subscribe((data: ProductModel[]) => {
                observer.next(data);
                observer.complete();
            });
        });
    }
    predict(search: string): Observable<ProductModel[]> {
        return new Observable<ProductModel[]>(observer => {
            const query = qs.stringify({search});
            this.http.get(`${Constants.server}/products/predictSearch?${query}`).subscribe((data: ProductModel[]) => {
                observer.next(data);
                observer.complete();
            });
        });
    }
    getProductsByID(ids: string[]): Observable<ProductModel[]> {
        return new Observable<ProductModel[]>(observer => {
            const query = qs.stringify({ids});
            this.http.get(`${Constants.server}/products/byId?${query}`).subscribe((data: ProductModel[]) => {
                observer.next(data);
                observer.complete();
            });
        });
    }
}
