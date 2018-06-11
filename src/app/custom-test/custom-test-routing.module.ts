import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, CanDeactivateGuard } from '../core/route-guards';

import { CustomTestContainerComponent, CustomTestResultContainerComponent } from './pages';
import { CustomTestComponent } from './custom-test.component';
import { ResultPageGuard, TestGuard } from './guards';

// Routes array
const routes: Routes = [
  {
    path: '', component: CustomTestComponent, canActivate: [AuthGuard], children: [
      {
        path: '', component: CustomTestContainerComponent, canActivate: [TestGuard]
      },
      {
        path: 'result', component: CustomTestResultContainerComponent, canActivate: [ResultPageGuard]
      }
    ]
  }
];

@NgModule({
  // FIXME: hash location strategy
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomTestRoutingModule { }
