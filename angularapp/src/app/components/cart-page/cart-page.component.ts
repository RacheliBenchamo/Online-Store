import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { Cart } from '../../models/Cart';
import { CartItem } from '../../models/CartItem';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {

  cart!: Cart;

  constructor(private cartService: CartService) {
    try {
      this.setCart();
    } catch (error) {
      console.log('Error occurred during constructor: ', error);
    }
  }

  ngOnInit(): void {
  }

  public setCart() {
    this.cart = this.cartService.getCart();
  }

  public removeFromCart(cartItem: CartItem) {
    try {
      this.cartService.removeFromCart(cartItem.product.name);
      this.setCart();
    } catch (error) {
      console.log('Error occurred during remove from cart: ', error);
    }
  }

  public changeQuantity(cartItem: CartItem, quantity: number) {
    try {
      this.cartService.changeQuantity(cartItem.product.name, quantity);
      this.setCart();
    } catch (error) {
      console.error("Error occurred during change quantity", error);
    }
  }

  public clearCart(): void {
    try {
      this.cartService.clearCart();
      this.setCart();
    } catch (error) {
      console.error("Error occurred during clear cart", error);
    }
  }
}
