/**
 * this file contains all the API Url's
 */

// Const JSON to hold all the API Url's
export const APIConfig = {
  GET_PID: '/api/authserver/account/getIdBySubdomain',

  // Auth Vertical API's - 8888
  LOGIN: '/api/authserver/oauth/token',
  LOGOUT: '/api/authserver/auth/token/revoke',
  FORGOT_PASSWORD: '/api/authserver/account/forgotPassword',
  RESET_PASSWORD: '/api/authserver/account/setPassword',
  VALIDATE_TOKEN: '/api/authserver/account/validateToken',
  CREATE_ACCOUNT: '/api/authserver/account/create',
  ACC_VALIDATE_URL: '/api/authserver/account/validate',
  SOCIAL_LOGIN: '/api/authserver/account/socialmedia/login',
  CHANGE_PASSWORD: '/api/authserver/account/changePassword',

  // Common Vertical API's
  GET_OFFERED_COURSES: '/api/common/courseTemplate/findAll',

  // Partner Vertical API's
  GET_STUDY_MATERIAL: '/api/partner/library/studymaterial',
  DELETE_STUDY_MATERIAL: '/api/partner/library/studymaterial/delete',
  UPDATE_STUDY_MATERIAL: '/api/partner/library/studymaterial/update',

  GET_QUESTIONS: '/api/partner/question/getAll',
  UPLOAD_QUESTION: '/api/partner/question/upload',
  BULK_UPLOAD_QUESTION: '/api/partner/question/bulkUpload',
  DELETE_QUESTION: '/api/partner/question/',
  UPDATE_QUESTION: '/api/partner/question/update',
  DELETE_CONTENT_MAPPING: '/api/partner/course/deleteMapping',

  GET_MY_COURSES: '/api/partner/course/getMyCourse',
  CREATE_COURSE: '/api/partner/course/create',
  DELETE_COURSE: '/api/partner/course/delete',
  COURSE_LIST: '/api/partner/course/getList',
  GET_COURSE_DETAILS: '/api/partner/course/getCourseByid',
  GET_CONTENT_DETAILS: '/api/partner/course/getContentDetails',
  UPLOAD_COURSE_CONTENT: '/api/partner/content/upload/newfiles',
  REFERENCE_COURSE_CONTENT: '/api/partner/content/upload/existingfiles',
  UPDATE_COURSE_DETAIL: '/api/partner/course/update',
  PUBLISH_COURSE: '/api/partner/course/publish',
  UPLOAD_COURSE_COVER_IMAGE: '/api/partner/content/upload/course/image',
  GET_CONTENT_URL: '/api/partner/content/url',
  PRACTICE_TEST_GENERATE: '/api/partner/practiceTest/generate',
  PRACTICE_TEST_SAVE: '/api/partner/practiceTest/save',
  CUSTOM_TEST_CREATE: '/api/partner/sectionTest/generate',
  CUSTOM_TEST_LIST: '/api/partner/sectionTest/getPartnerSectionTestHistory',
  CUSTOM_TEST_GET_BY_ID: '/api/partner/sectionTest/getTestById',
  CUSTOM_TEST_SECTION_CREATE: '/api/partner/sectionTest/section/create',
  CUSTOM_TEST_SECTION_EDIT: '/api/partner/sectionTest/section/edit',
  CUSTOM_TEST_SECTION_LIST: '/api/partner/sectionTest/section/list',
  CUSTOM_TEST_ADD_QUESTION: '/api/partner/question/bulkUpload',
  CUSTOM_TEST_PUBLISH: '/api/partner/sectionTest/publish',
  CUSTOM_TEST_DELETE: '/api/partner/sectionTest/delete',

  // Student Vertical APIs
  STUDENT_GET_MY_COURSES: '/api/student/course/getStudentMyCourse',
  STUDENT_COUPON_REDEMPTION: '/api/common/promotion/apply', // This is moved to common vertical
  STUDENT_GET_COURSE_DETAILS: '/api/student/course',
  STUDENT_GET_CONTENT_DETAILS: '/api/student/course/getIndexContents',
  STUDENT_GET_CONTENT_URL: '/api/student/contentunit/url',

  STUDENT_PRACTICE_TEST_HISTORY: '/api/partner/practiceTest/getTestHistory',
  STUDENT_PRACTICE_TEST_DETAIL: '/api/partner/practiceTest/getTestById',
  STUDENT_CUSTOM_TEST_HISTORY: '/api/partner/sectionTest/getStudentSectionTestHistory',
  STUDENT_TAKE_CUSTOM_TEST: '/api/partner/sectionTest/takeSectionTest',

  PARNTER_COURSE_CONFIG_UPDATE: '/api/partner/course/config/update',
  PARTNER_TEST_CONFIG: '/api/partner/sectionTest/update',

  // Payment APIs
  PAYMENT_CREATE_ORDER: '/api/common/transaction/createOrder',
  PAYMENT_PAY_ORDER: '/api/common/transaction/payOrder'
};
