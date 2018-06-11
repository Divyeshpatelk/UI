/**
 * An interface for Course Json
 */
export interface Course {
  id: string;
  courseCode: string;
  coverImage?: CoverImage;
  courseName: string;
  description?: string;
  parentInstitute?: string;
  parentInstituteUrl?: string;
  subscriptionPlans?: string;
  status?: string;              // TODO implement enum for this
  subjects?: string[];     // TODO subject instead of string?
  courseConfig?: any;
  objectives?: string;
  studyEnable?: boolean;
  testEnable?: boolean;
  practiceEnable?: boolean;
  visibility?: string;
  contentPackIds?: Array<string>;    // TODO contentpackid instead of string?
  pages?: StaticPage[];
}

/**
 * An interface for Content Unit Count Json
 */
export interface ContentUnitCount {
  videos: number;
  books: number;
  questions: number;
  references: number;
}

/**
 * Interface for Static Html Pages json
 */
export interface StaticPage {
  title: string;
  content: string;
  order: number;
}

/**
 * Interface for CoverImage Json
 */
export interface CoverImage {
  url: string;
  imageId: string;
  status: string;
}

export interface CourseBasicInfo {
  id: string;
  courseName: string;
  status?: string;
}
