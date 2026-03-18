import { Component, inject, input, OnInit, output } from '@angular/core';
import {  AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe, NgIf } from '@angular/common';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { DatePickerComponent } from "../_forms/date-picker/date-picker.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, NgIf, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder); 
  
  private router = inject(Router);
  cancelRegister = output<boolean>()

registerForm: FormGroup = new FormGroup({});
maxDate: Date = new Date();
validationErrors: string[] = [];




ngOnInit(): void {
  this.initializeForm();
  this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
}


initializeForm(){
  this.registerForm = this.fb.group({
    gender: ['male'],
    username: ['Joshua', Validators.required],
    knownAs: ['', Validators.required],
    dateOfBirth: [null, Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4), 
      Validators.maxLength(8)
    ]],
    confirmPassword: ['', [Validators.required, this.matchValue('password')]]
  });
  this.registerForm.controls['password'].valueChanges.subscribe({
    next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
  })
}

matchValue(matchTo: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value === control.parent?.get(matchTo)?.value ? null : {notSame: true}
  }
  
}

register(){
  const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
  this.registerForm.patchValue({dateOfBirth: dob});
  this.accountService.register(this.registerForm.value).subscribe({
    next: response => this.router.navigateByUrl('/members'), 
    error: error => this.validationErrors = error
  })
}

cancel(){
  this.cancelRegister.emit(false);
}


private getDateOnly(dob : string | undefined){
  if(!dob) return;
  return new Date(dob).toISOString().slice(0, 10);
}
}
