import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product/product.service';


@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  editProductForm!: FormGroup;
  product!: Product;
  isSubmitted: boolean = false;
  message: string = '';

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute, private router: Router,
    private productService: ProductService) { }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.productService.getProductById(params['id']).subscribe(result => {
          this.product = result;
          if (!this.product) {
            throw new Error('Product not found');
          
      
          }
          this.editProductForm = this.formBuilder.group({
            name: [this.product.name, Validators.required],
            imgUrl: [this.product.imgUrl, Validators.required],
            price: [this.product.price, Validators.required],
            stock: [this.product.stock, Validators.required]
          });
        });
      }
    });
  }


  public get fc() {
    return this.editProductForm.controls;
  }

  onSubmit() {
    console.log(this.product.name);
    this.isSubmitted = true;

    if (this.editProductForm.invalid) return;

    const updatedProduct: Product = {
      id: this.product.id,
      name: this.fc['name'].value,
      imgUrl: this.fc['imgUrl'].value,
      price: this.fc['price'].value,
      favorite: this.product.favorite,
      stock: this.fc['stock'].value,
    };
    this.productService.updateProduct(updatedProduct).subscribe(
      products => {
        this.message = 'Edit successful';
      },
      error => {
        this.message = 'Edit failed - ' + error;

      }
    );
  }
}
