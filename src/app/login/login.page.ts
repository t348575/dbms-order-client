import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    form: FormGroup;
    constructor(private formBuilder: FormBuilder) {
        this.form = formBuilder.group({
            username: ['', [Validators.email, Validators.nullValidator, Validators.required]],
            password: ['', [Validators.required, Validators.nullValidator]]
        });
    }
    ngOnInit(){
    }
}
