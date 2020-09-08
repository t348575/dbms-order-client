import { Component } from '@angular/core';

import {Platform, PopoverController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthService} from './services/auth.service';
import {ToastService} from './services/toast.service';
import {UserIconComponent} from './shared/user-icon/user-icon.component';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
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
    async presentPopover(ev: any) {
        const popover = await this.popover.create({
            component: UserIconComponent,
            cssClass: 'login-popover',
            event: ev,
            translucent: true
        });
        return await popover.present();
    }
}
