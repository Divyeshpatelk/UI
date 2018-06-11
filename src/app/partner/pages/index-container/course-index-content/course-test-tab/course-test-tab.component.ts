import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SubjectIndex, Subject, Course, CustomTest, Pageable } from '../../../../../_models';
import { CustomTestGeneratorService } from '../../../../services/custom-test-generator.service';
import { CustomTestEditorModalComponent } from '../../../custom-test-editor-modal/custom-test-editor-modal.component';

@Component({
  selector: 'pdg-course-test-tab',
  templateUrl: './course-test-tab.component.html',
  styleUrls: ['./course-test-tab.component.scss']
})
export class CourseTestTabComponent implements OnInit {
  @Input() course: Course;
  @Input() subject: Subject;
  @Input() index: SubjectIndex;

  currentPage = 0;
  totalRecords = 0;
  recordPerPage = 20;

  customTests: CustomTest[];

  constructor(private modalService: NgbModal, private customTestGenerator: CustomTestGeneratorService) {}

  ngOnInit() {}

  // loadTestsLazy(event: LazyLoadEvent) {
  loadTestsLazy(event) {
    this.currentPage = event.first / this.recordPerPage;
    this.getTests();
  }

  getTests() {
    const obj: { courses: [{ mappingId: string }] } = {
      courses: [
        {
          mappingId: this.course.id
        }
      ]
    };
    const pageable: Pageable = {
      page: `${this.currentPage}`,
      size: `${this.recordPerPage}`,
      sort: 'lastModifiedDate,DESC'
    };
    this.customTestGenerator.getTests(obj, pageable).subscribe((response) => {
      this.totalRecords = response.totalElements;
      this.customTests = response.content;
    });
  }

  openCustomTestEditor(testId: string) {
    const modalRef = this.modalService.open(CustomTestEditorModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.courseId = this.course.id;
    modalRef.componentInstance.subjectId = this.subject.id;
    modalRef.componentInstance.indexId = this.index.indexId;
    if (testId) {
      modalRef.componentInstance.testId = testId;
    }
    modalRef.result.then((onfulfilled) => this.getTests(), (onrejected) => this.getTests());
  }

  removeCustomTest(testId) {
    this.customTestGenerator.deleteTest(testId).subscribe(
      (success) => {
        this.getTests();
      },
      (error) => {},
      () => {}
    );
  }
}
