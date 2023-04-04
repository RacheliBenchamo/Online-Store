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

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {
    // Subscribe to user changes in the auth service
    authService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });

    try {
      // If a token is available, set the user
      if (this.isTokenAvailable()) {
        this.setUser();
      }

      // Subscribe to cart changes in the cart service
      this.cartService.cartObservable.subscribe((cartItems) => {
        this.cartQuantity = cartItems.length;
      });
    } catch (error) {
      console.log('Error occurred during initialization: ', error);
    }
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  /**
   * Logout the user and reset user variable
   */
  public logout() {
    try {
      this.authService.logout();
      this.user = new User;
    } catch (error) {
      console.log('Error occurred during logout: ', error);
    }
  }

  /**
   * Set the user from the auth service
   */
  setUser() {
    try {
      this.authService.getUser2().subscribe(
        (user: User) => {
          this.user = user;
        },
        (error) => {
          console.error('Error getting user:', error);
        }
      );
    } catch (error) {
      console.log('Error occurred during setting user: ', error);
    }
  }


  public getName() {
    this.user = this.authService.getUser();
    return this.user.name != '' ? this.user.name : "Guest";
  }

  public isTokenAvailable() {
    return this.authService.IsUserConnect();
  }

  public isAdmin() {
    return this.authService.getUser().isAdmin;
  }

  public setCartQuantity(quan: number) {
    this.cartQuantity = quan;
  }

}
