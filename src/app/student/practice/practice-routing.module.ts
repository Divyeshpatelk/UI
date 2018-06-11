import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PracticeComponent } from './practice.component';
import { CourseIndexResolver } from '../resolvers';
import { PracticeIndexContainerComponent } from './pages/practice-index-container/practice-index-container.component';
import { PracticeIndexConfigComponent } from './pages/practice-index-container/practice-index-config/practice-index-config.component';

const routes: Routes = [
  {
    path: 'course', component: PracticeComponent, children: [
      {
        path: ':id', component: PracticeIndexContainerComponent,
        resolve: { courseIndex: CourseIndexResolver },
        children: [
          {
            path: '', component: PracticeIndexConfigComponent
          }
        ]
      }
    ]
  }
];

/**
 * Student study Module Routing
 *
 * @export
 * @class StudyRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CourseIndexResolver
  ]
})
export class PracticeRoutingModule { }
