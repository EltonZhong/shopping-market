/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';
import { PostsService } from './posts/posts.service';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.scss'
  ],
  template: `
    <header>
      <mat-toolbar color="primary">
        <a [routerLink]="['/']" class="logotTxt">Shopping!</a>
        <a class="links" [routerLink]="['/login']">login</a>
        <a class="links" [routerLink]="['/registe']">registe</a>
        <a class="links" [routerLink]="['/goods']">goods</a>
        <a class="links" [routerLink]="['/profile']">profile</a>
        <a class="links" href="/api/graphql">GraphQL browser</a>
      </mat-toolbar>
    </header>
    <router-outlet></router-outlet>
    <footer>
    </footer>
  `,
  providers: [PostsService]
})
export class AppComponent implements OnInit {
  public angularclassLogo = 'assets/img/angularclass-avatar.png';
  public name = 'Mean stack starter';
  public url = 'https://mean.io';

  constructor(
    public appState: AppState,
    public router: Router,
    public http: HttpClient,
    public cookies: CookieService
  ) {
    this.appState = appState;
    this.router = router;
    this.http = http;
    this.cookies = cookies;
  }

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
    this.http.post("/api/auth/login", {
      "token": this.cookies.get("token")
    })
      .subscribe({
          next: (va: any) => {
              console.log(va)
              // get new data
              this.appState.set("loginStatus", va.status);
              this.appState.set("username", va.username)
          }, error: (errors) => {
              console.log('there was an error sending the query', errors);
              console.log("login failed")
          }
      });

}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */

