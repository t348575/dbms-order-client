import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CountryPhoneModel, CountryRegionModel, RegionModel} from '../models/country-model';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {
    static isCountryName = false;
    static isPhoneNames = false;
    static isCurrentCountry = false;
    static isCurrentRegion = false;
    static countryNames: string[];
    static phoneNames: CountryPhoneModel[];
    static currentCountry: string;
    static currentRegion: string;
    static currentCity: string;
    static countryRegion: CountryRegionModel[];
    constructor(private http: HttpClient) { }
    getCountryList(): Observable<string[]> {
        return new Observable<string[]>(observer => {
            if (UtilityService.isCountryName) {
                observer.next(UtilityService.countryNames);
                observer.complete();
            } else {
                if (localStorage.getItem('countries-name')) {
                    try {
                        UtilityService.countryNames = JSON.parse(localStorage.getItem('countries-name'));
                        UtilityService.isCountryName = true;
                        observer.next(UtilityService.countryNames);
                        observer.complete();
                    } catch (e) {
                        this.http.get('./assets/countries-name.json').subscribe((data: string[]) => {
                            UtilityService.countryNames = data;
                            UtilityService.isCountryName = true;
                            observer.next(UtilityService.countryNames);
                            observer.complete();
                            localStorage.setItem('countries-name', JSON.stringify(UtilityService.countryNames));
                        });
                    }
                } else {
                    this.http.get('./assets/countries-name.json').subscribe((data: string[]) => {
                        UtilityService.countryNames = data;
                        UtilityService.isCountryName = true;
                        observer.next(UtilityService.countryNames);
                        observer.complete();
                        localStorage.setItem('countries-name', JSON.stringify(UtilityService.countryNames));
                    });
                }
            }
        });
    }
    getPhoneCodeList(): Observable<CountryPhoneModel[]> {
        return new Observable<CountryPhoneModel[]>(observer => {
            if (UtilityService.isPhoneNames) {
                observer.next(UtilityService.phoneNames);
                observer.complete();
            } else {
                if (localStorage.getItem('countries-phone')) {
                    try {
                        UtilityService.phoneNames = JSON.parse(localStorage.getItem('countries-phone'));
                        UtilityService.isPhoneNames = true;
                        observer.next(UtilityService.phoneNames);
                        observer.complete();
                    } catch (e) {
                        this.http.get('./assets/countries-phone.json').subscribe((data: CountryPhoneModel[]) => {
                            UtilityService.phoneNames = data;
                            UtilityService.isPhoneNames = true;
                            observer.next(UtilityService.phoneNames);
                            observer.complete();
                            localStorage.setItem('countries-phone', JSON.stringify(UtilityService.phoneNames));
                        });
                    }
                } else {
                    this.http.get('./assets/countries-phone.json').subscribe((data: CountryPhoneModel[]) => {
                        UtilityService.phoneNames = data;
                        UtilityService.isPhoneNames = true;
                        observer.next(UtilityService.phoneNames);
                        observer.complete();
                        localStorage.setItem('countries-phone', JSON.stringify(UtilityService.phoneNames));
                    });
                }
            }
        });
    }
    getCountryRegionList(): Observable<CountryRegionModel[]> {
        return new Observable<CountryRegionModel[]>(observer => {
            if (UtilityService.isCurrentRegion) {
                observer.next(UtilityService.countryRegion);
                observer.complete();
            } else {
                if (localStorage.getItem('countries-region')) {
                    try {
                        UtilityService.countryRegion = JSON.parse(localStorage.getItem('countries-region'));
                        UtilityService.isCurrentRegion = true;
                        observer.next(UtilityService.countryRegion);
                        observer.complete();
                    } catch (e) {
                        this.http.get('./assets/countries-region.json').subscribe((data: CountryRegionModel[]) => {
                            UtilityService.countryRegion = data;
                            UtilityService.isCurrentRegion = true;
                            observer.next(UtilityService.countryRegion);
                            observer.complete();
                            localStorage.setItem('countries-region', JSON.stringify(UtilityService.countryRegion));
                        });
                    }
                } else {
                    this.http.get('./assets/countries-region.json').subscribe((data: CountryRegionModel[]) => {
                        UtilityService.countryRegion = data;
                        UtilityService.isCurrentRegion = true;
                        observer.next(UtilityService.countryRegion);
                        observer.complete();
                        localStorage.setItem('countries-region', JSON.stringify(UtilityService.countryRegion));
                    });
                }
            }
        });
    }
    getCurrentCountry(): Observable<string> {
        return new Observable<string>(observer => {
            if (UtilityService.isCurrentCountry) {
                observer.next(UtilityService.currentCountry);
                observer.complete();
            } else {
                if (localStorage.getItem('current-country') && localStorage.getItem('current-country').length > 0) {
                    UtilityService.currentCountry = localStorage.getItem('current-country');
                    UtilityService.currentRegion = localStorage.getItem('current-region');
                    UtilityService.currentCity = localStorage.getItem('current-city');
                    UtilityService.isCurrentCountry = true;
                    observer.next(UtilityService.currentCountry);
                    observer.complete();
                } else {
                    this.http.get('http://ip-api.com/json/').subscribe((data: any) => {
                        UtilityService.currentCountry = data.countryCode;
                        UtilityService.currentCity = data.city;
                        UtilityService.currentRegion = data.regionName;
                        localStorage.setItem('current-region', UtilityService.currentRegion);
                        localStorage.setItem('current-country', UtilityService.currentCountry);
                        localStorage.setItem('current-city', UtilityService.currentCity);
                        UtilityService.isCurrentCountry = true;
                        observer.next(UtilityService.currentCountry);
                        observer.complete();
                    });
                }
            }
        });
    }
    getCurrentRegion(): string {
        return UtilityService.currentRegion;
    }
    getCurrentCity(): string {
        return UtilityService.currentCity;
    }
    getCurrentCountryPhoneCode(): Observable<string> {
        return new Observable<string>(observer => {
            this.getPhoneCodeList().subscribe(() => {
                this.getCurrentCountry().subscribe(() => {
                    const curr = UtilityService.currentCountry;
                    const idx = UtilityService.phoneNames.findIndex(a => a.code === curr);
                    if (idx === -1) {
                        observer.next('');
                        observer.complete();
                    } else {
                        observer.next(UtilityService.phoneNames[idx].dial_code);
                        observer.complete();
                    }
                });
            });
        });
    }
    getRegionsOfCountry(country: string): Observable<RegionModel[]> {
        return new Observable<RegionModel[]>(observer => {
            if (country.length === 0) {
                observer.next();
                observer.complete();
            }
            this.getCountryRegionList().subscribe(() => {
                const idx = UtilityService.countryRegion.findIndex(a => a.countryShortCode === country);
                if (idx === -1) {
                    observer.next([]);
                    observer.complete();
                } else {
                    observer.next(UtilityService.countryRegion[idx].regions);
                    observer.complete();
                }
            });
        });
    }
}
