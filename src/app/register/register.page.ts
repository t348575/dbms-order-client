import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {HttpClient} from '@angular/common/http';
import {ToastService} from '../services/toast.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements AfterViewInit {
    form: FormGroup;
    @ViewChild('datePicker') datePicker;
    countries: { name: string, dial_code: string, code: string }[] = [];
    constructor(private formBuilder: FormBuilder, private auth: AuthService, private http: HttpClient, private cdr: ChangeDetectorRef) {
        this.form = formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            name: ['', Validators.required],
            dob: ['', Validators.required],
            phone: ['', Validators.required],
            password: ['', Validators.required],
            rePassword: ['', Validators.required],
            address: ['', Validators.required],
            code: ['', Validators.required]
        }, { validator: this.ConfirmedValidator('password', 'rePassword') });
        this.http.get('./assets/countries.json').subscribe((data: { name: string, dial_code: string, code: string }[]) => {
            this.countries = data;
            this.countries = this.countries.filter(a => a.dial_code !== null && a.dial_code.length < 5);
            this.http.get('http://ip-api.com/json/').subscribe((data2: any) => {
                this.form.get('code').setValue(this.countries[this.countries.findIndex(a => a.code === data2.countryCode)].dial_code);
            });
        });
    }
    ngAfterViewInit() {
        const date = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
        this.datePicker.value = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
        this.cdr.detectChanges();
    }
    ConfirmedValidator(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ confirmedValidator: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }
    register() {
        if (this.form.valid) {
            const data = this.form.getRawValue();
            data.phone = data.code.replace('+', '') + data.phone.replace(/-/gi, '');
            const date = new Date(data.dob);
            data.dob = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            this.auth.register(data.email, data.password, data.name, data.dob, data.phone, data.address).subscribe(res => {
                if (!res.status) {
                    ToastService.toast(res.message, 3000, 'danger');
                } else {
                    ToastService.toast(res.message, 2500, 'primary');
                }
            });
        } else {
            if (!this.form.get('rePassword').valid) {
                ToastService.toast('Passwords do not match!', 3000, 'danger');
            } else {
                ToastService.toast('Form not filled out!', 3000, 'danger');
            }
        }
    }
}
