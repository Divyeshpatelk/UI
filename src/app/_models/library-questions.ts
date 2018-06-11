import { MappingInfo } from './library-models';

/**
 * Interface for Library Content Questions Information
 *
 * @export
 * @interface LibraryQuestion
 */
export interface LibraryQuestion {
  last: boolean;
  totalPages: number;
  totalElements: number;
  sort: Array<any>;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  content: Array<Question>;
}

export interface Question {
  id?: string;
  type?: string;
  question?: string;
  questionDelta?: string;
  choices?: Array<any>;
  rightAnswers?: Array<number>;
  hint?: string;
  explanation?: string;
  explanationDelta?: string;
  difficultyLevel?: number;
  courses?: Array<any>;
  subjects?: Array<string>;
  status?: string;
  lastModifiedDate?: string;
  pastExams?: Array<string>;
  errorMessage?: string;
  updated?: boolean;
  sourceName?: string;
  purpose?: string;
  testId?: string;
  created?: string;
  createdDate?: any;
  deleted?: any;
  deletedOn?: any;
  lastModified?: any;
}
