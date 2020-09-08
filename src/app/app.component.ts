import { Component } from '@angular/core';

import {Platform, PopoverController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthService} from './services/auth.service';
import {ToastService} from './services/toast.service';
import {UserIconComponent} from './shared/user-icon/user-icon.component';
import {CartComponent} from './shared/cart/cart.component';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public search;
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private auth: AuthService,
        private toast: ToastService,
        private popover: PopoverController
    ) {
        this.auth.attemptAutoAuth();
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
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
        console.log(ev.target.value);
    }
}
