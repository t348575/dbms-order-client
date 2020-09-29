import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../services/user.service';
import {UserBasicModel} from '../models/user-basic-model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilityService} from '../services/utility.service';
import {CountryPhoneModel, CountryRegionModel, RegionModel} from '../models/country-model';
import {ToastService} from '../services/toast.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.page.html',
    styleUrls: ['./account.page.scss'],
})
export class AccountPage implements AfterViewInit {
    data: UserBasicModel;
    address = 'medium';
    useAddress = true;
    pass = '';
    usePass = false;
    addressForm: FormGroup;
    passForm: FormGroup;
    phoneCodes: CountryPhoneModel[] = [];
    countries: CountryRegionModel[] = [];
    regions: RegionModel[] = [];
    @ViewChild('datePicker') datePicker;
    constructor(
        private userService: UserService,
        private formBuilder: FormBuilder,
        private utilityService: UtilityService,
        private cdr: ChangeDetectorRef
    ) {
        this.addressForm = this.formBuilder.group({
            country: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            name: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            region: ['', Validators.required],
            pinCode: ['', Validators.required],
            code: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            dob: ['', Validators.required]
        });
        this.passForm = this.formBuilder.group({
            oldPass: ['', [Validators.required]],
            pass: ['', [Validators.required]],
            rePass: ['', [Validators.required]]
        });
        this.getData();
    }
    getData() {
        this.userService.addressDetails().subscribe(data => {
            this.data = data;
            this.addressForm.get('name').setValue(data.name);
            this.addressForm.get('phone').setValue(data.phone.slice(-10));
            this.addressForm.get('code').setValue('+' + data.phone.slice(0, data.phone.length - 10));
            this.addressForm.get('country').setValue(data.country);
            this.addressForm.get('region').setValue(data.region);
            this.addressForm.get('city').setValue(data.city);
            this.addressForm.get('address').setValue(data.address);
            this.addressForm.get('pinCode').setValue(data.pinCode);
            this.addressForm.get('email').setValue(data.email);
            this.addressForm.get('dob').setValue(data.dob);
            this.utilityService.getCurrentCountryPhoneCode().subscribe(phoneCode => {
                this.utilityService.getPhoneCodeList().subscribe(data2 => {
                    this.phoneCodes = data2;
                });
            });
            this.utilityService.getCountryRegionList().subscribe(data2 => {
                this.countries = data2;
                this.utilityService.getCurrentCountry().subscribe(curr => {
                    for (const v of this.countries) {
                        if (v.countryShortCode === curr) {
                            this.setRegions();
                            break;
                        }
                    }
                });
            });
        });
    }
    setRegions() {
        const val = this.addressForm.get('country').value;
        if (val.length > 0) {
            for (const v of this.countries) {
                if (v.countryName === val) {
                    this.regions = v.regions;
                    break;
                }
            }
        }
    }
    updateDetails() {
        if (this.addressForm.valid) {
            const date = new Date(this.addressForm.get('dob').value);
            const address = {
                name: this.addressForm.get('name').value,
                phone: this.addressForm.get('code').value.replace('+', '') + this.addressForm.get('phone').value.replace(/-/gi, ''),
                email: this.addressForm.get('email').value,
                dob: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                address: {
                    country: this.addressForm.get('country').value,
                    city: this.addressForm.get('city').value,
                    region: this.addressForm.get('region').value,
                    pinCode: this.addressForm.get('pinCode').value,
                    address: this.addressForm.get('address').value
                }
            };
            this.userService.updateDetails(address).subscribe(data => {
                if (data) {
                    ToastService.toast('Details updated successfully!', 3000, 'success');
                    this.getData();
                } else {
                    ToastService.toast('Could not update details!', 3000, 'danger');
                }
            });
        } else {
            ToastService.toast('Fill out the form properly!', 3000, 'danger');
        }
    }
    updatePassword() {
        if (this.passForm.valid) {
            if (this.passForm.get('pass').value !== this.passForm.get('rePass').value) {
                ToastService.toast('New passwords do not match!', 3000, 'danger');
                return;
            }
            this.userService.updatePassword(this.passForm.get('oldPass').value, this.passForm.get('pass').value).subscribe(data => {
                this.passForm.reset();
                if (data.status) {
                    ToastService.toast('Password updated successfully!', 3000, 'success');
                } else {
                    ToastService.toast(data.message, 3000, 'danger');
                }
            });
        } else {
            ToastService.toast('Fill out the form properly!', 3000, 'danger');
        }
    }
    ngAfterViewInit() {
        const date = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
        this.datePicker.value = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        this.cdr.detectChanges();
    }
    goToAddress() {
        this.address = 'medium';
        this.pass = '';
        this.useAddress = true;
        this.usePass = false;
    }
    goToPassword() {
        this.address = '';
        this.pass = 'medium';
        this.useAddress = false;
        this.usePass = true;
    }
}
