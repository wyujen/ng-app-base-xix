import { Routes } from '@angular/router';
import { MainBranchComponent } from './branches/main-branch/main-branch.component';

export const routes: Routes = [{
    path: '',
    component: MainBranchComponent,
    loadChildren: () =>
        import('./routes/main.routes').then(m => m.MAIN_ROUTES)

}

];
