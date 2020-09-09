import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'client/home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
    },
    {
        path: '',
        redirectTo: 'client/home',
        pathMatch: 'full'
    },
    {
        path: 'client/login',
        loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
    },
    {
        path: 'client/register',
        loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
