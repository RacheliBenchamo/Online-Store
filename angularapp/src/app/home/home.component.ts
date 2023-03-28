import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product/product.service';
import { Product } from '../shared/models/product';
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
      } else if (params && params['tag']) {
        this.products = this.productService.getProductByTag(params['tag']);
      } else {
        this.products = this.productService.getAll();
      }
    });
  }

  sortProducts(selectedOption: string) {
    try {
      this.productService.sortedProductsBy(selectedOption);
      this.products = this.productService.getAll();
    } catch (error) {
      console.log('Error occurred during sorting: ', error);
    }
  }

}
