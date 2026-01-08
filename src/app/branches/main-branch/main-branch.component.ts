import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from '../../shared/components/alert/alert.component';
@Component({
  selector: 'app-main-branch',
  imports: [
    RouterOutlet,
    AlertComponent
  ],
  templateUrl: './main-branch.component.html',
  styleUrl: './main-branch.component.scss'
})
export class MainBranchComponent {


}
