import { Component, OnInit } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';

import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services';
import { MarketService } from '../market.service';
import { Course, ContentUnitCount } from '../../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../../auth/login-modal/login-modal.component';
import { CouponRedemptionModalComponent } from '../../student/pages';

export const tempCourse = [
  {
    img: environment.staticContentPath + '/images/courses/maths-new.png',
    title: 'ધોરણ ૧૦: ગણિત',
    author: 'Jamnadas Edu Media',
    id: '5a8e6f8e215be9057beb33cb',
    price: 0,
    couponCode: 'MKH125'
  },
  {
    img: environment.staticContentPath + '/images/courses/science-and-technology-new.png',
    title: 'ધો. ૧૦: વિજ્ઞાન અને ટેકનોલોજી',
    author: 'Jamnadas Edu Media',
    id: '5a78094a215be9076b2a341b',
    price: 0,
    couponCode: 'MKH123'
  },
  {
    img: environment.staticContentPath + '/images/courses/social-science-new.png',
    title: 'ધો. ૧૦: સામાજીક વિજ્ઞાન',
    author: 'Jamnadas Edu Media',
    id: '5a86d2b1215be9057beb2c75',
    price: 0,
    couponCode: 'MKH124'
  }
];
export const tempCourseGujcetEng = [];

export const tempCourseGujcetGuj = [
  {
    img: environment.staticContentPath + '/images/courses/course-cover-mock-new1.png',
    title: '10 practice tests ભૌતિક, રસાયણ & જીવ વિજ્ઞાન',
    author: 'Jamnadas Edu Media',
    id: '5abca5ad215be94099e86d17',
    price: 200,
    priceRevised: 50,
    couponCode: 'GUJCETAMKH',
    comingSoon: false
  },
  {
    img: environment.staticContentPath + '/images/courses/practice-test-physics-and-chemestry-2.png',
    title: '10 practice tests ભૌતિક & રસાયણ વિજ્ઞાન',
    author: 'Jamnadas Edu Media',
    id: '5ac374df76d8ce4ca6a3c672',
    price: 150,
    priceRevised: 40,
    couponCode: 'GCMP',
    comingSoon: false
  }
];
export const adeptCourse = [
  {
    img: environment.staticContentPath + '/images/courses/adeptia-new-1.png',
    title: 'Adeptia E-Magazine',
    author: 'April Issue',
    id: '5ac7262a07381a4ce585fc26',
    price: 50,
    priceRevised: 30,
    couponCode: 'ADPNEET'
  }
];
export const topCourses = [
  {
    img: environment.staticContentPath + '/images/courses/adeptia-new-1.png',
    title: 'Adeptia E-Magazine',
    author: 'April Issue',
    id: '5ac7262a07381a4ce585fc26',
    price: 50,
    priceRevised: 30,
    couponCode: 'ADPNEET',
    testType: 'Adeptia presents "NEET Digest" India\'s First'
      + 'e-Magazine with Live Test Series for NEET, AIIMS & JIPMER'
      + ' Exams along with notes & videos for Physics from the NEET'
      + ' experts.',
    pageNo: '231',
    hours: '1.5',
    testCount: '3'

  },
  {
    img: environment.staticContentPath + '/images/courses/course-cover-mock-new1.png',
    title: '10 practice tests ભૌતિક, રસાયણ & જીવ વિજ્ઞાન',
    author: 'Jamnadas Edu Media',
    id: '5abca5ad215be94099e86d17',
    price: 200,
    priceRevised: 50,
    couponCode: 'GUJCETAMKH',
    comingSoon: false,
    testType: '20 Practice Tests in Gujarati, 10'
      + ' for “Physics + Chemistry” and 10 for Biology, curated'
      + ' and designed for GujCET 2018, by Jamnadas'
      + ' EduMedia, creators of Modern Magazines.',
    quizeCount: '1200',
    testCount: '20'
  },
  {
    img: environment.staticContentPath + '/images/courses/practice-test-physics-and-chemestry-2.png',
    title: '10 practice tests ભૌતિક & રસાયણ વિજ્ઞાન',
    author: 'Jamnadas Edu Media',
    id: '5ac374df76d8ce4ca6a3c672',
    price: 150,
    priceRevised: 40,
    couponCode: 'GCMP',
    comingSoon: false,
    testType: '10 Practice tests in Gujarati for'
      + ' “Physics + Chemistry” curated and designed'
      + ' for GujCET 2018, by Jamnadas EduMedia,'
      + ' creators of Modern Magazines.',
    quizeCount: '800',
    testCount: '10'
  }
];
export const imageMap = {
  '5a78094a215be9076b2a341b': '/images/courses/science-and-technology-new.png',
  '5a86d2b1215be9057beb2c75': '/images/courses/social-science-new.png',
  '5a8e6f8e215be9057beb33cb': '/images/courses/maths-new.png',
  '5abca5ad215be94099e86d17': '/images/courses/course-cover-mock-new.png',
  '5ac374df76d8ce4ca6a3c672': '/images/courses/practice-test-physics-and-chemestry.png',
  // '5ac4765c215be90738ea7b3b': '/images/courses/adeptia-new-1.png',
  '5ac72c0407381a4ce585fc33': '/images/courses/boson-scholarship-test.jpeg',
  '5ac7262a07381a4ce585fc26': '/images/courses/adeptia-new-1.png',
  '5ad071ba07381a32b7f68899': '/images/courses/smith-cover.png',
  '5ad0992407381a32b7f688dc': '/images/courses/cube-course.png',
  '5ad61fab07381a32b7f68af1': '/images/courses/shreerenuka-course.png'
};

@Component({
  selector: 'pdg-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public staticContentPath: string;
  public carouselOne: NgxCarousel;
  public carouselTwo: NgxCarousel;
  availableCourses: {
    img: string;
    title: string;
    author: string;
    id: string;
    price: number;
    couponCode: string;
  }[] = tempCourse;

  availableGujcetEnglishCourses: {
    img: string;
    title: string;
    author: string;
    id: string;
    price: number;
    couponCode: string;
  }[] = tempCourseGujcetEng;

  availableGujcetGujratiCourses: {
    img: string;
    title: string;
    author: string;
    id: string;
    price: number;
    couponCode: string;
  }[] = tempCourseGujcetGuj;

  adeptiaCourses: {
    img: string;
    title: string;
    author: string;
    id: string;
    price: number;
    couponCode: string;
  }[] = adeptCourse;

  topCoursesList: {
    img: string;
    title: string;
    author: string;
    id: string;
    price: number;
    couponCode: string;
    testType?: string;
    pageNo?: string;
    hours?: string;
    quizeCount?: string;
    testCount?: string;
  }[] = topCourses;

  myCourses: { img: string; title: string; author?: string; id: string; price: number }[] = null;

  isLoggedIn = false;
  currentSlide = 0;

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
      grid: { xs: 1, sm: 2, md: 4, lg: 4, all: 0 },
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

  onmoveFn(e) {
    this.currentSlide = e.currentSlide;
  }
  openSignUp() {
    if (!this.authService.isLoggedIn()) {
      const modalRef = this.modalService.open(LoginModalComponent);
      modalRef.result.then(
        (result) => {
          location.reload();
        },
        (reason) => {
          // todo on cancel
        }
      );
    }
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
      this.adeptiaCourses = this.adeptiaCourses.filter(
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
      this.topCoursesList = this.topCoursesList.filter(
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
      this.availableGujcetGujratiCourses = this.availableGujcetGujratiCourses.filter(
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
        const courseDetail: {
          img: string;
          title: string;
          author?: string;
          id: string;
          price: number;
          testType: string;
          pageNo: string;
          hours: string;
          quizeCount: string;
          testCount: string;
        } = {
            img:
              this.staticContentPath +
              (imageMap[courseBundle.course.id] || '/images/courses/science-and-technology-old.png'),
            title: courseBundle.course.courseName,
            id: courseBundle.course.id,
            price: 0,
            testType: 'GSEB',
            author: 'Jamnadas Edu. Media',
            pageNo: '220',
            hours: '25',
            quizeCount: '5000',
            testCount: '20'
          };
        return courseDetail;
      });
      window.scrollTo(0, 0);
    });
  }
}
