import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { Product } from '../../shared/models/Product';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {

  product!: Product;

  constructor(private productService: ProductService,
    private route: ActivatedRoute, private router: Router,
    private cartService: CartService) { }

  ngOnInit(): void {
    try {
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.productService.getProductById(params['id']).subscribe(result => (this.product = result));
          if (!this.product) {
            throw new Error('Product not found');
          }
        }
      });
    } catch (error) {
      console.log('Error occurred during initialization: ', error);
    }
  }

  public addToCart() {
    try {
      if (!this.product) {
        throw new Error('Product is not available');
      }
      this.cartService.addToCart(this.product);
      this.router.navigateByUrl("/cart-page");
    } catch (error) {
      console.log('Error occurred during adding product to cart: ', error);
    }
  }

}
