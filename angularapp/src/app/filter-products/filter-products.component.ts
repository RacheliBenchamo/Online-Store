import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../services/product/product.service';

@Component({
  selector: 'app-filter-products',
  templateUrl: './filter-products.component.html',
  styleUrls: ['./filter-products.component.css']
})
export class FilterProductsComponent implements OnInit {

  selectedOption: string = 'nameAsc'; // default sorting option
  // event emitter to send the selected sorting option
  @Output() sortOption = new EventEmitter<string>();

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    try {
      // Initialize component and catch any errors
    } catch (error) {
      console.log('Error occurred during initialization: ', error);
    }
  }

  // emit the selected sorting option to parent component
  sortProducts() {
    try {
      this.sortOption.emit(this.selectedOption);
    } catch (error) {
      console.log('Error occurred during sorting: ', error);
    }
  }

}
