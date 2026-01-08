import { Routes } from '@angular/router';
import { GuestBranchComponent } from '../branches/guest-branch/guest-branch.component';
import { UserBranchComponent } from '../branches/user-branch/user-branch.component';
import { AdminBranchComponent } from '../branches/admin-branch/admin-branch.component';
// import { AuthGuard } from '../core/guards/auth.guard';
// import { AdminGuard } from '../core/guards/admin.guard';

export const MAIN_ROUTES: Routes = [
    {
        path: 'guest',
        component: GuestBranchComponent,
        loadChildren: () =>
            import('./guest.routes').then(m => m.GUEST_ROUTES),
    },
    {
        path: 'user',
        component: UserBranchComponent,
        canActivate: [],
        loadChildren: () =>
            import('./user.routes').then(m => m.USER_ROUTES),
    },
    {
        path: 'admin',
        component: AdminBranchComponent,
        canActivate: [],
        loadChildren: () =>
            import('./admin.routes').then(m => m.ADMIN_ROUTES),
    },
];
