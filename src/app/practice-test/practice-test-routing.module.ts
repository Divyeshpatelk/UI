import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, CanDeactivateGuard } from '../core/route-guards';

import { TestContainerComponent, ResultContainerComponent } from './pages';
import { PracticeTestComponent } from './practice-test.component';
import { ResultPageGuard, TestGuard } from './guards';

// Routes array
const routes: Routes = [
  {
    path: '', component: PracticeTestComponent, canActivate: [AuthGuard], children: [
      {
        path: '', component: TestContainerComponent, canActivate: [TestGuard]
      },
      {
        path: 'result', component: ResultContainerComponent, canActivate: [ResultPageGuard]
      }
    ]
  }
];

@NgModule({
  // FIXME: hash location strategy
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticeTestRoutingModule { }
