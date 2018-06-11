import { MappingInfo } from './library-models';

/**
 * Interface for Library Content (Video / PDF) Information
 *
 * @export
 * @interface LibraryStudyMaterial
 */
export interface LibraryStudyMaterial {
  last: boolean;
  totalPages: number;
  totalElements: number;
  sort: Array<any>;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  content: Array<StudyMaterial>;
}

export interface StudyMaterial {
  _id: string;
  type: string;
  title: string;
  description: string;
  thumbnailId?: string;
  thumbnailUrl?: string;
  courses?: Array<MappingInfo>;
  cdnUrl: string;
  status: string;
  lastModifiedDate: string;
}



