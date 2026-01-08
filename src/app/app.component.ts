import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

import { AlertStore } from './core/store/alert.store';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ng-app-base-xix';
  getApi() {
    console.log('api-url', environment.apiUrl)
  }

  alertS = inject(AlertStore)

  openAlert() {
    this.alertS.openAlert()
  }
}
