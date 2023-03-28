import { Injectable } from '@angular/core';
import { Tag } from '../../shared/models/Tag';
import { Product } from '../../shared/models/product'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // Define the list of products
  productsList: Product[] = [
    {
      id: 1,
      name: 'Artichoke',
      price: 3,
      tags: ['green', 'healthy'],
      favorite: false,
      imgUrl: "/assets/Images/Artichoke.jpg",
    },
    {
      id: 2,
      name: 'Broccoli',
      price: 2,
      tags: ['green', 'healthy'],
      favorite: false,
      imgUrl: "/assets/Images/Broccoli.jpg",
    },
    {
      id: 3,
      name: 'Cabbage',
      price: 2,
      tags: ['white', 'healthy'],
      favorite: true,
      imgUrl: "/assets/Images/Cabbage.jpg",
    },
    {
      id: 4,
      name: 'Carrot',
      price: 2.5,
      tags: ['orange', 'healthy', 'good'],
      favorite: false,
      imgUrl: "/assets/Images/Carrot.jpg",
    },
    {
      id: 5,
      name: 'Eggplant',
      price: 2.5,
      tags: ['purple', 'healthy', 'good'],
      favorite: true,
      imgUrl: "/assets/Images/Eggplant.jpg",
    },
    {
      id: 6,
      name: 'Garlic',
      price: 1.5,
      tags: ['purple', 'healthy'],
      favorite: true,
      imgUrl: "/assets/Images/Garlic.jpg",
    },
    {
      id: 7,
      name: 'Lettuce',
      price: 3.5,
      tags: ['green', 'healthy'],
      favorite: true,
      imgUrl: "/assets/Images/Lettuce.jpg",
    },
    {
      id: 8,
      name: 'Pepper',
      price: 3.5,
      tags: ['good', 'healthy'],
      favorite: true,
      imgUrl: "/assets/Images/Pepper.jpg",
    },
    {
      id: 9,
      name: 'Tomato',
      price: 3.5,
      tags: ['good', 'red', 'healthy'],
      favorite: true,
      imgUrl: "/assets/Images/Tomato.jpg",
    },
  ]

  constructor() { }

  /**
   * Returns a Product with the given ID.
   * @param id - The ID of the Product to return.
   * @returns The Product with the given ID, or undefined if not found.
   */
  public getProductById(id: number): Product {
    try {
      return this.getAll().find(product => product.id == id)!;
    } catch (error) {
      console.error(`Error getting product by ID: ${error}`);
      throw error;
    }
  }

  /**
   * Returns an array of all Products.
   * @returns An array of all Products.
   */
  public getAll(): Product[] {
    try {
      return this.productsList;
    } catch (error) {
      console.error(`Error getting all products: ${error}`);
      throw error;
    }
  }

  /**
   * Returns an array of Products that have the given tag.
   * @param tag - The tag to filter Products by.
   * @returns An array of Products that have the given tag.
   */
  public getProductByTag(tag: string): Product[] {
    try {
      return tag == "All" ?
        this.productsList :
        this.productsList.filter(product => product.tags?.includes(tag));
    } catch (error) {
      console.error(`Error getting products by tag: ${error}`);
      throw error;
    }
  }

  /**
   * Returns an array of all available Tags.
   * @returns An array of all available Tags.
   */
  public getAllTags(): Tag[] {
    try {
      return [
        {
          name: 'good',
          count: 5,
        },
        {
          name: 'green',
          count: 3,
        }, {
          name: 'healthy',
          count: 9,
        }, {
          name: 'red',
          count: 1,
        }, {
          name: 'white',
          count: 1,
        }, {
          name: 'purple',
          count: 2,
        }, {
          name: 'orange',
          count: 1,
        },
      ];
    } catch (error) {
      console.error(`Error getting all tags: ${error}`);
      throw error;
    }
  }

  /**
  * Returns an array of Products that match the given search term.
  * @param searchTerm - The search term to match against.
  * @returns An array of Products that match the given search term.
  */
  public getAllProductsBySearchTerm(searchTerm: string): Product[] {
    try {
      return this.getAll().filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    } catch (error) {
      console.error(`Error getting products by search term: ${error}`);
      throw error;
    }
  }

  /**
   * Sorts the list of Products by the selected option.
   * @param selectedOption - The selected option to sort by.
   */
  public sortedProductsBy(selectedOption: string): void {
    try {
      switch (selectedOption) {
        case 'nameAsc':
          this.productsList = this.productsList.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'nameDesc':
          this.productsList = this.productsList.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'priceAsc':
          this.productsList = this.productsList.sort((a, b) => a.price - b.price);
          break;
        case 'priceDesc':
          this.productsList = this.productsList.sort((a, b) => b.price - a.price);
          break;

      }
    } catch (error) {
      console.error(`Error getting products by search term: ${error}`);
      throw error;
    }
  }

}
