import { environment } from '../../../../environments/environment';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Course, Subject } from '../../../_models';
import { CourseManagerService, UploadContentService } from '../../services';
import { ImageEditComponent } from '../../shared/components';
import { ConfirmModalConfig } from '../../../shared/directives/confirm.directive';
import { ConfirmComponent } from '../../../shared/components';

/**
 * Component class for Publish Course Screen
 *
 * @export
 * @class PublishCourseComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-publish-course',
  templateUrl: './publish-course.component.html',
  styleUrls: ['./publish-course.component.scss']
})
export class PublishCourseComponent implements OnInit {
  public staticContentPath: string;

  /**
   * Object of the Course to be published
   * @type {Course}
   */
  course: { course: Course; subjects: Subject[] };

  /**
   * Unique ID of the course passed to publish component
   * @type {string}
   */
  courseId: string;

  /**
   * Variable for Course Name Inline Editor Field
   * @type {string}
   */
  courseName: string;

  /**
   * Variable for Course Description Inline Editor Field
   * @type {string}
   */
  courseDescription: string;

  /**
   * Variable for Course Objectives
   * @type {string}
   */
  courseObjectives: string;

  /**
   * Variable to hold accepted file formats for Cover image upload
   * @type {string}
   */
  acceptedFileFormats = 'image/png,image/gif,image/jpeg';

  /**
   * Variable to hold Cover Image URL
   * @type {string}
   */
  imageSrc = '';

  /**
   * Boolean for course name error
   */
  courseNameError = false;

  /**
   * Boolean for Course Description error
   */
  courseDescError = false;

  /**
   * Boolean for Course Objectives Error
   */
  courseObjError = false;

  /**
   * Course status Whether editing allowed or not
   * @type {boolean}
   */
  isEditable: boolean;

  imageUploaded = false;

  testEnable = false;

  studyEnable = false;

  practiceEnable = false;

  visibility = '';

  /**
   * Creates an instance of PublishCourseComponent.
   * @param {ActivatedRoute} activatedRoute
   * @param {CourseManagerService} courseManager
   * @param {NgbModal} modalService
   * @param {NotificationsService} notifyService
   * @param {Router} router
   * @param {UploadContentService} uploadContentService
   * @param {TranslateService} translateService
   * @param {NgbActiveModal} activeModal
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private courseManager: CourseManagerService,
    private modalService: NgbModal,
    private notifyService: NotificationsService,
    private router: Router,
    private uploadContentService: UploadContentService,
    private translator: TranslateService
  ) {
    this.courseObjectives = '';
    this.staticContentPath = environment.staticContentPath;
    this.imageSrc = `${this.staticContentPath}/images/simple-image.png`;
  }

  /**
   * Overridden method invoked when component is loaded.
   */
  ngOnInit() {
    // Getting course id from the component route
    this.activatedRoute.parent.params.subscribe((params) => {
      this.courseId = params['id'];
    });

    // Getting the Course Details
    this.courseManager.getCourseDetails(this.courseId).subscribe(
      (courseDetail: { course: Course; subjects: Subject[] }) => {
        this.course = courseDetail;
        this.courseName = this.course.course.courseName;
        this.courseDescription = this.course.course.description;
        this.isEditable = this.course.course.status === 'DRAFT' ? true : false;
        this.testEnable = this.course.course.testEnable;
        this.practiceEnable = this.course.course.practiceEnable;
        this.studyEnable = this.course.course.studyEnable;
        this.visibility = this.course.course.visibility ? this.course.course.visibility : 'ALL';
        if (this.course.course.objectives != null) {
          this.courseObjectives = this.course.course.objectives;
        }

        if (this.course.course.coverImage !== null) {
          this.imageSrc = this.course.course.coverImage.url;
        }
      },
      (error: HttpErrorResponse) => {
        // TODO: Handle Error Scenario in getting data
      }
    );
  }

  /**
   * Method invoked on Course Title Update
   * @param {string} title Course Title / Name
   */
  saveCourseName(title: string) {
    this.courseNameError = false;
    this.courseName = title;

    const updateJson = {
      id: this.courseId,
      courseName: title
    };

    this.updateCourseDetail(updateJson, 'Name');
  }

  /**
   * Method invoked on Course Description Update
   * @param {string} description Course Descirption
   */
  saveCourseDescription(description: string) {
    this.courseDescError = false;
    this.courseDescription = description;

    const updateJson = {
      id: this.courseId,
      description: this.courseDescription
    };

    this.updateCourseDetail(updateJson, 'Description');
  }

  /**
   * Method invoked on Course Objective Update
   *
   * @memberof PublishCourseComponent
   */
  saveCourseObjectives(objectives: string) {
    this.courseObjError = false;
    this.courseObjectives = objectives;

    const updateJson = {
      id: this.courseId,
      objectives: this.courseObjectives
    };
    this.updateCourseDetail(updateJson, 'Objectives');
  }

  /**
   * Private method for Course Detail Update
   * @param {*} updateJson
   * @param {string} detailName
   */
  updateCourseDetail(updateJson: any, detailName: string) {
    this.courseManager.updateCourseDetail(updateJson).subscribe(
      (response) => {
        this.notifyService.success(`Update Course ${detailName} Successful`);
      },
      (error: HttpErrorResponse) => {
        this.notifyService.error(`Update Course ${detailName} Failed`, '', {
          clickToClose: false
        });
      }
    );
  }

  /**
   * Callback method invoked when User uploads any image.
   * Image Editor Modal will be shown with the selected image.
   *
   * @param {any} imageData Image Data
   */
  showImageEditor(imageData) {
    const modalRef = this.modalService.open(ImageEditComponent);
    modalRef.componentInstance.file = imageData.nativeFile;
    modalRef.componentInstance.width = 300;
    modalRef.componentInstance.height = 164;

    modalRef.result.then((result) => {
      if (result !== '') {
        this.saveCoverImage(result.file);
      }
    });
  }

  /**
   * This method invokes upload service to upload cover image file.
   * @param {File} file Image file
   */
  saveCoverImage(file: File) {
    const uploadJson = {
      courseId: this.course.course.id,
      file: file,
      uniqueId: new Date().getTime() + '_' + file.name
    };

    this.uploadContentService.uploadCourseCoverImage(uploadJson).subscribe(
      (response) => {
        this.imageSrc = response;
        this.imageUploaded = true;
        this.notifyService.success(this.translator.instant('COVER_IMAGE_UPLOAD_SUCCESS'));
      },
      (error: HttpErrorResponse) => {
        this.notifyService.error(this.translator.instant('COVER_IMAGE_UPLOAD_FAILED'), '', {
          clickToClose: false
        });
      }
    );
  }

  /**
   * When user clicks on publish button, this method is invoked.
   * It checks for content uploading progress.
   * If uploading is in progress, it shows a confirm dialog.
   * If user clicks on "YES" in confirm dialog, progress is cancelled,
   * and user is allowed to publish the course.
   */
  checkProgressUpload() {
    if (this.uploadContentService.isUploadingInProgress()) {
      const modalRef = this.modalService.open(ConfirmComponent);
      modalRef.componentInstance.title = this.translator.instant('ARE_YOU_SURE');
      modalRef.componentInstance.text = this.translator.instant('UPLOAD_CANCEL_CONFIRM_TEXT');
      modalRef.componentInstance.confirmButtonText = this.translator.instant('YES');
      modalRef.componentInstance.cancelButtonText = this.translator.instant('NO');

      modalRef.result.then(
        (result) => {
          if (result) {
            this.uploadContentService.cancelAllUpload();
            this.uploadContentService.clearQueue();
            this.validateBeforePublish();
          }
        },
        (close) => {
          //
        }
      );
    } else {
      this.validateBeforePublish();
    }
  }

  validateBeforePublish() {
    if (this.courseDescription === null || this.courseDescription.trim() === '') {
      this.courseDescError = true;
    }

    if (this.courseObjectives === null || this.courseObjectives.trim() === '') {
      this.courseObjError = true;
    }

    if (this.courseNameError || this.courseDescError || this.courseObjError) {
      this.notifyService.error(
        this.translator.instant('PUBLISH_COURSE'),
        this.translator.instant('MANDATORY_FIELDS_BLANK_ERROR'),
        {
          clickToClose: false
        }
      );
    } else {
      const publishConfirm = this.modalService.open(ConfirmComponent);
      publishConfirm.componentInstance.title = this.translator.instant('PUBLISH_COURSE');
      publishConfirm.componentInstance.text = this.translator.instant('PUBLISH_COURSE_CONFIRM_TEXT');
      publishConfirm.componentInstance.confirmButtonText = this.translator.instant('YES');
      publishConfirm.componentInstance.cancelButtonText = this.translator.instant('NO');

      publishConfirm.result.then(
        (publishConfirmResult) => {
          this.publishCourse();
        },
        (close) => {
          // Need to add to avoid exception due to escape key press
        }
      );
    }
  }

  /**
   * Method invoked on Publish Button Click
   */
  publishCourse() {
    this.courseManager.publishCourse(this.course.course.id).subscribe(
      (response) => {
        this.notifyService.success(this.translator.instant('PUBLISH_COURSE_SUCCESS'));
        this.router.navigate(['/partner']);
      },
      (error: HttpErrorResponse) => {
        this.notifyService.error(this.translator.instant('ERROR1'), error.error.responseMessage, {
          clickToClose: false
        });
      }
    );
  }

  /**
   * Callback method invoked on inline editor error for Course Name / Description
   * @param {string} fieldName
   */
  handleError(event) {
    this.notifyService.error(event, '', {
      clickToClose: false
    });
  }

  onImageUpload() {
    if (this.imageUploaded) {
      this.imageUploaded = false;
    }
  }

  saveStudentDisplayOptions(configForm) {
    const courseConfig = {};
    courseConfig['id'] = this.courseId;
    courseConfig['practiceEnable'] =
      configForm.value.practiceEnable && configForm.value.practiceEnable === true ? true : false;
    courseConfig['studyEnable'] = configForm.value.studyEnable && configForm.value.studyEnable === true ? true : false;
    courseConfig['testEnable'] = configForm.value.testEnable && configForm.value.testEnable === true ? true : false;
    courseConfig['visibility'] = configForm.value.visibility;
    this.courseManager.updateCourseConfig(courseConfig).subscribe(
      (response) => {
        this.notifyService.success(this.translator.instant('COURSE_CONFIG_SUCCESS'));
      },
      (error: HttpErrorResponse) => {
        this.notifyService.error(this.translator.instant('ERROR1'), error.error.responseMessage, {
          clickToClose: false
        });
      }
    );
  }
}
