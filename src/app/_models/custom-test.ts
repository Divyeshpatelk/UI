import { Question, QuestionInfo } from '.';

export interface CustomTest {
  id?: string;
  testName: string;
  courses: { count?: any; mappingId: string; subjectid: string; indexid: string; sectionId?: string }[];
  created?: string;
  lastModified?: string;
  createdDate?: number;
  lastModifiedDate?: number;
  questionInfo?: QuestionInfo[];
  timeLimit?: any;
  questionLimit?: any;
  totalQuestion?: any;
  pastExam?: any;
  flag?: any;
  previousincorrect?: any;
  onceIncorrect?: any;
  showAnswer?: any;
  timeTaken?: any;
  partnerTestId?: any;
  studentTestId?: any;
  historyData?: { total: number };
  sectionHistoryData?: any;
  type?: string;
  startTime?: any;
  endTime?: any;
  duration?: number;
  sections?: Section[];
  questions?: Question[];
  status?: string;
  showResultToStudents?: any;
  messageForResultDisplay?: string;
  messageForResultDisplayDelta?: string;
}

export interface Section {
  created?: string;
  lastModified?: string;
  createdDate?: number;
  lastModifiedDate?: number;
  id?: string;
  name: string;
  right: number;
  wrong: number;
  unAnswered: number;
  testId: string;
  status?: any;
}
