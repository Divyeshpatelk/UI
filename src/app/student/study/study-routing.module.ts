import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudyComponent } from './study.component';
import { CourseIndexResolver } from '../resolvers';
import { StudyGuard } from '../guards';

import {
  StudyIndexContainerComponent,
  StudyIndexContentComponent,
  StudyIndexContentViewerComponent
} from './pages';

const routes: Routes = [
  {
    path: 'course', component: StudyComponent, children: [
      {
        path: ':id', component: StudyIndexContainerComponent,
        resolve: { courseIndex: CourseIndexResolver },
        children: [
          {
            path: '', component: StudyIndexContentComponent
          }
        ],
        canActivate: [StudyGuard]
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
  providers: [CourseIndexResolver, StudyGuard]
})
export class StudyRoutingModule {}
