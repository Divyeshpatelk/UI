import { Component, OnInit } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services';
import { MarketService } from '../market.service';
import { Course, ContentUnitCount } from '../../_models';
import { tempCourse, imageMap, tempCourseGujcetGuj } from '../home/home.component';

@Component({
  selector: 'pdg-jamnadas',
  templateUrl: './jamnadas.component.html',
  styleUrls: ['./jamnadas.component.scss']
})
export class JamnadasComponent implements OnInit {
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
  availableGujcetGujratiCourses: {
    img: string;
    title: string;
    author: string;
    id: string;
    price: number;
    couponCode: string;
  }[] = tempCourseGujcetGuj;

  isLoggedIn = false;

  constructor(public authService: AuthenticationService, private marketService: MarketService) {
    this.staticContentPath = environment.staticContentPath;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.isLoggedIn = this.authService.isLoggedIn();
    this.partnerdata = {
      img: this.staticContentPath + '/images/jamnadas-new.png',
      title: 'Jamnadas Edu Media',
      description: 'A unit of Jamnadas Publishing House'
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
          img:
            this.staticContentPath + (imageMap[courseBundle.course.id] || '/images/courses/science-and-technology-old.png'),
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
