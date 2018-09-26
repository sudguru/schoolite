import { ElectronService } from './../../providers/electron.service';
import { ServerResponse } from './../../models/login-response.model';
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
    email: '',
    password: ''
  };


  constructor(
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private electronService: ElectronService
    ) {

      this.electronService.ipcRenderer.on('loginSuccess', (evt, rows) => {
        // console.log('pass', rows);
        const data = {
          name: rows[0].first_name + ' ' + rows[0].last_name,
          is_admin: rows[0].is_admin
        };
        localStorage.setItem('token', JSON.stringify(data));
        this.snackbar.open(`Welcome ${data.name}.`, '', { duration: 2000 });
        this.router.navigate(['/home']);
      });

      this.electronService.ipcRenderer.on('loginFailure', (evt, rows) => {
        this.snackbar.open(`Invalid Login. Try Again.`, '', { duration: 2000 });
      });

    }

  ngOnInit() {
    localStorage.removeItem('token');
  }

  login (loginUser: Login) {
    console.log(loginUser);
    this.electronService.ipcRenderer.send('login', loginUser);
  }

}
