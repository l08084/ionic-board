import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  posts: {
    userName: string;
    message: string;
    createdDate: any;
  }[] = [
    {
      userName: 'Taro Yamada',
      message: 'これはテキストメッセージです',
      createdDate: '10分前'
    },
    {
      userName: 'Jiro Suzuki',
      message: 'ふたつめのテキストメッセージ',
      createdDate: '5分前'
    }
  ];

  constructor() {}
}
