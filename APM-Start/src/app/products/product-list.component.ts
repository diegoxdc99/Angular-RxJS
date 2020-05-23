import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Subscription, Observable, EMPTY } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { map, catchError, tap } from 'rxjs/operators';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  categories;
  selectedCategoryId = 1;

  products$: Observable<Product[]> = this.productService.productWithCategory$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  productsSimpleFilter$ = this.productService.productWithCategory$
    .pipe(
      map(products =>
        products.filter(product =>
          this.selectedCategoryId ? product.categoryId === this.selectedCategoryId : true
          )
        )
    );

  constructor(private productService: ProductService) { }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
  }
}
