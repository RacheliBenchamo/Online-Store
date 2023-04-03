import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../../services/cart/cart.service';
import { Product } from '../../../models/Product';
import { ProductService } from '../../../services/product/product.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {

  product!: Product;

  constructor(private productService: ProductService,
    private route: ActivatedRoute, private router: Router,
    private cartService: CartService,
    private authService: AuthService) { }

  ngOnInit(): void {
    try {
      this.route.params.subscribe(params => {
        if (params['name']) {
          this.productService.getProductByName(params['name']).subscribe(result => (this.product = result));
          if (!this.product) {
            throw new Error('Product not found');
          }
        }
      });
    } catch (error) {
      console.log('Error occurred during initialization: ', error);
    }
  }

  public isAdmin() {
    return this.authService.getUser().isAdmin;
  }

  public addToCart() {
    try {
      if (!this.product) {
        throw new Error('Product is not available');
      }
      this.cartService.addToCart(this.authService.getUser().email, this.product.name);
    } catch (error) {
      console.log('Error occurred during adding product to cart: ', error);
    }
  }
  public deleteProduct() {
    this.productService.deleteProduct(this.product.name).subscribe(
      (products: Product[]) => {
        // Navigate back to the product list page
        this.router.navigateByUrl('');
      },
      error => {
        console.error('Error deleting product:', error);
        // Do something to notify the user that the product delete failed
      }
    );
  }

}
