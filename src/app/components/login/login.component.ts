import { AuthenticationService } from './../../services/auth.service';
import { Login } from './../../models/login.model';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginUser: Login;

  constructor(
    private snackbar: MatSnackBar,
    private authServer: AuthenticationService
    ) { }

  ngOnInit() {
  }

  login (loginUser: Login) {
    this.authServer.login(loginUser.username, loginUser.password).subscribe((result: Login) => {
      if (!result.error) {
        this.snackbar.open(`Welcome ${loginUser.username}.`, '', { duration: 3000 });
      } else {
        this.snackbar.open(`Invalid Login. Try Again.`, '', { duration: 3000 });
      }
    });
  }

}
