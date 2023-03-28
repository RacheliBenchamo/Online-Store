import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { Tag } from '../../shared/models/Tag';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  // Input properties to receive data from parent component
  @Input()
  productPageTags?: string[];

  @Input()
  justifyContent?: string = 'center';

  // Variable to store the tags fetched from the ProductService
  tags?: Tag[];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    try {
      // If productPageTags is not provided, fetch all tags from ProductService
      if (!this.productPageTags) {
        this.tags = this.productService.getAllTags();
      }
    } catch (error) {
      console.error('Error occurred while fetching tags:', error);
    }
  }

}
