import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartnerComponent } from './partner.component';
import { CourseIndexResolver } from './resolvers';
import {
  MyCoursesComponent,
  CreateCourseComponent,
  IndexContainerComponent,
  PublishCourseComponent,
  MyLibraryComponent,
  StudyMaterialComponent,
  QuestionsComponent
} from './pages';

import { AuthGuard, CanDeactivateGuard } from '../core/route-guards';

const routes: Routes = [
  {
    path: '', component: PartnerComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], children: [
      {
        path: 'courses', component: MyCoursesComponent
      },
      {
        path: 'library', component: MyLibraryComponent, children: [
          {
            path: '', component: StudyMaterialComponent
          },
          {
            path: 'study', component: StudyMaterialComponent
          },
          {
            path: 'questions', component: QuestionsComponent
          }
        ]
      },
      {
        path: 'course', children: [
          {
            path: 'create', component: CreateCourseComponent
          },
          {
            path: ':id', children: [
              {
                path: 'edit',
                component: IndexContainerComponent,
                data: { isEditable: true },
                resolve: { courseIndex: CourseIndexResolver }
              },
              {
                path: 'view',
                component: IndexContainerComponent,
                data: { isEditable: false },
                resolve: { courseIndex: CourseIndexResolver }
              },
              {
                path: 'publish', component: PublishCourseComponent
              },
              {
                path: '', redirectTo: 'view', pathMatch: 'full'
              }
            ]
          }
        ]
      },
      {
        path: '', redirectTo: 'courses', pathMatch: 'full'
      }
    ]
  }
];

/**
 * This class defines routes for Partner Module
 *
 * @export
 * @class PartnerRoutingModule
 * @version 1.0
 * @author
 */
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CourseIndexResolver
  ]
})
export class PartnerRoutingModule { }
