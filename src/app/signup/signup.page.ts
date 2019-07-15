import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignupPage implements OnInit {
  signup: {
    email: string;
    password: string;
    name: string;
  } = {
    email: '',
    password: '',
    name: ''
  };

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {}

  signUp() {
    this.afAuth.auth
      .createUserWithEmailAndPassword(this.signup.email, this.signup.password)
      .then(created => {
        const newUser = created.user;
        newUser
          .updateProfile({
            displayName: this.signUp.name,
            photoURL: ''
          })
          .then(async () => {
            const toast = await this.toastCtrl.create({
              message: `${created.user.displayName}さんを登録しました`,
              duration: 3000
            });
            await toast.present();
          })
          .catch(async error => {
            const toast = await this.toastCtrl.create({
              message: error.toString(),
              duration: 3000
            });
            await toast.present();
          });
      });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
