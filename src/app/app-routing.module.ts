import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuardService} from './services/auth-guard.service';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
    },
    {
        path: 'register',
        loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
    },
    {
        path: 'product-display/:id',
        loadChildren: () => import('./product-display/product-display.module').then( m => m.ProductDisplayPageModule)
    },
    {
        path: 'checkout',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./checkout/checkout.module').then( m => m.CheckoutPageModule)
    },
    {
        path: 'search/:search',
        loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
    },
    {
        path: 'orders',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./orders/orders.module').then( m => m.OrdersPageModule)
    },
    {
        path: 'account',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
    },
    {
        path: 'view-order/:id',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./view-order/view-order.module').then( m => m.ViewOrderPageModule)
    },
    {
        path: 'shipping/:id',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./shipping/shipping.module').then( m => m.ShippingPageModule)
    }



];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
