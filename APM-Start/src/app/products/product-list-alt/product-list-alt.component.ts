import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Subscription, EMPTY, Subject } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError, map, share } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  private errorMessageSubject = new Subject();
  errorMessageAction$ = this.errorMessageSubject.asObservable();

  product$ = this.productService.productWithCategory$
  .pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  selectedProduct$ = this.productService.selectedProduct$
    .pipe(
      share()
    );

  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
