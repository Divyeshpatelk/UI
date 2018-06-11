import { CustomTestGeneratorService } from './../../../services/custom-test-generator.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Section, CustomTest } from '../../../../_models';

@Component({
  selector: 'pdg-section-form',
  templateUrl: './section-form.component.html',
  styleUrls: ['./section-form.component.scss']
})
export class SectionFormComponent implements OnInit, OnDestroy {
  @Input() test: CustomTest;
  editedSectionSbj: BehaviorSubject<Section> = null;
  selectedSection: Section;
  @Output() createSection: EventEmitter<Section> = new EventEmitter<any>();
  @Output() updateSection: EventEmitter<Section> = new EventEmitter<any>();
  sectionForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private customTestGeneratorService: CustomTestGeneratorService) {
    console.log('constructor called');
  }

  ngOnInit() {
    console.log('init called');
    this.editedSectionSbj = this.customTestGeneratorService.getBehaviorSubjectForSection();
    this.sectionForm = this.formBuilder.group({
      name: [ '', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      right: [ '', [Validators.required, Validators.min(-999), Validators.max(999)]],
      wrong: [ '', [Validators.required, Validators.min(-999), Validators.max(999)]],
      unAnswered: [ '', [Validators.required, Validators.min(-999), Validators.max(999)]]
    });

    this.editedSectionSbj.subscribe(
      (section: Section) => {
          console.log('subscribe called:');
          console.log(section);
        if (section == null) {
          this.selectedSection = null;
          this.sectionForm.reset();
          this.sectionForm.setValue(
            {name: '',
            right: '',
            wrong: '',
            unAnswered: ''}
          );
        } else {
          this.selectedSection = section;
          this.sectionForm.setValue(
            {name: this.selectedSection.name,
            right: this.selectedSection.right,
            wrong: this.selectedSection.wrong,
            unAnswered: this.selectedSection.unAnswered}
          );
        }
      }
    );
  }

  submitForm() {
    const section: Section = {
      name: this.sectionForm.value.name,
      right: this.sectionForm.value.right,
      wrong: this.sectionForm.value.wrong,
      unAnswered: this.sectionForm.value.unAnswered,
      testId: this.test.id
    };
    if (this.selectedSection) {
      section['id'] = this.selectedSection.id;
      this.updateSection.emit(section);
    }else {
      this.createSection.emit(section);
    }
  }

  ngOnDestroy() {
    console.log('unsubscribed');
    this.customTestGeneratorService.unsubscribeBehaviorSubjectForSection();
  }

  /*cancelSection() {
    console.log('cancel')
  }*/
}
