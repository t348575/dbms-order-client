import { Component } from '@angular/core';
import {ProductsService} from '../services/products.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    prod = [];
    constructor(private products: ProductsService) {
        this.products.browse(0, 25).subscribe((data: any) => {
            this.prod = data;
            console.log(this.prod);
        }, error => { console.log(error); });
    }
}
