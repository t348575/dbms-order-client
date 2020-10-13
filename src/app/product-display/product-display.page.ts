import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductModel } from '../models/product-model';
import {ProductsService} from '../services/products.service';
import {CartService} from '../services/cart.service';
import {ToastService} from '../services/toast.service';

@Component({
    selector: 'app-product-display',
    templateUrl: './product-display.page.html',
    styleUrls: ['./product-display.page.scss'],
})
export class ProductDisplayPage implements OnInit {
    // tslint:disable-next-line:variable-name
    prod_id = '';
    product: ProductModel = {
        prod_img: 'assets/alt-img.jpg',
        prod_price: 0,
        prod_name: '',
        prod_desc: '',
        prod_id: '',
        prod_dim: 0,
        prod_feat: '',
        prod_rating: 0,
        prod_stock: 0,
        prod_type: 1
    };
    constructor(private products: ProductsService,private activatedRoute: ActivatedRoute, private cart: CartService) {
        this.activatedRoute.paramMap.subscribe(params => {
            this.prod_id = params.get('id');
            this.products.getProductsByID([this.prod_id]).subscribe(value => {
                if (value.length > 0) {
                    try {
                        // @ts-ignore
                        value[0].prod_dim = JSON.parse(value[0].prod_dim);
                    } catch (e) {}
                    this.product = value[0];
                }
            });
        });
    }
    getAvailable(stock: number) {
        if (stock > 0) {
            return 'Available';
        } else {
            return 'Out of stock!';
        }
    }
    getRating(rating: number): string | number {
        return rating < 0 ? 'N/A' : rating;
    }
    addToCart(product: ProductModel) {
        this.cart.addToCart(product);
    }
    getDim(): string {
        if (typeof this.product.prod_dim === 'number') {
            return `Unit weight: ${this.product.prod_dim}`
        } else {
            return `Width: ${this.product.prod_dim.x}, Height: ${this.product.prod_dim.y}, Length: ${this.product.prod_dim.z}, Weight: ${this.product.prod_dim.w}`;
        }
    }
    ngOnInit() {

    }
}
