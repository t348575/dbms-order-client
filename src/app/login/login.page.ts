import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {ToastService} from '../services/toast.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    form: FormGroup;
    constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router) {
        this.form = formBuilder.group({
            username: ['', [Validators.email, Validators.nullValidator, Validators.required]],
            password: ['', [Validators.nullValidator]]
        });
    }
    ngOnInit(){
    }
    login() {
        if (this.form.valid) {
            this.auth.login(this.form.get('username').value, this.form.get('password').value).subscribe((data: boolean) => {
                if (data) {
                    this.router.navigate(['/client/home']).then().catch();
                } else {
                    ToastService.toast('Improper login or password', 3000, 'danger');
                }
            });
        } else {
            ToastService.toast('Fill in the details correctly!', 3000, 'danger');
        }
    }
}
