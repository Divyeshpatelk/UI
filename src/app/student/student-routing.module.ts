import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentComponent } from './student.component';
import { MyCoursesComponent } from './pages';
import { AuthGuard, CanDeactivateGuard } from '../core/route-guards';
import { CourseIndexResolver } from './resolvers';

const routes: Routes = [
  {
    path: '', component: StudentComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], children: [
      {
        path: 'courses', component: MyCoursesComponent
      },
      {
        path: 'dashboard/:courseId', component: DashboardComponent, resolve: { courseIndex: CourseIndexResolver }
      },
      {
        path: 'study', loadChildren: './study/study.module#StudyModule'
      },
      {
        path: 'practice', loadChildren: './practice/practice.module#PracticeModule'
      },
      {
        path: '', redirectTo: 'courses', pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
