import { ContentUnitCount } from './course';

export interface Subject {
  id: string;            // TODO what is the type?
  subjectName: string;
  description: string;
  indexes?: SubjectIndex[];    // TODO type?
  contentUnitCount?: ContentUnitCount;     // TODO separate type?
  subjectConfig?: any;     // TODO type?
  status?: string;        // TODO implement enum
}

export interface SubjectIndex {
  indexId: string;
  indexLevel: string;
  parentId: string;
  title: string;
  contentUnits?: any;
  contentUnitCount?: ContentUnitCount;
  children?: SubjectIndex[];
}
