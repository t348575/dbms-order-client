import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {HttpClient} from '@angular/common/http';
import {ToastService} from '../services/toast.service';
import {UtilityService} from '../services/utility.service';
import {CountryPhoneModel, CountryRegionModel, RegionModel} from '../models/country-model';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements AfterViewInit {
    form: FormGroup;
    @ViewChild('datePicker') datePicker;
    phoneCodes: CountryPhoneModel[] = [];
    countries: CountryRegionModel[] = [];
    regions: RegionModel[] = [];
    constructor(
        private formBuilder: FormBuilder,
        private auth: AuthService,
        private http: HttpClient,
        private cdr: ChangeDetectorRef,
        private utilityService: UtilityService
    ) {
        this.form = formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            name: ['', Validators.required],
            dob: ['', Validators.required],
            phone: ['', Validators.required],
            password: ['', Validators.required],
            rePassword: ['', Validators.required],
            country: ['', Validators.required],
            city: ['', Validators.required],
            region: ['', Validators.required],
            pinCode: ['', Validators.required],
            address: ['', Validators.required],
            code: ['', Validators.required]
        }, { validator: this.ConfirmedValidator('password', 'rePassword') });
        this.utilityService.getCurrentCountryPhoneCode().subscribe(phoneCode => {
            setTimeout(() => {
                this.utilityService.getPhoneCodeList().subscribe(data => {
                    this.phoneCodes = data;
                    this.form.get('code').setValue(phoneCode);
                });
            }, 500);
        });
        this.utilityService.getCountryRegionList().subscribe(data => {
            this.countries = data;
            this.utilityService.getCurrentCountry().subscribe(curr => {
                for (const v of this.countries) {
                    if (v.countryShortCode === curr) {
                        this.form.get('country').setValue(v.countryName);
                        this.setRegions();
                        setTimeout(() => {
                            const currRegion = this.utilityService.getCurrentRegion();
                            for (const k of v.regions) {
                                if (k.name === currRegion) {
                                    this.form.get('region').setValue(currRegion);
                                    break;
                                }
                            }
                        }, 500);
                        if (this.utilityService.getCurrentCity().length > 0) {
                            this.form.get('city').setValue(this.utilityService.getCurrentCity());
                        }
                        break;
                    }
                }
            });
        });
    }
    setRegions() {
        const val = this.form.get('country').value;
        if (val.length > 0) {
            for (const v of this.countries) {
                if (v.countryName === val) {
                    this.regions = v.regions;
                    break;
                }
            }
        }
    }
    ngAfterViewInit() {
        const date = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
        this.datePicker.value = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
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
            data.dob = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            this.auth.register(
                data.email,
                data.password,
                data.name,
                data.dob,
                data.phone,
                data.address,
                data.country,
                data.region,
                data.city,
                data.pinCode
            ).subscribe(res => {
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
