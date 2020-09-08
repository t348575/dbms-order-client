import { Injectable } from '@angular/core';
import {AutoCompleteService} from 'ionic4-auto-complete';
import {ProductModel} from '../models/product-model';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SearchService implements AutoCompleteService {
    private results: ProductModel[] = [];
    constructor() { }
    getResults(term: string): Observable<ProductModel[]> {
        return new Observable<ProductModel[]>(observer => {
        });
    }
    getItemLabel(item: any): any {
    }
}
