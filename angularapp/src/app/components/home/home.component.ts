import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../shared/models/Product';
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
    this.route.params.pipe(
      catchError((error) => {
        console.log('Error occurred during initialization: ', error);
        return of(null);
      })
    ).subscribe(params => {
      if (params && params['searchTerm']) {
        this.products = this.productService.getAllProductsBySearchTerm(params['searchTerm']);
      } else {
        this.productService.getAll().subscribe(result => (this.products = result));
      }
    });
  }

  sortProducts(selectedOption: string) {
    try {
      this.productService.sortedProductsBy(selectedOption);
      this.productService.getAll().subscribe(result => (this.products = result));
    } catch (error) {
      console.log('Error occurred during sorting: ', error);
    }
  }

}
