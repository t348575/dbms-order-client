import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {ToastService} from '../services/toast.service';
import {CartModel} from '../models/cart-model';
import {CartService} from '../services/cart.service';
import {AlertController, ViewWillEnter} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.page.html',
    styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements ViewWillEnter {
    items: CartModel[];
    total = 0;
    slides = [true, false, false];
    countries: { name: string, dial_code: string, code: string }[] = [];
    addressForm: FormGroup;
    paymentForm: FormGroup;
    constructor(
        private auth: AuthService,
        private router: Router,
        private cart: CartService,
        private alertController: AlertController,
        private http: HttpClient,
        private formBuilder: FormBuilder
    ) {
        if (!this.auth.isLoggedIn()) {
            ToastService.toast('Login first to checkout!', 3000, 'danger');
            this.router.navigate(['']).then().catch();
        }
        this.items = this.cart.getCartStatic();
        this.calcTotal();
        this.addressForm = this.formBuilder.group({
            country: ['', [Validators.required]],
            phone: ['', [Validators.required, Validators.minLength(10)]],
            name: ['', Validators.required],
            address: ['', Validators.required]
        });
        this.http.get('./assets/countries.json').subscribe((data: { name: string, dial_code: string, code: string }[]) => {
            this.countries = data;
            this.countries = this.countries.filter(a => a.dial_code !== null && a.dial_code.length < 5);
            this.http.get('http://ip-api.com/json/').subscribe((data2: any) => {
                // this.form.get('code').setValue(this.countries[this.countries.findIndex(a => a.code === data2.countryCode)].dial_code);
            });
        });
    }
    addItem(item: CartModel) {
        this.cart.addToCart(item.product);
        this.items = this.cart.getCartStatic();
        this.calcTotal();
    }
    async deleteItem(item: CartModel) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alert',
            message: 'Are you sure you want to remove this item from cart?',
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        this.cart.deleteFromCart(item.product);
                        this.items = this.cart.getCartStatic();
                        this.calcTotal();
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'danger'
                }
            ]
        });
        await alert.present();
    }
    async removeItem(item: CartModel) {
        if (item.count - 1 === 0) {
            const alert = await this.alertController.create({
                cssClass: 'my-custom-class',
                header: 'Alert',
                message: 'Are you sure you want to remove this item from cart?',
                buttons: [
                    {
                        text: 'Yes',
                        handler: () => {
                            this.cart.removeFromCart(item.product);
                            this.items = this.cart.getCartStatic();
                            this.calcTotal();
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'danger'
                    }
                ]
            });
            await alert.present();
        } else {
            this.cart.removeFromCart(item.product);
            this.items = this.cart.getCartStatic();
            this.calcTotal();
        }
    }
    calcTotal() {
        this.total = 0;
        for (const v of this.items) {
            this.total += v.count * v.product.prod_price;
        }
    }
    setSlide(slideNo: number) {
        this.slides = this.slides.map(a => false);
        this.slides[slideNo] = true;
    }
    ionViewWillEnter() {
        this.slides = [true, false, false];
    }
}
