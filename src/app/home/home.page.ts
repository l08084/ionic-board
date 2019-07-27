import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

import { Post } from '../models/post';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  message: string; // 入力されるメッセージ用
  post: Post;
  posts: Post[];

  // FireStoreのコレクションを扱うプロパティ
  postsCollection: AngularFirestoreCollection<Post>;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private afStore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {
    // コンポーネントの初期化時に、投稿を読み込むgetPosts()を実行
    this.getPosts();
  }

  addPost() {
    // 入力されたメッセージを使って、投稿データを作成
    this.post = {
      id: '',
      userName: this.afAuth.auth.currentUser.displayName,
      message: this.message,
      created: firebase.firestore.FieldValue.serverTimestamp()
    };

    // ここでFirestoreにデータを追加する
    this.afStore
      .collection('posts')
      .add(this.post)
      .then(docRef => {
        // 一度投稿を追加した後に、idを更新してる
        this.postsCollection.doc(docRef.id).update({
          id: docRef.id
        });
        // 追加できたら入力フィールドを空にする
        this.message = '';
      })
      .catch(async error => {
        // エラーをToastControllerで表示
        const toast = await this.toastCtrl.create({
          message: error.toString(),
          duration: 3000
        });
        await toast.present();
      });
  }

  /**
   * Firestoreから投稿データを読み込む
   *
   * @memberof HomePage
   */
  getPosts() {
    // コレクションの参照をここで取得している
    this.postsCollection = this.afStore.collection('posts', ref =>
      ref.orderBy('created', 'desc')
    );

    // データに変更があったらそれを受け取ってpostsに入れる
    this.postsCollection.valueChanges().subscribe(data => {
      this.posts = data;
    });
  }

  async presentPrompt(post: Post) {
    const alert = await this.alertCtrl.create({
      header: 'メッセージ編集',
      inputs: [
        {
          name: 'message',
          type: 'text',
          placeholder: 'メッセージ'
        }
      ],
      buttons: [
        {
          text: 'キャンセル',
          role: 'cancel',
          handler: () => {
            console.log('キャンセルが選択されました');
          }
        },
        {
          text: '更新',
          handler: data => {
            this.updatePost(post, data.message);
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   *　メッセージをアップデートする。
   *  更新されると投稿とメッセージを受け取る
   *
   * @param {Post} post
   * @param {string} message
   * @memberof HomePage
   */
  updatePost(post: Post, message: string) {
    // 入力されたメッセージで投稿を更新
    this.postsCollection
      .doc(post.id)
      .update({ message })
      .then(async () => {
        const toast = await this.toastCtrl.create({
          message: '投稿が更新されました',
          duration: 3000
        });
        await toast.present();
      })
      .catch(async error => {
        const toast = await this.toastCtrl.create({
          message: error.toString(),
          duration: 3000
        });
      });
  }

  // 投稿日時と現在日時の差を返す
  differenceTime(time: Date): string {
    moment.locale('ja');
    return moment(time).fromNow();
  }

  /**
   * 投稿を削除する
   *
   * @param {Post} post
   * @memberof HomePage
   */
  deletePost(post: Post) {
    // 受け取った投稿のidを参照して削除
    this.postsCollection
      .doc(post.id)
      .delete()
      .then(async () => {
        const toast = await this.toastCtrl.create({
          message: '投稿が削除されました',
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
  }
}
