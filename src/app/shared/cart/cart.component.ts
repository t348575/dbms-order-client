import {Component, Input, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {CartModel} from '../../models/cart-model';
import {CartService} from '../../services/cart.service';
import {AuthService} from '../../services/auth.service';
import {ToastService} from '../../services/toast.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
    items: CartModel[];
    total = 0;
    constructor(private popover: PopoverController, private cart: CartService, private auth: AuthService, private router: Router) {
        this.items = cart.getCartStatic();
        this.calcTotal();
    }
    ngOnInit() {}
    addItem(item: CartModel) {
        this.cart.addToCart(item.product);
        this.items = this.cart.getCartStatic();
        this.calcTotal();
    }
    removeItem(item: CartModel) {
        this.cart.removeFromCart(item.product);
        this.items = this.cart.getCartStatic();
        this.calcTotal();
    }
    calcTotal() {
        this.total = 0;
        for (const v of this.items) {
            this.total += v.count * v.product.prod_price;
        }
    }
    checkout() {
        if (this.auth.isLoggedIn()) {
            this.popover.dismiss();
            this.router.navigate(['/checkout']).then().catch();
        } else {
            ToastService.toast('Login in first!', 3000, 'danger');
        }
    }
}
