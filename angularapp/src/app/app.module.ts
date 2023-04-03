import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { SearchComponent } from './components/partials/search/search.component';
import { ProductPageComponent } from './components/pages/product-page/product-page.component';
import { CartPageComponent } from './components/pages/cart-page/cart-page.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { FilterProductsComponent } from './components/partials/filter-products/filter-products.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { TitleComponent } from './components/partials/title/title.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { EditProductComponent } from './components/pages/edit-product/edit-product.component';
import { AddProductPageComponent } from './components/pages/add-product-page/add-product-page.component';

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
