import { Injectable, OnInit } from '@angular/core';
import { Tag } from '../../shared/models/Tag';
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
   * Returns an array of Products that have the given tag.
   * @param tag - The tag to filter Products by.
   * @returns An array of Products that have the given tag.
   */
  public getProductByTag(tag: string): Product[] {
    try {
      return tag == "All" ?
        this.products :
        this.products.filter(product => product.tags?.includes(tag));
    } catch (error) {
      console.error(`Error getting products by tag: ${error}`);
      throw error;
    }
  }

  /**
   * Returns an array of all available Tags.
   * @returns An array of all available Tags.
   */
  public getAllTags(): Tag[] {
    try {
      return [
        {
          name: 'good',
          count: 5,
        },
        {
          name: 'green',
          count: 3,
        }, {
          name: 'healthy',
          count: 9,
        }, {
          name: 'red',
          count: 1,
        }, {
          name: 'white',
          count: 1,
        }, {
          name: 'purple',
          count: 2,
        }, {
          name: 'orange',
          count: 1,
        },
      ];
    } catch (error) {
      console.error(`Error getting all tags: ${error}`);
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

  /**
   * Sorts the list of Products by the selected option.
   * @param selectedOption - The selected option to sort by.
   */
  public sortedProductsBy(selectedOption: string): void {
    try {
      switch (selectedOption) {
        case 'nameAsc':
          this.products = this.products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'nameDesc':
          this.products = this.products.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'priceAsc':
          this.products = this.products.sort((a, b) => a.price - b.price);
          break;
        case 'priceDesc':
          this.products = this.products.sort((a, b) => b.price - a.price);
          break;

      }
    } catch (error) {
      console.error(`Error getting products by search term: ${error}`);
      throw error;
    }
  }

}
