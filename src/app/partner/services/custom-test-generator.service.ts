import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CustomTest, Section, Question, Pageable } from '../../_models';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { APIConfig } from '../../_config';

@Injectable()
export class CustomTestGeneratorService {
  constructor(private http: HttpClient) {}

  private editedSectionSbj: BehaviorSubject<Section> = null;

  createBehaviorSubjectForSection() {
    if ( this.editedSectionSbj === null ) {
      this.editedSectionSbj = new BehaviorSubject<Section>(null);
    }
    return this.editedSectionSbj;
   }

  getBehaviorSubjectForSection() {
    return this.editedSectionSbj;
  }

  unsubscribeBehaviorSubjectForSection() {
    if ( this.editedSectionSbj && this.editedSectionSbj !== null ) {
      this.editedSectionSbj.unsubscribe();
      this.editedSectionSbj = null;
    }
  }

  createTest(testConfig: CustomTest): Observable<CustomTest> {
    return this.http.post<CustomTest>(APIConfig.CUSTOM_TEST_CREATE, testConfig, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  getTests(obj: { courses: [{ mappingId: string }] }, pageable: Pageable): Observable<any> {
    const params = new HttpParams()
      .set('page', pageable.page)
      .set('size', pageable.size)
      .set('sort', pageable.sort);
    return this.http.post<any>(APIConfig.CUSTOM_TEST_LIST, obj, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params
    });
  }

  getTest(testId: string): Observable<CustomTest> {
    return this.http.get<CustomTest>(APIConfig.CUSTOM_TEST_GET_BY_ID, {
      params: new HttpParams().set('testId', testId)
    });
  }

  getSections(testId: string): Observable<Section[]> {
    return this.http.post<Section[]>(APIConfig.CUSTOM_TEST_SECTION_LIST, new HttpParams().set('testId', testId), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    });
  }

  createSection(section: Section): Observable<Section> {
    return this.http.post<Section>(APIConfig.CUSTOM_TEST_SECTION_CREATE, section, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  updateSection(section): Observable<Section> {
    return this.http.post<Section>(APIConfig.CUSTOM_TEST_SECTION_EDIT, section, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  saveTestAsDraft(questions: Question[]): Observable<Question> {
    return this.http.post(APIConfig.CUSTOM_TEST_ADD_QUESTION, questions, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  publishTest(testId): Observable<any> {
    return this.http.post(APIConfig.CUSTOM_TEST_PUBLISH, null, {
      params: new HttpParams().set('testId', testId)
    });
  }

  deleteTest(testId): Observable<any> {
    return this.http.post(APIConfig.CUSTOM_TEST_DELETE, null, {
      params: new HttpParams().set('testId', testId)
    });
  }

  saveTestTimeWindowConfig(testConfig) {
    return this.http.post(APIConfig.PARTNER_TEST_CONFIG, testConfig, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
