import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {ToastService} from '../services/toast.service';
import {CartModel} from '../models/cart-model';
import {CartService} from '../services/cart.service';
import {AlertController, AnimationController, ViewWillEnter} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilityService} from '../services/utility.service';
import {UserService} from '../services/user.service';
import {CountryPhoneModel, CountryRegionModel, RegionModel} from '../models/country-model';
import {OrderService} from '../services/order.service';
@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.page.html',
    styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements ViewWillEnter {
    items: CartModel[];
    total = 0;
    slides = [true, false, false, false];
    phoneCodes: CountryPhoneModel[] = [];
    countries: CountryRegionModel[] = [];
    regions: RegionModel[] = [];
    addressForm: FormGroup;
    paymentForm: FormGroup;
    animations = [];
    cc: any;
    @ViewChild('one') one;
    @ViewChild('two') two;
    @ViewChild('three') three;
    constructor(
        private auth: AuthService,
        private router: Router,
        private cart: CartService,
        private alertController: AlertController,
        private formBuilder: FormBuilder,
        private utilityService: UtilityService,
        private userService: UserService,
        private animationCtrl: AnimationController,
        private orderService: OrderService
    ) {
        if (!this.auth.isLoggedIn()) {
            ToastService.toast('Login first to checkout!', 3000, 'danger');
            this.router.navigate(['']).then().catch();
        }
        this.items = this.cart.getCartStatic();
        this.calcTotal();
        this.addressForm = this.formBuilder.group({
            country: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            name: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            region: ['', Validators.required],
            pinCode: ['', Validators.required],
            code: ['', Validators.required]
        });
        this.paymentForm = this.formBuilder.group({
            number: ['', Validators.required],
            name: ['', Validators.required],
            exp: ['', Validators.required],
            cvc: ['', Validators.required]
        });
        this.utilityService.getCurrentCountryPhoneCode().subscribe(phoneCode => {
            setTimeout(() => {
                this.utilityService.getPhoneCodeList().subscribe(data => {
                    this.phoneCodes = data;
                    this.addressForm.get('code').setValue(phoneCode);
                });
            }, 500);
        });
        this.utilityService.getCountryRegionList().subscribe(data => {
            this.countries = data;
            this.utilityService.getCurrentCountry().subscribe(curr => {
                for (const v of this.countries) {
                    if (v.countryShortCode === curr) {
                        this.addressForm.get('country').setValue(v.countryName);
                        this.setRegions();
                        setTimeout(() => {
                            const currRegion = this.utilityService.getCurrentRegion();
                            for (const k of v.regions) {
                                if (k.name === currRegion) {
                                    this.addressForm.get('region').setValue(currRegion);
                                    break;
                                }
                            }
                        }, 500);
                        if (this.utilityService.getCurrentCity().length > 0) {
                            this.addressForm.get('city').setValue(this.utilityService.getCurrentCity());
                        }
                        break;
                    }
                }
            });
        });
    }
    dotAnimation(mode: 'play' | 'pause') {
        if (mode === 'play') {
            let i = 0;
            for (const v of this.animations) {
                setTimeout(() => {
                    v.play();
                }, i);
                i += 400;
            }
        } else {
            for (const v of this.animations) {
                v.stop();
            }
        }
    }
    fillSaved() {
        this.userService.addressDetails().subscribe(data => {
            this.addressForm.get('name').setValue(data.name);
            this.addressForm.get('phone').setValue(data.phone.slice(-10));
            this.addressForm.get('code').setValue('+' + data.phone.slice(0, data.phone.length - 10));
            this.addressForm.get('country').setValue(data.country);
            this.addressForm.get('region').setValue(data.region);
            this.addressForm.get('city').setValue(data.city);
            this.addressForm.get('address').setValue(data.address);
            this.addressForm.get('pinCode').setValue(data.pinCode);
        });
    }
    setRegions() {
        const val = this.addressForm.get('country').value;
        if (val.length > 0) {
            for (const v of this.countries) {
                if (v.countryName === val) {
                    this.regions = v.regions;
                    break;
                }
            }
        }
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
        if (this.slides.indexOf(true) < slideNo) {
            switch (this.slides.indexOf(true)) {
                case 1: {
                    if (!this.addressForm.valid) {
                        ToastService.toast('Fill out the details correctly!', 3000, 'danger');
                        // return;
                    }
                    break;
                }
                case 2: {
                    if (!this.paymentForm.valid) {
                        ToastService.toast('Fill out the details correctly!', 3000, 'danger');
                        return;
                    }
                    break;
                }
            }
        }
        this.slides = this.slides.map(a => false);
        this.slides[slideNo] = true;
        if (slideNo === 3) {
            setTimeout(() => {
                this.animations = [
                    this.animationCtrl.create()
                        .addElement(this.one.nativeElement)
                        .duration(1200)
                        .iterations(Infinity)
                        .keyframes([
                            {
                                offset: 0,
                                opacity: 0
                            },
                            {
                                offset: 1,
                                opacity: 1
                            }
                        ]),
                    this.animationCtrl.create()
                        .addElement(this.two.nativeElement)
                        .duration(1200)
                        .iterations(Infinity)
                        .keyframes([
                            {
                                offset: 0,
                                opacity: 0
                            },
                            {
                                offset: 1,
                                opacity: 1
                            }
                        ]),
                    this.animationCtrl.create()
                        .addElement(this.three.nativeElement)
                        .duration(1200)
                        .iterations(Infinity)
                        .keyframes([
                            {
                                offset: 0,
                                opacity: 0
                            },
                            {
                                offset: 1,
                                opacity: 1
                            }
                        ])
                ];
                this.dotAnimation('play');
            }, 500);
            const address = {
                name: this.addressForm.get('name').value,
                phone: this.addressForm.get('code').value.replace('+', '') + this.addressForm.get('phone').value.replace(/-/gi, ''),
                address: {
                    country: this.addressForm.get('country').value,
                    city: this.addressForm.get('city').value,
                    region: this.addressForm.get('region').value,
                    pinCode: this.addressForm.get('pinCode').value,
                    address: this.addressForm.get('address').value
                }
            };
            const payment = this.paymentForm.getRawValue();
            payment.exp = payment.exp.slice(0, 2) + '/' + payment.exp.slice(5);
            payment.name = payment.name.toUpperCase();
            payment.card = payment.number.replace(/\s/g, '');
            delete payment.number;
            this.orderService.placeOrder(this.items, payment, address).subscribe(data => {
                ToastService.toast('Order successfully placed!', 3000, 'success');
                setTimeout(() => {
                    this.router.navigate(['']).then().catch();
                    this.cart.emptyCart();
                }, 250);
            }, error => {
                this.addressForm.reset();
                this.paymentForm.reset();
                ToastService.toast('Order could not be placed!', 3000, 'danger');
                setTimeout(() => {
                    this.router.navigate(['']).then().catch();
                }, 250);
            });
        }
    }
    ionViewWillEnter() {
        this.slides = [true, false, false, false];
    }
    processPayment() {
        console.log(this.cc);
    }
}
