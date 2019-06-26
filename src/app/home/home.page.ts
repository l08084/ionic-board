import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  post: {
    userName: string;
    message: string;
    createdDate: any;
  } = {
    userName: 'Taro Yamada',
    message: 'これはテキストメッセージです',
    createdDate: '10分前'
  };

  constructor() {}
}
