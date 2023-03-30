import { Injectable, OnInit } from '@angular/core';
import { Product } from '../../models/Product'
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

   // Define the list of products
  products: Product[]=[];  

  constructor(private http: HttpClient) {}

  /**
 * Returns an array of all Products.
 * @returns An array of all Products.
 */
  public getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/products');
  }

  /**
   * Returns a Product with the given ID.
   * @param id - The ID of the Product to return.
   * @returns The Product with the given ID, or undefined if not found.
   */
  public getProductById(id: number): Observable<Product> {
    try {
      return this.http.get<Product>(`/products/${id}`);
    } catch (error) {
      console.error(`Error getting product by ID: ${error}`);
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

  public sortedProductsBy(selectedOption: string): Observable<Product[]> {
    const url = `https://your-api-url.com/products?sort=${selectedOption}`;

    try {
      console.log(`/products/sort/${selectedOption}`);
      return this.http.get<Product[]>(`/products/sorted/${selectedOption}`);
    } catch (error) {
      console.error(`Error getting sorted products: ${error}`);
      throw error;
    }
  }


}
