import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Cart } from '../../models/Cart';
import { CartItem } from '../../models/CartItem';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: Cart = new Cart();

  constructor(private http: HttpClient) { }


  // add to cart
  public addToCart(clientId: string, productName: string): Observable<void> {
    return this.http.post<void>(`cart/${clientId}/products/${productName}`, null)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error); // Rethrow the error to propagate it further
        })
      );
  }

  // remove from cart
  public removeFromCart(clientId: string, productName: string): Observable<void> {
    return this.http.post<void>(`cart/remove-from-cart`, { clientId, productName })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error); // Rethrow the error to propagate it further
        })
      );
  }

  // buy the cart
  public buyCart(clientId: string): Observable<void> {
    return this.http.delete<void>(`cart/${clientId}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error); // Rethrow the error to propagate it further
        })
      );
  }

  // get client cart
  public getCart(clientId: string): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`cart/${clientId}`)
      .pipe(
        map((response: CartItem[]) => {
          return response; // Return the response as an array of CartItem objects
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error); // Rethrow the error to propagate it further
        })
      );
  }

  // update cart item quantity
  public updateCartItemQuantity(clientId: string, productName: string, newQuantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`cart/${clientId}/${productName}`, { newQuantity })
      .pipe(
        map((response: CartItem) => {
          return response; // Return the response as a CartItem object
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error); // Rethrow the error to propagate it further
        })
      );
  }
}
