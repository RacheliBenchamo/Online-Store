// Importing necessary dependencies
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/Product';
import { ProductService } from '../../../services/product/product.service';

// Defining the AddProductPageComponent class
@Component({
  selector: 'app-add-product-page',
  templateUrl: './add-product-page.component.html',
  styleUrls: ['./add-product-page.component.css']
})
export class AddProductPageComponent implements OnInit {
  // Initializing necessary properties
  addProductForm!: FormGroup;
  isSubmitted = false;
  message = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }


  ngOnInit(): void {
    try {
      // Creating the form group
      this.addProductForm = this.formBuilder.group({
        name: ['', [Validators.required]],
        imgUrl: ['', [Validators.required]],
        price: ['', [Validators.required]],
        stock: ['', [Validators.required]]
      });
    } catch (error) {
      console.log('Error while creating form group: ', error);
    }
  }

  /**
   * Getter function to access form controls
   */
  get fc() {
    return this.addProductForm.controls;
  }

  /**
   * Handle form submission
   */
  onSubmit() {
    try {
      // Marking the form as submitted
      this.isSubmitted = true;

      // Checking if the form is invalid
      if (this.addProductForm.invalid) {
        return;
      }

      // Creating a new product object with form values
      const newProduct: Product = {
        name: this.fc['name'].value,
        imgUrl: this.fc['imgUrl'].value,
        price: this.fc['price'].value,
        favorite: false,
        stock: this.fc['stock'].value
      };

      // Adding the new product
      this.productService.addProduct(newProduct).subscribe(
        (products) => {
          this.message = 'Adding product successful';
        },
        (error) => {
          this.message = 'Adding product failed - ' + error;
        }
      );
    } catch (error) {
      console.log('Error while submitting form: ', error);
    }
  }
}
