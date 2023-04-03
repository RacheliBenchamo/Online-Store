import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { Cart } from '../../models/Cart';
import { CartItem } from '../../models/CartItem';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {

  cart2!: Cart;
  cart!: CartItem[];

  constructor(private cartService: CartService, private authService: AuthService) {
    try {
      this.setCart();
    } catch (error) {
      console.log('Error occurred during constructor: ', error);
    }
  }

  ngOnInit(): void {
  }

  public setCart() {
    this.cartService.getCart(this.authService.getUser().email).subscribe((cart: CartItem[]) => {
      this.cart = cart;
    }, error => {
      console.log('Error occurred during setCart: ', error);
    });
  }

  public removeFromCart(cartItem: CartItem) {
    try {
      this.cartService.removeFromCart(this.authService.getUser().email,cartItem.productName);
      this.setCart();
    } catch (error) {
      console.log('Error occurred during remove from cart: ', error);
    }
  }

  public changeQuantity(productName: string, quantity: number) {
    try {
      this.cartService.updateCartItemQuantity(this.authService.getUser().email,productName, quantity);
      this.setCart();
    } catch (error) {
      console.error("Error occurred during change quantity", error);
    }
  }

  public buyCart(): void {
    try {
      this.cartService.buyCart(this.authService.getUser().email);
      this.setCart();
    } catch (error) {
      console.error("Error occurred during clear cart", error);
    }
  }

  public getTotalPrice():number {
    let totalPrice = 0;
    for (const cartItem of this.cart) {
      totalPrice += cartItem.priceEach * cartItem.quantity;
    }
    return totalPrice;
  }



}
