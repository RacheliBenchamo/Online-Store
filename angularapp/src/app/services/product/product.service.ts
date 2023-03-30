import { Injectable, OnInit } from '@angular/core';
import { Product } from '../../shared/models/Product'
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../../environment/environment';

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
  public getAll(): Observable<Product[]> {
    return this.http.get<Product[]>('/products');
  }

  public getProductList(): Product[] {
    this.getAll().subscribe(result => (this.products = result));
    return this.products;
  }

  /**
   * Returns a Product with the given ID.
   * @param id - The ID of the Product to return.
   * @returns The Product with the given ID, or undefined if not found.
   */
  public getProductById(id: number): Product {
    try {
      return this.getProductList().find(product => product.id == id)!;
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
  public getAllProductsBySearchTerm(searchTerm: string): Product[] {
    try {
      return this.getProductList().filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    } catch (error) {
      console.error(`Error getting products by search term: ${error}`);
      throw error;
    }
  }

  public sortedProductsBy(selectedOption: string): void {
    const url = `https://your-api-url.com/products?sort=${selectedOption}`;

    try {
      this.http.get<Product[]>(url).subscribe(products => {
        this.products = products;
      });
    } catch (error) {
      console.error(`Error getting sorted products: ${error}`);
      throw error;
    }
  }


}
