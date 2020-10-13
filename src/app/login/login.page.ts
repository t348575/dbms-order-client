import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {ToastService} from '../services/toast.service';
import {CartService} from '../services/cart.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    form: FormGroup;
    constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router, private cart: CartService) {
        this.form = formBuilder.group({
            username: ['', [Validators.nullValidator, Validators.required]],
            password: ['', [Validators.nullValidator]]
        });
    }
    ngOnInit(){
    }
    login() {
        if (this.form.valid) {
            this.auth.login(this.form.get('username').value, this.form.get('password').value).subscribe((data: boolean) => {
                if (data) {
                    this.router.navigate(['/home']).then().catch();
                    setTimeout(() => {
                        this.cart.getCart();
                    }, 1);
                } else {
                    ToastService.toast('Improper login or password', 3000, 'danger');
                }
            });
        } else {
            ToastService.toast('Fill in the details correctly!', 3000, 'danger');
        }
    }
}
