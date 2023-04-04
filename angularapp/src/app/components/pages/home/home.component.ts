import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { Product } from '../../../models/Product';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Subscribe to route params and catch errors if they occur
    this.route.params.pipe(
      catchError((error) => {
        console.log('Error occurred during initialization: ', error);
        return of(null);
      })
    ).subscribe(params => {
      // Check if there's a search term in params
      if (params && params['searchTerm']) {
        // Get all products by search term
        this.productService.getAllProductsBySearchTerm(params['searchTerm']).subscribe(products => (this.products = products));
      } else {
        // Get all products
        this.productService.getAllProducts().subscribe(products => { this.products = products; });
      }
    });
  }

  /**
   * Sort products based on selected option
   */
    sortProducts(selectedOption: string) {
    try {
      this.productService.sortedProductsBy(selectedOption).subscribe(result => (this.products = result));
    } catch (error) {
      console.log('Error occurred during sorting: ', error);
    }
  }

}
