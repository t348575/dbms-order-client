import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CartModel} from '../models/cart-model';
import {Constants} from '../../constants';
import {ProductModel} from '../models/product-model';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cart: CartModel[] = [];
    constructor(private http: HttpClient, private auth: AuthService) { }
    getCartStatic(): CartModel[] {
        if (!this.auth.isLoggedIn()) {
            this.cart = JSON.parse(localStorage.getItem('cart'));
            if (this.cart === null || this.cart === undefined) {
                localStorage.setItem('cart', JSON.stringify([]));
                return [];
            }
        }
        return this.cart;
    }
    getCart() {
        if (this.auth.isLoggedIn()) {
            this.http.get(`${Constants.server}/cart/getCart`).subscribe((data: CartModel[]) => {
                if (data === null || data === undefined) {
                    this.cart = [];
                } else {
                    this.cart = data;
                }
            });
        }
    }
    addToCart(product: ProductModel) {
        const idx = this.cart.findIndex(a => a.product.prod_id === product.prod_id);
        if (idx > -1) {
            this.cart[idx].count++;
        } else {
            this.cart.push({ product, count: 1 });
        }
        this.updateCart().subscribe(() => { this.getCart(); });
    }
    removeFromCart(product: ProductModel) {
        const idx = this.cart.findIndex(a => a.product.prod_id === product.prod_id);
        this.cart[idx].count--;
        if (this.cart[idx].count === 0) {
            this.cart.splice(idx, 1);
        }
        this.updateCart().subscribe(() => { this.getCart(); });
    }
    updateCart(): Observable<void> {
        const cart = this.cart.map(a => ({ count: a.count, product: a.product.prod_id}));
        // tslint:disable-next-line:max-line-length
        this.auth.isLoggedIn() ? localStorage.setItem(this.auth.getLoginToken(), JSON.stringify(this.cart)) : localStorage.setItem('cart', JSON.stringify(this.cart));
        return new Observable<void>(observer => {
            if (this.auth.isLoggedIn()) {
                this.http.post(`${Constants.server}/cart/updateCart`, { cart }).subscribe(() => {
                    observer.next();
                    observer.complete();
                }).unsubscribe();
            } else {
                observer.next();
                observer.complete();
            }
        });
    }
}
