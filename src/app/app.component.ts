import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProjectService } from './services/project.service';
import { EmailService } from './services/email.service';
import { NewsService } from './services/news.service';
import { PageScrollConfig } from 'ng2-page-scroll';

import { News } from './models/news';
import { ProjectComponent } from './project/project.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ProjectService, NewsService, EmailService]
})
export class AppComponent implements OnInit {
  recentNews: Array<News>;
  hostname: String;
  constructor(private newsService: NewsService, private _router: Router) {
    // Used for sharing links.
    this.hostname = encodeURI(window.location.href.replace(/\/$/, ''));

    PageScrollConfig.defaultScrollOffset = 50;
    PageScrollConfig.defaultEasingLogic = {
      ease: (t: number, b: number, c: number, d: number): number => {
        // easeInOutExpo easing
        if (t === 0) {
          return b;
        }
        if (t === d) {
          return b + c;
        }
        if ((t /= d / 2) < 1) {
          return c / 2 * Math.pow(2, 8 * (t - 1)) + b;
        }
        return c / 2 * (-Math.pow(2, -8 * --t) + 2) + b;
      }
    };
  }

  ngOnInit() {
    this._router.events.subscribe((url: any) => {
      if (url.url === '/') {
        this.newsService.getRecentNews().subscribe(
          data => { this.recentNews = data; },
          error => console.log(error)
        );
      } else {
        this.recentNews = null;
      }
      document.body.scrollTop = 0;
    });

  }
}
