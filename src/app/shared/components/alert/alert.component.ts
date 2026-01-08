import { Component, inject } from '@angular/core';
import { AlertStore } from '../../../core/store/alert.store';
import { SHARED_IMPORTS } from '../../shared.imports';

@Component({
  selector: 'app-alert',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {

  alertS = inject(AlertStore);

  close() {
    this.alertS.closeAlert();
  }

  submit() {
    this.alertS.submit();
  }





}
