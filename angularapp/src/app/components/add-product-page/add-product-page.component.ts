import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product/product.service';


@Component({
  selector: 'app-add-product-page',
  templateUrl: './add-product-page.component.html',
  styleUrls: ['./add-product-page.component.css']
})
export class AddProductPageComponent implements OnInit {
  addProductForm!: FormGroup;
  isSubmitted: boolean = false;
  message: string = '';

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute, private router: Router,
    private productService: ProductService) { }


  ngOnInit(): void {
  
    this.addProductForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      imgUrl: ['', [Validators.required]],
      price: ['', [Validators.required]],
      stock: ['', [Validators.required]],
    });
  
  }


  public get fc() {
    return this.addProductForm.controls;
  }

  public addNewProduct(product: Product) {
    
  }


  onSubmit() {
    this.isSubmitted = true;

    if (this.addProductForm.invalid) return;

    const newProduct: Product = {
      id: 20,
      name: this.fc['name'].value,
      imgUrl: this.fc['imgUrl'].value,
      price: this.fc['price'].value,
      favorite: false,
      stock: this.fc['stock'].value,
    };
    this.productService.addProduct(newProduct).subscribe(
      products => {
        this.message = 'Adding product successful';      },
      error => {
        this.message = 'Adding product failed - ' + error;
      }
    );
  }
}
