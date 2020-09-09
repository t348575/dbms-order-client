import {Component} from '@angular/core';

import {Platform, PopoverController, ViewDidEnter} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthService} from './services/auth.service';
import {ToastService} from './services/toast.service';
import {UserIconComponent} from './shared/user-icon/user-icon.component';
import {CartComponent} from './shared/cart/cart.component';
import {ProductModel} from './models/product-model';
import {ProductsService} from './services/products.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    search;
    searchResults: ProductModel[] = [];
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private auth: AuthService,
        private toast: ToastService,
        private popover: PopoverController,
        private product: ProductsService
    ) {
        this.auth.attemptAutoAuth();
        this.initializeApp();
    }
    fixToolbar() {
        /*setTimeout(() => {
            document.querySelector('#toolbar').shadowRoot.querySelector('.toolbar-container').setAttribute('style', 'overflow: visible');
        }, 1000);*/
    }
    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.fixToolbar();
        });
    }
    async userIcon(ev: any) {
        const popover = await this.popover.create({
            component: UserIconComponent,
            cssClass: 'login-popover',
            event: ev,
            translucent: true,
            showBackdrop: false
        });
        return await popover.present();
    }
    async cart(ev: any) {
        const popover = await this.popover.create({
            component: CartComponent,
            cssClass: 'cart-popover',
            event: ev,
            translucent: true,
            showBackdrop: false
        });
        return await popover.present();
    }
    doSearch() {
    }
    predict(ev: any) {
        if (this.search.length === 0) {
            this.searchResults = [];
        } else {
            this.product.predict(this.search).subscribe(data => {
                this.searchResults = data;
            });
        }
    }
}
