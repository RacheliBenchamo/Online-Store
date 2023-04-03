import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { AuthService } from '../../../services/auth/auth.service';
import { CartService } from '../../../services/cart/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  shopName: string = "The Vegetable House"
  cartQuantity = 0;
  user!: User;

  constructor(cartService: CartService, private authService: AuthService) {
    //cartService.getCartObservable().subscribe((newCart) => {
     // this.cartQuantity = newCart.totalCount;
   // })

    authService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    })

    if (this.isTokenAvailable())
      this.setUser();
    
  }

  ngOnInit(): void {
    this.user= this.authService.getUser();
  }

  public logout() {
    this.authService.logout();
    this.user = new User;
  }

  setUser() {
    this.authService.getUser2().subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => {
        console.error('Error getting user:', error);
      }
    );
  }

  public getName() {
    //this.setUser();
    this.user = this.authService.getUser();
    console.log("name --- ", this.user.name)
    return this.user.name != '' ?this.user.name : "Guest";
  }

  public isTokenAvailable() {
    return this.authService.IsUserConnect();
  }

  public isAdmin() {
    return this.authService.getUser().isAdmin;
  }

}
