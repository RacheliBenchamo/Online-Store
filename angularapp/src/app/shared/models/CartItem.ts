import { Product } from "./product";

export class CartItem {

  constructor(product: Product) {
    this.product = product;
  }

  product: Product;
  quantity: number = 1;

  public get price(): number {
    return this.product.price * this.quantity;
  }

  // Method to increase quantity of cart item
  public increaseQuantity(): void {
    try {
      if (this.quantity >= 1) {
        this.quantity++;
      } else {
        throw new Error('Quantity cannot be less than 1');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Method to decrease quantity of cart item
  public decreaseQuantity(): void {
    try {
      if (this.quantity > 1) {
        this.quantity--;
      } else {
        throw new Error('Quantity cannot be less than 1');
      }
    } catch (error) {
      console.error(error);
    }
  }

}
