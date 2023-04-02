import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  registerForm!: FormGroup;
  isSubmitted = false;
  message: string = '';

  returnUrl = '';
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    }, {
      
    });
  }

  get fc() {
    return this.registerForm.controls;
  }

  onSubmit() {

    this.isSubmitted = true;
    if (this.registerForm.invalid) return;

    // Perform client-side validation here, if needed

    this.authService.register
      ({
        email: this.fc['email'].value,
        password: this.fc['password'].value,
        name: this.fc['name'].value,
        isAdmin: false,
      })
      .subscribe(
      (response: User) => {
        this.message='Registration successful, you can now Login!';
      },
      (error) => {
        this.message = 'Registration failed - '+ error;
      }
    );
  }


}
