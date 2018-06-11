import { Question } from './library-questions';

export interface PracticeTestData {
  id: string;
  courses: Array<QuestionMappingInfo>;
  questionInfo: Array<QuestionInfo>;
  timeLimit?: number;
  questionLimit?: number;
  totalQuestion?: number;
  pastExam?: boolean;
  flag?: boolean;
  previousincorrect?: boolean;
  questions: Array<Question>;
  sections?: any;
}

export interface QuestionInfo {
  questionId?: string;
  courses?: Array<QuestionMappingInfo>;
  rightAnswers?: Array<number>;
  userAnswers?: Array<number>;
  flag?: boolean;
  lastAnswer?: any;
  timeTaken?: any;
}

export interface QuestionMappingInfo {
  mappingId: string;
  mappingName?: string;
  subjectid: string;
  indexid: string;
  sectionId?: string;
}

export interface QuestionFlagMessage {
  questionFlags: QuestionFlagsData[];
  currentSection?: any;
  sectionChangeFlag?: boolean;
}

export interface QuestionFlagsData {
  index?: number;
  markedReview?: boolean;
  unattended?: boolean;
  skipped?: boolean;
  correct?: boolean;
  incorrect?: boolean;
  attended?: boolean;
  validated?: boolean;
}

export interface CustomTestQuestionFlagsData {
  index?: number;
  qId?: string;
  sectionId?: string;
  answered?: boolean;
  unAnswered?: boolean;
  markedReview?: boolean;
  unVisited?: boolean;
  correct?: boolean;
  incorrect?: boolean;
  validated?: boolean;
}

export interface QuestionBundle {
  question?: Question;
  questionInfo?: QuestionInfo;
  questionFlagData?: QuestionFlagsData;
  customTestQuestionFlagsData?: CustomTestQuestionFlagsData;
  localIndex?: number;
}

export enum PracticeTestStatus {
  RUNNING = 'RUNNING',
  FINISH = 'FINISH'
}
