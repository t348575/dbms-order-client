import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductModel } from '../models/product-model';
import {ProductsService} from '../services/products.service';

@Component({
  selector: 'app-product-display',
  templateUrl: './product-display.page.html',
  styleUrls: ['./product-display.page.scss'],
})
export class ProductDisplayPage implements OnInit {

  prod_id="";
  product: ProductModel;

  constructor(private products: ProductsService,private activatedRoute:ActivatedRoute) { 
    this.activatedRoute.paramMap.subscribe(params => {this.prod_id=params.get('id');
    this.products.getProductsByID([this.prod_id]).subscribe(value => {this.product = value[0]});
  })
  }

  ngOnInit() {
    
  }

}
