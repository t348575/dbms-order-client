import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDisplayPageRoutingModule } from './product-display-routing.module';

import { ProductDisplayPage } from './product-display.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDisplayPageRoutingModule
  ],
  declarations: [ProductDisplayPage]
})
export class ProductDisplayPageModule {}
