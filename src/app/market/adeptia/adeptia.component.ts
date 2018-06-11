import { Component, OnInit } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services';
import { MarketService } from '../market.service';
import { Course, ContentUnitCount } from '../../_models';
import { imageMap } from '../home/home.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../../auth/login-modal/login-modal.component';
import { CouponRedemptionModalComponent } from '../../student/pages';

export const tempCourse = [
  {
    img: environment.staticContentPath + '/images/courses/adeptia-new-1.png',
    title: 'April Issue',
    author: 'Adeptia E-Magazine',
    id: '5ac7262a07381a4ce585fc26',
    price: 50,
    priceRevised: 30,
    couponCode: 'ADPNEET'
  }
];

@Component({
  selector: 'pdg-adeptia',
  templateUrl: './adeptia.component.html',
  styleUrls: ['./adeptia.component.scss']
})
export class AdeptiaComponent implements OnInit {
  public staticContentPath: string;
  public carouselOne: NgxCarousel;
  public carouselTwo: NgxCarousel;
  partnerdata;
  availableCourses: {
    img: string;
    title: string;
    author: string;
    id: string;
    price: number;
    couponCode: string;
  }[] = tempCourse;
  myCourses: { img: string; title: string; author?: string; id: string; price: number }[] = null;

  isLoggedIn = false;

  constructor(
    public authService: AuthenticationService,
    private marketService: MarketService,
    private modalService: NgbModal
  ) {
    this.staticContentPath = environment.staticContentPath;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.isLoggedIn = this.authService.isLoggedIn();
    this.partnerdata = {
      img: this.staticContentPath + '/images/adeptia.png',
      title: 'Adeptia Educational Services',
      description: ''
    };

    const slCount = 3;
    this.carouselOne = {
      grid: { xs: 1, sm: 2, md: slCount, lg: slCount, all: 0 },
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: false
      },
      load: 1,
      touch: true,
      loop: false,
      custom: 'banner'
    };

    this.carouselTwo = {
      grid: { xs: 1, sm: 3, md: 4, lg: 4, all: 0 },
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: false
      },
      load: 1,
      touch: true,
      loop: false,
      custom: 'banner'
    };
    this.displayCourses();
  }

  /**
   * Method invoked on Logout button click.
   */
  showLogin() {
    const modalRef = this.modalService.open(LoginModalComponent);
    modalRef.result.then(
      (result) => {
        this.showCouponRedemptionModal();
      },
      (reason) => {
        // todo on cancel
      }
    );
  }

  showCouponRedemptionModal() {
    const modalRef = this.modalService.open(CouponRedemptionModalComponent);
    modalRef.result.then(
      (result) => {
        location.reload();
      },
      (reason) => {
        location.reload();
      }
    );
  }

  displayCourses() {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.marketService.getMyCourses().subscribe((data: { course: Course; contentUnitCount: ContentUnitCount }[]) => {
      this.availableCourses = this.availableCourses.filter(
        (aCourse: { img: string; title: string; author: string; id: string; price: number; couponCode: string }) => {
          for (let i = 0; i < data.length; i++) {
            const aCourseBundle: { course: Course; contentUnitCount: ContentUnitCount } = data[i];
            if (aCourse.id === aCourseBundle.course.id) {
              return false;
            }
          }
          return true;
        }
      );

      this.myCourses = data.map((courseBundle: { course: Course; contentUnitCount: ContentUnitCount }) => {
        const courseDetail: { img: string; title: string; author?: string; id: string; price: number } = {
          img: this.staticContentPath + imageMap[courseBundle.course.id],
          title: courseBundle.course.courseName,
          id: courseBundle.course.id,
          price: 0
        };
        return courseDetail;
      });
      window.scrollTo(0, 0);
    });
  }
}
