import { Component, OnInit } from '@angular/core';
import {ProductsService} from '../services/products.service';
import {ActivatedRoute} from '@angular/router';
import {ProductModel} from '../models/product-model';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
    products: ProductModel[] = [];
    search = '';
    sortBy: 'prod_price' | 'prod_stock' | 'prod_rating' = 'prod_rating';
    dir: 'asc' | 'desc' = 'desc';
    page = 0;
    pageSize: 25 | 50 | 100 = 25;
    constructor(private productService: ProductsService, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.paramMap.subscribe(data => {
            this.search = data.get('search');
            this.productService.search(this.search, this.page, this.pageSize, this.sortBy, this.dir).subscribe(data2 => {
                this.products = data2;
            });
        });
    }
    ngOnInit() {
    }
}
