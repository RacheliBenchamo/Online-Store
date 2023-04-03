import { CartItem } from "./CartItem";

export class Cart {
  items: CartItem[] = [];

  constructor() { }

  /**
   * Returns the total price of all items in the cart
   * @returns {number} The total price of all items in the cart
   */
  public get totalPrice(): number {
    let totalPrice = 0;
    try {
      this.items.forEach(item => { totalPrice += item.priceEach });
    } catch (error) {
      console.error(`An error occurred while calculating the total price: ${error}`);
      throw error;
    }
    return totalPrice;
  }

  /**
   * Clears all items from the cart
   */
  public clearCart(): void {
    try {
      this.items = [];
    } catch (error) {
      console.error(`An error occurred while clearing the cart: ${error}`);
      throw error;
    }
  }
}
