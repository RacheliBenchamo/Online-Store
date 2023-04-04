import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { CartItem } from '../../../models/CartItem';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {

  cart!: CartItem[];
  purchased: boolean = false;

  constructor(private cartService: CartService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.setCart();
  }

  /**
   * Set the cart items for the logged in user
   */
  public setCart() {
    try {
      this.cartService.getCart(this.authService.getUser().email).subscribe((cart: CartItem[]) => {
        if (cart.length > 0)
          this.cart = cart;
        else
          this.cart = [];
      }, error => {
        this.cart = [];
        console.log('Error occurred during setCart: ', error);
      });
    } catch (error) {
      console.log('Error occurred during setCart: ', error);
    }
  }

  /**
   * Remove an item from the cart
   * @param cartItem The item to remove
   */
  public removeFromCart(cartItem: CartItem) {
    try {
      this.cartService.removeFromCart(this.authService.getUser().email, cartItem.productName).subscribe(() => {
        this.setCart();
      }, error => {
        console.log('Error occurred during remove from cart: ', error);
      });
    } catch (error) {
      console.log('Error occurred during remove from cart: ', error);
    }
  }

  /**
   * Change the quantity of an item in the cart
   * @param productName The name of the product to update
   * @param quantity The new quantity
   */
  public changeQuantity(productName: string, quantity: number) {
    try {
      this.cartService.updateCartItemQuantity(this.authService.getUser().email, productName, quantity).subscribe(() => {
        this.setCart();
      }, error => {
        console.error("Error occurred during change quantity", error);
      });
    } catch (error) {
      console.error("Error occurred during change quantity", error);
    }
  }

  /**
   * Buy the items in the cart
   */
  public buyCart(): void {
    try {
      this.cartService.buyCart(this.authService.getUser().email).subscribe(() => {
        this.cart = [];
        console.log("cart len", this.cart.length);
        this.purchased = true; // set purchased flag to true after successful purchase
      }, error => {
        console.error("Error occurred during clear cart", error);
      });
    } catch (error) {
      console.error("Error occurred during clear cart", error);
    }
  }

  /**
   * Calculate the total price of all items in the cart
   * @returns The total price
   */
  public getTotalPrice(): number {
    let totalPrice = 0;
    for (const cartItem of this.cart) {
      totalPrice += cartItem.priceEach * cartItem.quantity;
    }
    return totalPrice;
  }

}
