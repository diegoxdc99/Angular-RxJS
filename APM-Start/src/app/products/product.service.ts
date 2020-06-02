import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  Observable,
  throwError,
  combineLatest,
  Subject,
  BehaviorSubject,
  merge,
} from 'rxjs';
import { catchError, tap, map, scan, first, startWith, shareReplay } from 'rxjs/operators';

import { Product } from './product';
import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = this.supplierService.suppliersUrl;
  private selectedProductSubject = new BehaviorSubject<number>(0);
  private productInsertedSubject = new Subject<Product>();

  selectedProductAction$ = this.selectedProductSubject.asObservable();
  productInsertedAction$ = this.productInsertedSubject.asObservable();

  products$: Observable<Product[]> = this.http
    .get<Product[]>(this.productsUrl)
    .pipe(
      tap((data) => console.log('Products: ', JSON.stringify(data))),
      catchError(this.handleError)
    );

  productWithCategory$ = combineLatest([
    this.products$,
    this.productCategoryService.productCategories$,
  ]).pipe(
    map(this.mergeProductAndCategories()),
    shareReplay(1),
  );

  selectedProduct$ = combineLatest([
    this.productWithCategory$,
    this.selectedProductAction$,
  ]).pipe(
    map(([products, selectedProductId]) =>
      products.find((product) => product.id === selectedProductId)
    ),
    shareReplay(1),
    tap((product) => console.log('product selected :>> ', product))
  );

  productsWithAdd$ = merge(
    this.productWithCategory$,
    this.productInsertedAction$
  ).pipe(
    tap(dato => console.log('dato :>> ', dato)),
    scan((acc: Product[], value: any) => {
      return value.length ? [...acc, ...value] : [...acc, value];
    }, [] )
  );

  private mergeProductAndCategories(): ([products, categories]: [Product[], any]) => Product[] {
    return ([products, categories]) =>
      products.map(
        (product) =>
          ({
            ...product,
            category: this.getCategory(product.categoryId, categories).name,
            price: product.price * 1.5,
            searchKey: [product.productName],
          } as Product)
      );
  }

  getCategory(id, categories) {
    return categories.find((category) => category.id === id);
  }

  constructor(
    private http: HttpClient,
    private supplierService: SupplierService,
    private productCategoryService: ProductCategoryService
  ) {}

  selectedProductChanged(selectedProductId: number): void {
    this.selectedProductSubject.next(selectedProductId);
  }

  addProduct(newProduct?: Product) {
    newProduct = newProduct || this.fakeProduct();
    this.productInsertedSubject.next(newProduct);
  }

  private fakeProduct() {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30,
    };
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
