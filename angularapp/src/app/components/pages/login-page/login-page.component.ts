import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm!: FormGroup;
  isSubmitted: boolean = false;
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }


  ngOnInit(): void {
    // Create the login form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  /**
   * Getter function that returns the form controls
   */
  public get fc() {
    return this.loginForm.controls;
  }


  /**
 * This function runs when the login form is submitted
 */
  onSubmit() {
    this.isSubmitted = true;

    if (this.loginForm.invalid) return;

    try {
      // Attempt to login the user
      this.authService.login({ email: this.fc['email'].value, password: this.fc['password'].value }).subscribe(
        response => {
          console.log(" response", response);
          this.authService.setTokenToLocal(response.token);
          this.authService.setUser(response.user);
          // Navigate to the home page
          this.router.navigateByUrl('');
        },
        error => {
          // Display the error message to the user
          this.errorMessage = this.authService.loginErrMsg;
        }
      );
    } catch (error) {
      // Log the error to the console
      console.log('Error occurred during login: ', error);
    }
  }
}
