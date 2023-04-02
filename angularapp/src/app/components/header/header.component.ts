import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';

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
  }

  ngOnInit(): void {
    this.user= this.authService.getUser();
  }

  public logout() {
    this.authService.logout();
  }

  public getName() {
    this.user = this.authService.getUser();
    return this.user.name;
  }

  public isUserLogin() {
    return this.authService.IsUserConnect();
  }

  public isAdmin() {
    return this.authService.getUser().isAdmin;
  }

}
