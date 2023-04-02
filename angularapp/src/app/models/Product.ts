/**
 * Represents a product in the online store.
 */
export class Product {

  // The name of the product.
  name!: string;

  // The price of the product. 
  price!: number;

  // Whether or not the product is a favorite.
  favorite: boolean = false;

  // The URL for the product's image.
  imgUrl!: string;

  stock!: number;

}
