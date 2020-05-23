import { Component } from '@angular/core';

import { Subscription, EMPTY } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html'
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId;
  selectedCategoryId = 1;

  product$ = this.productService.products$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    console.log('Not yet implemented');
  }
}
