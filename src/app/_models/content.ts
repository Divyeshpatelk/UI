import { Course } from './course';
import { Subject, SubjectIndex } from './subject';

import { Subscription } from 'rxjs/Subscription';

export interface Content {
  id?: string;
  title: string;
  description: string;
  type: string;
  thumbnailUrl?: string;
  courses?: [{}];
  subjects?: Subject[];
  cdnUrl?: string;
  size?: number;
  duration?: number;
  status?: number;
  contentPackIds?: Array<string>;
  isSliced?: boolean;
  deleted?: boolean;
  createdDate?: number;
}

export enum UploadStatus {
  Error = 'Failed',
  InProgress = 'Uploading',
  Success = 'Completed',
  Cancelled = 'Cancelled'
}

export interface UploadContent {
  url: string;
  course: Course;
  subject: Subject;
  index: SubjectIndex;
  file?: File;
  contents?: string[];
  data: ContentMetadata;
  subscription?: Subscription;
  progress?: {
    status: UploadStatus;
    data?: {
      percentage: number;
      speed: number;
      speedHuman: string;
      startTime: number | null;
      endTime: number | null;
      eta: number | null;
      etaHuman: string;
    }
  };
}

export interface PreviewContent {
  file?: File;
  data: ContentMetadata;
  contents?: string[];
}

export interface ContentMetadata {
  fileName?: string;
  fileType?: string;
  description?: string;
  title: string;
  duration?: number;
  thumbnailUrl?: string;
}

export enum UploadEventType {
  ITEM_INPROGRESS,
  ITEM_COMPLETE,
  ALL_COMPLETE,
  ERROR,
  CANCELLED,
  CANCELLED_ALL,
  QUEUE_CLEARED
}

export interface UploadContentEvent {
  type: UploadEventType;
  content: UploadContent;
  response?: {
    status: number;
    response: JSON;
  };
}
