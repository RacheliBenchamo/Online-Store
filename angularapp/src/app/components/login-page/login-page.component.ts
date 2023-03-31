import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm!: FormGroup;
  isSubmitted: boolean = false;
  returnUrl: string = '';

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }
   

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })

    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
  }

  public get fc() {
    return this.loginForm.controls;
  }

  public submit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid)
      return;
    alert("login success");
  }

  onSubmit() {
    this.authService.login({
      email: this.fc['email'].value,
      password: this.fc['password'].value
    }).subscribe(
      token => {
        console.log('Login successful');
        localStorage.setItem('auth_token', token);
      },
      error => {
        console.log('Login failed: ' + error.error);
      }
    );
  }
}




