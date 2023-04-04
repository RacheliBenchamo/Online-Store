import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchTerm: string = "";

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Get the search term from the route parameters
    this.route.params.subscribe(params => {
      if (params['searchTerm'])
        this.searchTerm = params['searchTerm'];
    })
  }

  /**
   * Navigates to the search page with the current search term
   */
  search(): void {
    if (this.searchTerm)
      this.router.navigateByUrl('/search/' + this.searchTerm)
  }
}
