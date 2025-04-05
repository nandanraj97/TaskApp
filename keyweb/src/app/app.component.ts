// 

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
// })
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  keys: (number | null)[] = Array(10).fill(null);
  user: number = 0;
  control: any = null;
  hasControl: boolean = false;
  pollingInterval: any;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.user = +params['user'] || 1;
      console.log('User ID:', this.user);
    });
    this.pollState();
    this.pollingInterval = setInterval(() => this.pollState(), 1000);
  }

  getColor(i: number) {
    if (this.keys[i] === 1) return 'red';
    if (this.keys[i] === 2) return 'yellow';
    return 'white';
  }

  acquireControl() {
    this.http.post<any>('http://localhost:3000/acquire', { user: this.user }).subscribe(res => {
      this.hasControl = res.success;
    });
  }

  releaseControl() {
    this.http.post<any>('http://localhost:3000/release', {}).subscribe(() => {
      this.hasControl = false;
    });
  }

  toggleKey(i: number) {
    if (!this.hasControl) return;
    this.http.post<any>('http://localhost:3000/update', { index: i, user: this.user }).subscribe(() => {
      this.hasControl = false;
      this.pollState(); // update immediately
    });
  }

  pollState() {
    this.http.get<any>('http://localhost:3000/state').subscribe(res => {
      this.keys = res.keys;
      this.control = res.control;
      if (this.control?.user !== this.user) {
        this.hasControl = false;
      }
    });
  }
}
