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
  message!: string;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }
   

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
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

    this.isSubmitted = true;
    if (this.loginForm.invalid) return;

    this.authService.login({ email: this.fc['email'].value, password: this.fc['password'].value }).
      subscribe(
        token => {
          this.authService.setTokenToLocal(token);
          this.router.navigateByUrl('');
        },
      error => {this.message = error.error;});
  }

}




