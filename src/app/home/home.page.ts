import { Component } from '@angular/core';
import {ProductsService} from '../services/products.service';
import {ProductModel} from '../models/product-model';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    prod: ProductModel[][] = [];
    constructor(private products: ProductsService) {
        this.products.browse(0, 25).subscribe((data: ProductModel[]) => {
            while (data.length > 0) {
                this.prod.push(data.splice(0, 5));
            }
        }, error => { console.log(error); });
    }
}
