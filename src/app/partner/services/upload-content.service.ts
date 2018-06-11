import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject as RxSubject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';

import { APIConfig } from '../../_config';
import {
  Question,
  Course,
  Subject,
  SubjectIndex,
  ContentMetadata,
  UploadContent,
  UploadContentEvent,
  UploadEventType
} from '../../_models';
import { UploadStatus } from '../../_models/content';

/**
 * Angular service responsible for all the upload (Video / PDF / Image) related tasks.
 *
 * @export
 * @class UploadContentService
 * @version 1.0
 * @author
 */
@Injectable()
export class UploadContentService {

  /**
   * Content Upload Queue
   * @type {BehaviorSubject<UploadContent[]>}
   */
  public contentUploadQueue: BehaviorSubject<UploadContent[]>;

  /**
   * Content Upload Event Queue
   * @type {RxSubject<UploadContentEvent>}
   */
  public contentUploadEventQueue: RxSubject<UploadContentEvent>;

  /**
   * Upload Content Array
   * @private
   * @type {Array<UploadContent>}
   */
  private _queue: Array<UploadContent>;

  /**
   * Index of the item under process
   * @private
   */
  private _currentIndex = 0;

  private _isUploading = false;

  private isCancelAll = false;

  /**
   * Creates an instance of UploadContentService.
   * @param {HttpClient} http
   * @memberof UploadContentService
   */
  constructor(private http: HttpClient) {
    this._queue = [];
    this.contentUploadQueue = new BehaviorSubject<UploadContent[]>(this._queue);
    this.contentUploadEventQueue = new RxSubject<UploadContentEvent>();
  }

  /**
   * Method to add content to queue for upload
   * @param {UploadContent} uploadContent
   */
  addToContentUploadQueue(uploadContent: UploadContent) {
    uploadContent.progress = {
      status: UploadStatus.InProgress,
      data: {
        percentage: 0,
        speed: 0,
        speedHuman: '`${humanizeBytes(0)}/s`',
        startTime: null,
        endTime: null,
        eta: null,
        etaHuman: null
      }
    };
    this._queue.push(uploadContent);
    this.contentUploadQueue.next(this._queue);
    if (!this._isUploading) {
      this._uploadContentUploadQueue();
      this._isUploading = true;
    }
  }

  _uploadContentUploadQueue() {
    if (this._queue[this._currentIndex]) {

      /**
       * Check if the status of the current item in the queue is not Cancelled,
       * then proceed for uploading else start the upload of the next item in the queue
       */
      if (this._queue[this._currentIndex].progress.status !== UploadStatus.Cancelled) {
        const subscription = this.uploadContent(this._queue[this._currentIndex]).subscribe(output => {
          // TODO manage success and error appropriately
        }, err => {
        }, () => {
        });
        this._queue[this._currentIndex].subscription = subscription;

      } else {
        // Setting Cancelled event for the items whose upload is not started and cancelled.
        this.contentUploadEventQueue.next({ type: UploadEventType.CANCELLED, content: this._queue[this._currentIndex] });
        this._currentIndex++;
        this._uploadContentUploadQueue();
      }

    } else {
      this._isUploading = false;
      // this._queue = [];
      // this._currentIndex = 0;
      // this.contentUploadQueue.next(this._queue);
      this.contentUploadEventQueue.next({ type: UploadEventType.ALL_COMPLETE, content: null });
    }
  }

  uploadContent(uploadContent: UploadContent) {
    if (uploadContent.data.fileType === 'refvideo' || uploadContent.contents) {
      const body = {
        courseId: uploadContent.course.id,
        subjectId: uploadContent.subject.id,
        indexId: uploadContent.index.indexId,
        contentIds: uploadContent.contents ? uploadContent.contents : [],
        data: (!uploadContent.contents && uploadContent.data) ? [uploadContent.data] : []
      };

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.post(uploadContent.url, body, { headers }).do(() => {
        uploadContent.progress = {
          status: UploadStatus.Success,
          data: {
            percentage: 100,
            speed: 0,
            speedHuman: '${humanizeBytes(speed)}/s',
            startTime: 0,
            endTime: null,
            eta: 0,
            etaHuman: 'this.secondsToHuman(eta)'
          }
        };
        this.contentUploadEventQueue.next({ type: UploadEventType.ITEM_COMPLETE, content: uploadContent });
        this._currentIndex++;
        this._uploadContentUploadQueue();
      });

      // TODO on error implementation

    } else {
      const formData = new FormData();
      formData.append('courseId', uploadContent.course.id);
      formData.append('subjectId', uploadContent.subject.id);
      formData.append('indexId', uploadContent.index.indexId);
      if (uploadContent.file) {
        formData.append('file', uploadContent.file);
      }
      if (uploadContent.contents) {
        formData.append('contentIds', JSON.stringify(uploadContent.contents));
      }
      formData.append('data', JSON.stringify(uploadContent.data));

      return Observable.create((observer: Observer<any>) => {
        const xhr = new XMLHttpRequest();
        const time: number = new Date().getTime();
        let progressStartTime: number = (uploadContent.progress.data && uploadContent.progress.data.startTime) || time;
        let speed = 0;
        let eta: number | null = null;

        xhr.open('POST', uploadContent.url);
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('access_token')}`);
        xhr.setRequestHeader('lang', localStorage.getItem('lang') || 'en');
        xhr.upload.onprogress = (event: ProgressEvent) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded * 100) / event.total);
            const diff = new Date().getTime() - time;
            speed = Math.round(event.loaded / diff * 1000);
            progressStartTime = (uploadContent.progress.data && uploadContent.progress.data.startTime) || new Date().getTime();
            eta = Math.ceil((event.total - event.loaded) / speed);

            uploadContent.progress = {
              status: UploadStatus.InProgress,
              data: {
                percentage: percentage,
                speed: speed,
                speedHuman: '${humanizeBytes(speed)}/s',
                startTime: progressStartTime,
                endTime: null,
                eta: eta,
                etaHuman: 'this.secondsToHuman(eta)'
              }
            };

            this.contentUploadEventQueue.next({ type: UploadEventType.ITEM_INPROGRESS, content: uploadContent });
          }
        };

        xhr.onload = () => {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {

              // TODO add response to event
              const resp = JSON.parse(xhr.response);
              if (resp.responseCode === 0) {
                uploadContent.progress = {
                  status: UploadStatus.Success,
                  data: {
                    percentage: 100,
                    speed: speed,
                    speedHuman: '${humanizeBytes(speed)}/s',
                    startTime: progressStartTime,
                    endTime: null,
                    eta: eta,
                    etaHuman: 'this.secondsToHuman(eta)'
                  }
                };
                observer.next(xhr.response);
                observer.complete();
                this.contentUploadEventQueue.next({ type: UploadEventType.ITEM_COMPLETE, content: uploadContent });
              } else {
                uploadContent.progress = {
                  status: UploadStatus.Error,
                  data: {
                    percentage: 100,
                    speed: speed,
                    speedHuman: '${humanizeBytes(speed)}/s',
                    startTime: progressStartTime,
                    endTime: null,
                    eta: eta,
                    etaHuman: 'this.secondsToHuman(eta)'
                  }
                };
                observer.error(xhr.response);
                observer.complete();
                this.contentUploadEventQueue.next({ type: UploadEventType.ERROR, content: uploadContent });
              }
              this._currentIndex++;
              this._uploadContentUploadQueue();

            } else {
              uploadContent.progress = {
                status: UploadStatus.Error,
                data: {
                  percentage: 100,
                  speed: speed,
                  speedHuman: '${humanizeBytes(speed)}/s',
                  startTime: progressStartTime,
                  endTime: null,
                  eta: eta,
                  etaHuman: 'this.secondsToHuman(eta)'
                }
              };
              // TODO add response to event
              observer.error(xhr.response);
              observer.complete();
              this.contentUploadEventQueue.next({ type: UploadEventType.ERROR, content: uploadContent });
              this._currentIndex++;
              this._uploadContentUploadQueue();
            }
          }
        };

        xhr.onabort = () => {
          uploadContent.progress = {
            status: UploadStatus.Cancelled,
            data: {
              percentage: 100,
              speed: speed,
              speedHuman: '${humanizeBytes(speed)}/s',
              startTime: progressStartTime,
              endTime: null,
              eta: eta,
              etaHuman: 'this.secondsToHuman(eta)'
            }
          };
          observer.complete();
          this.contentUploadEventQueue.next({ type: UploadEventType.CANCELLED, content: uploadContent });

          if (!this.isCancelAll) {
            this._currentIndex++;
            this._uploadContentUploadQueue();
          }
        };

        xhr.onerror = () => {
          uploadContent.progress = {
            status: UploadStatus.Error,
            data: {
              percentage: 100,
              speed: speed,
              speedHuman: '${humanizeBytes(speed)}/s',
              startTime: progressStartTime,
              endTime: null,
              eta: eta,
              etaHuman: 'this.secondsToHuman(eta)'
            }
          };
          observer.error(xhr.response);
          observer.complete();
          this.contentUploadEventQueue.next({ type: UploadEventType.ERROR, content: uploadContent });
          this._currentIndex++;
          this._uploadContentUploadQueue();
        };
        xhr.send(formData);
        return () => {
          xhr.abort();
        };
      });
    }
  }

  /**
   * API to upload Course Cover Image
   *
   * @param {{ 'courseId': string, 'uniqueId': string, 'file': File }} uploadJson
   * @returns {Observable<string>}
   */
  uploadCourseCoverImage(uploadJson: { 'courseId': string, 'uniqueId': string, 'file': File }): Observable<string> {
    const uploadFormData: FormData = new FormData();
    uploadFormData.append('courseId', uploadJson.courseId);
    uploadFormData.append('uniqueId', uploadJson.uniqueId);
    uploadFormData.append('file', uploadJson.file, uploadJson.file.name);
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.post<string>(APIConfig.UPLOAD_COURSE_COVER_IMAGE, uploadFormData, { headers });
  }

  /**
   * API to upload new question
   *
   * @param {Question} question Question JSON
   * @returns {Observable<any>}
   */
  uploadQuestion(question: Question): Observable<Question> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    return this.http.post<Question>(APIConfig.UPLOAD_QUESTION, question, { headers });
  }

  uploadBulkMcq(questionList: Array<Question>): Observable<Question[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<Question[]>(APIConfig.BULK_UPLOAD_QUESTION, questionList, { headers });
  }

  isUploadingInProgress() {
    return this._isUploading;
  }

  /**
   * Method to cancel upload of the item not in upload progress
   * @param {number} index Content Index
   */
  cancelUpload(index: number) {
    if (this._queue[index].subscription === undefined) {
      this._queue[index].progress.status = UploadStatus.Cancelled;
      this._queue[index].progress.data.percentage = 100;

    } else {
      if (this._queue[index].progress.data.percentage !== 100) {
        this._queue[index].subscription.unsubscribe();
      }
    }
  }

  /**
   * Method to cancel all uploading
   *
   * @memberof UploadContentService
   */
  cancelAllUpload() {
    this.isCancelAll = true;
    if (this._isUploading) {
      this._queue.forEach((item, index) => {
        this.cancelUpload(index);
      });

      // this.clearQueue();
    }
  }

  /**
   * Method to clear the Queue
   */
  clearQueue() {
    this._isUploading = false;
    this.isCancelAll = false;
    this._queue = [];
    this._currentIndex = 0;
    this.contentUploadQueue.next(this._queue);
    this.contentUploadEventQueue.next({ type: UploadEventType.QUEUE_CLEARED, content: null });
  }
}
