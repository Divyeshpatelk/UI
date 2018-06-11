import { SignupComponent } from './auth/signup/signup.component';
/**
 * @class AppRoutingModule
 * Description: This class holds the routing configuration
 *              for the root module and its childs
 *              (components and modules).
 *
 * @version: 1.0
 * @author:
 *
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent, ResetPasswordComponent, ResetPasswordResolver } from './auth';
import { HomeComponent } from './market/home/home.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { AnonymousGuard, AuthGuard, RootDomainGuard, SubDomainGuard } from './core/route-guards';
import { JamnadasComponent } from './market/jamnadas/jamnadas.component';
import { PrivacyPolicyComponent } from './market/privacy-policy/privacy-policy.component';
import { TermsConditionComponent } from './market/terms-condition/terms-condition.component';
import { AboutUsComponent } from './market/about-us/about-us.component';
import { AdeptiaComponent } from './market/adeptia/adeptia.component';
import { BosonComponent } from './market/boson/boson.component';
import { SmithComponent } from './market/smith/smith.component';
import { CubeComponent } from './market/cube/cube.component';
import { ShreerenukaComponent } from './market/shreerenuka/shreerenuka.component';
// Routes array
const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [RootDomainGuard]
  },
  {
    path: 'c-jamnadas',
    component: JamnadasComponent,
    canActivate: [SubDomainGuard]
  },
  {
    path: 'meritto',
    component: JamnadasComponent,
    canActivate: [SubDomainGuard]
  },
  {
    path: 'adeptia',
    component: AdeptiaComponent,
    canActivate: [SubDomainGuard]
  },
  {
    path: 'boson',
    component: BosonComponent,
    canActivate: [SubDomainGuard]
  },
  {
    path: 'smittutorials',
    component: SmithComponent,
    canActivate: [SubDomainGuard]
  },
  {
    path: 'shreerenuka',
    component: ShreerenukaComponent,
    canActivate: [SubDomainGuard]
  },
  {
    path: 'cubetutorials',
    component: CubeComponent,
    canActivate: [SubDomainGuard]
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms-and-conditions',
    component: TermsConditionComponent
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  },
  {
    path: 'about-us/:contact',
    component: AboutUsComponent
  },
  {
    path: 'login',
    canActivate: [AnonymousGuard],
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'setPassword',
    component: ResetPasswordComponent,
    resolve: {
      valid: ResetPasswordResolver
    }
  },
  {
    path: 'partner',
    canLoad: [AuthGuard],
    loadChildren: './partner/partner.module#PartnerModule'
  },
  {
    path: 'student',
    canLoad: [AuthGuard],
    loadChildren: './student/student.module#StudentModule'
  },
  {
    path: 'practice-test',
    canLoad: [AuthGuard],
    loadChildren: './practice-test/practice-test.module#PracticeTestModule'
  },
  {
    path: 'test',
    canLoad: [AuthGuard],
    loadChildren: './custom-test/custom-test.module#CustomTestModule'
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
