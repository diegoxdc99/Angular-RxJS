import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Subscription, Observable, EMPTY, Subject, combineLatest, BehaviorSubject } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { map, catchError, tap } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';

  private categorySelectedSubjet = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubjet.asObservable();

  products$ = combineLatest([
    this.productService.productWithCategory$,
    this.categorySelectedAction$
  ])
    .pipe(
      map(([products, categorySelectedId]) =>
        products.filter(product =>
          categorySelectedId ? product.categoryId === categorySelectedId : true
        )
      ),
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  constructor(private productService: ProductService,
    private productCategoryService: ProductCategoryService) { }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubjet.next(+categoryId);
  }
}
