import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

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
                this.router.navigate(['/home']).then().catch();
            });
        } else {

        }
    }
}
