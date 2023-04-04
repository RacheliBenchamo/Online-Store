import { Injectable } from '@angular/core';
import { Product } from '../../models/Product'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // Define the list of products
  products: Product[] = [];

  constructor(private http: HttpClient) { }

  /**
  * Returns an array of all Products.
  * @returns An array of all Products.
  */
  public getAllProducts(): Observable<Product[]> {
    try {
      return this.http.get<Product[]>('/products')
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.error(`Error getting all products: ${error}`);
            return throwError(error);
          })
        );
    } catch (error) {
      console.error(`Error getting all products: ${error}`);
      throw error;
    }
  }

  /**
  * Updates the specified product.
  * @param product - The Product object to update.
  * @param orgName - The name of the original product.
  * @returns An array of all Products.
  */
  public updateProduct(product: Product, orgName: string): Observable<Product[]> {
    try {
      return this.http.put<Product[]>(`/products/${orgName}`, product)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.error(`Error updating product: ${error}`);
            return throwError(error);
          })
        );
    } catch (error) {
      console.error(`Error updating product: ${error}`);
      throw error;
    }
  }

  /**
  * Adds the specified product.
  * @param product - The Product object to add.
  * @returns An array of all Products.
  */
  public addProduct(product: Product): Observable<Product[]> {
    try {
      return this.http.post<Product[]>('/products', product)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.error(`Error adding product: ${error}`);
            return throwError(error);
          })
        );
    } catch (error) {
      console.error(`Error adding product: ${error}`);
      throw error;
    }
  }

  /**
  * Deletes the specified product.
  * @param name - The name of the Product to delete.
  * @returns An array of all Products.
  */
  public deleteProduct(name: string): Observable<Product[]> {
    try {
      return this.http.delete<Product[]>(`/products/${name}`)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.error(`Error deleting product: ${error}`);
            return throwError(error);
          })
        );
    } catch (error) {
      console.error(`Error deleting product: ${error}`);
      throw error;
    }
  }

  /**
  * Returns a Product with the given name.
  * @param name - The name of the Product to return.
  * @returns The Product with the given name, or undefined if not found.
  */
  public getProductByName(name: string): Observable<Product> {
    try {
      return this.http.get<Product>(`/products/${name}`)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.error(`Error getting product by name: ${error}`);
            return throwError(error);
          })
        );
    } catch (error) {
      console.error(`Error getting product by name: ${error}`);
      throw error;
    }
  }

  /**
  * Returns an array of Products that match the given search term.
  * @param searchTerm - The search term to match against.
  * @returns An array of Products that match the given search term.
  */
  public getAllProductsBySearchTerm(searchTerm: string): Observable<Product[]> {
    try {
      return this.http.get<Product[]>(`/products/search/${searchTerm}`);
    } catch (error) {
      console.error(`Error getting products by search term: ${error}`);
      throw error;
    }
  }

  /**
  * Returns an array of Products sorted by the given option.
  * @param selectedOption - The sorting option to apply.
  * @returns An array of Products sorted by the given option.
  */
  public sortedProductsBy(selectedOption: string): Observable<Product[]> {
    try {
      console.log(`/products/sort/${selectedOption}`);
      return this.http.get<Product[]>(`/products/sorted/${selectedOption}`);
    } catch (error) {
      console.error(`Error getting sorted products: ${error}`);
      throw error;
    }
  }

}
