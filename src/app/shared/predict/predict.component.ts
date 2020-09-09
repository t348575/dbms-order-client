import {Component, Input, OnInit} from '@angular/core';
import {ProductModel} from '../../models/product-model';
import {ProductsService} from '../../services/products.service';

@Component({
    selector: 'app-predict',
    templateUrl: './predict.component.html',
    styleUrls: ['./predict.component.scss'],
})
export class PredictComponent implements OnInit {
    @Input() data: ProductModel[] = [];
    search = '';
    constructor(private product: ProductsService) {
    }
    ngOnInit() {}
    predict(ev: any) {
        if (this.search.length === 0) {
            this.data = [];
        } else {
            this.product.predict(this.search).subscribe(data => {
                this.data = data;
            });
        }
    }
}
