import { Injectable } from '@angular/core';
import { Cart } from '../../models/Cart';
import { CartItem } from '../../models/CartItem';
import { Product } from '../../models/Product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: Cart = new Cart();

  constructor() { }

  /**
   * Add a product to the cart. If the product is already in the cart, increase its quantity by one.
   * @param product - The product to add to the cart.
   */
  public addToCart(product: Product): void {
    try {
      let cartItem = this.cart.items.find(item => item.product.name === product.name);
      if (cartItem) {
        this.changeQuantity(product.name, cartItem.quantity + 1);
      } else {
        this.cart.items.push(new CartItem(product));
      }
    } catch (error) {
      console.error(`Error adding product to cart: ${error}`);
    }
  }

  /**
   * Remove a product from the cart.
   * @param productId - The ID of the product to remove from the cart.
   */
  public removeFromCart(productName: string): void {
    try {
      this.cart.items = this.cart.items.filter(item => item.product.name !== productName);
    } catch (error) {
      console.error(`Error removing product from cart: ${error}`);
    }
  }

  /**
   * Change the quantity of a product in the cart.
   * @param productId - The ID of the product to change the quantity of.
   * @param quantity - The new quantity of the product.
   */
  public changeQuantity(productName: string, quantity: number): void {
    try {
      let cartItem = this.cart.items.find(item => item.product.name === productName);
      if (cartItem) {
        cartItem.quantity = quantity;
      }
    } catch (error) {
      console.error(`Error changing quantity of product in cart: ${error}`);
    }
  }

  /**
   * Get the current cart.
   * @returns The current cart.
   */
  public getCart(): Cart {
    try {
      return this.cart;
    } catch (error) {
      console.error(`Error getting cart: ${error}`);
      return new Cart();
    }
  }

  /**
   * Clear the cart.
   */
  public clearCart(): void {
    try {
      this.cart.clearCart();
    } catch (error) {
      console.error(`Error clearing cart: ${error}`);
    }
  }
}
