import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { CartPageComponent } from './components/cart-page/cart-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FilterProductsComponent } from './components/filter-products/filter-products.component';
import { ManageStoreComponent } from './components/manage-store/manage-store.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { TitleComponent } from './components/title/title.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { AddProductPageComponent } from './components/add-product-page/add-product-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search/:searchTerm', component: HomeComponent },
  { path: 'product/:name', component: ProductPageComponent },
  { path: 'editProduct/:name', component: EditProductComponent },
  { path: 'add-product-page', component: AddProductPageComponent },
  { path: 'cart-page', component: CartPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SearchComponent,
    ProductPageComponent,
    CartPageComponent,
    NotFoundComponent,
    FilterProductsComponent,
    ManageStoreComponent,
    LoginPageComponent,
    TitleComponent,
    RegisterPageComponent,
    EditProductComponent,
    AddProductPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      newestOnTop: false
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
