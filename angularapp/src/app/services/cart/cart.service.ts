import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { CartItem } from '../../models/CartItem';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cartObservable: Observable<CartItem[]>;

  constructor(private http: HttpClient) {
    this.cartObservable = this.cartSubject.asObservable();
  }

  /**
   * Add an item to cart
   * @param clientEmail
   * @param productName
   * @returns Observable<void>
   */
  public addToCart(clientEmail: string, productName: string): Observable<void> {
    return this.http.post<void>(`cart/addToCart/email/${clientEmail}/productName/${productName}`, null).pipe(
      catchError((error: HttpErrorResponse) => {
        // Rethrow the error to propagate it further
        return throwError(error);
      })
    );
  }


  /**
   * Remove an item from cart
   * @param clientEmail
   * @param productName
   * @returns Observable<void>
   */
  public removeFromCart(clientEmail: string, productName: string): Observable<void> {
    return this.http.post<void>(`cart/removeFromCart/email/${clientEmail}/productName/${productName}`, null).pipe(
      catchError((error: HttpErrorResponse) => {
        // Rethrow the error to propagate it further
        return throwError(error);
      })
    );
  }


  /**
   * Buy the cart
   * @param clientEmail
   * @returns Observable<void> 
   */
  public buyCart(clientEmail: string): Observable<void> {
    return this.http.delete<void>(`cart/buy/email/${clientEmail}`).pipe(
      catchError((error: HttpErrorResponse) => {
        // Rethrow the error to propagate it further
        return throwError(error);
      })
    );
  }


  /**
   * Get client cart
   * @param clientEmail
   * @returns Observable<CartItem[]>
   */
  public getCart(clientEmail: string): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`cart/getCart/email/${clientEmail}`).pipe(
      map((response: CartItem[]) => {
        return response; // Return the response as an array of CartItem objects
      }),
      catchError((error: HttpErrorResponse) => {
        // Rethrow the error to propagate it further
        return throwError(error);
      })
    );
  }


  /**
   * Update cart item quantity
   * @param clientEmail
   * @param productName
   * @param newQuantity
   * @returns Observable<CartItem> 
   */
  public updateCartItemQuantity(clientEmail: string, productName: string, newQuantity: number)
    : Observable<CartItem> {
    return this.http.put<CartItem>
      (`cart/email/${clientEmail}/prodName/${productName}/prodQuan/${newQuantity}`, null).pipe(
      map((response: CartItem) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        // Rethrow the error to propagate it further
        return throwError(error);
      })
    );
  }

}
