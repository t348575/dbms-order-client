import {Component, Input, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {CartModel} from '../../models/cart-model';
import {CartService} from '../../services/cart.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
    items: CartModel[];
    constructor(private popover: PopoverController, private cart: CartService) {
        this.items = cart.getCartStatic();
    }
    ngOnInit() {}
    addItem(item: CartModel) {
        this.cart.addToCart(item.product);
        this.items = this.cart.getCartStatic();
    }
    removeItem(item: CartModel) {
        this.cart.removeFromCart(item.product);
        this.items = this.cart.getCartStatic();
    }
}
