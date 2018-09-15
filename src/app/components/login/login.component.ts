import { ServerResponse } from './../../models/login-response.model';
import { AuthenticationService } from './../../services/auth.service';
import { Login } from './../../models/login.model';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit {
  returnUrl: string;
  loginUser: Login = {
    username: '',
    password: ''
  };


  constructor(
    private snackbar: MatSnackBar,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit() {
    // reset login status
    this.authService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log('ru', this.returnUrl);
  }

  login (loginUser: Login) {
    console.log(loginUser);
    this.authService.login(loginUser.username, loginUser.password).subscribe((result: ServerResponse) => {
      if (!result.error) {
        this.snackbar.open(`Welcome ${loginUser.username}.`, '', { duration: 3000 });
        this.router.navigate([this.returnUrl]);
      } else {
        this.snackbar.open(`Invalid Login. Try Again.`, '', { duration: 3000 });
      }
    });
  }

}
