import { Component } from '@angular/core';
import {ProductsService} from '../services/products.service';
import {ProductModel} from '../models/product-model';
import {CartService} from '../services/cart.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    prod: ProductModel[][] = [];
    pageNum = 0;
    constructor(private products: ProductsService, private cart: CartService) {
        this.products.browse(this.pageNum, 25).subscribe((data: ProductModel[]) => {
            this.pageNum++;
            while (data.length > 0) {
                this.prod.push(data.splice(0, 5));
            }
        }, error => { console.log(error); });
    }
    addToCart(product: ProductModel) {
        this.cart.addToCart(product);
    }
    loadData(event) {
        this.products.browse(this.pageNum, 25).subscribe((data: ProductModel[]) => {
            this.pageNum++;
            while (data.length > 0) {
                this.prod.push(data.splice(0, 5));
            }
            console.log(this.prod);
            event.target.complete();
            // event.target.disabled = true;
        }, error => { console.log(error); });
    }
}
