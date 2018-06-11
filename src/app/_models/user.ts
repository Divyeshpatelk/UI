/**
 * Interface for User Information
 */
export interface User {
  accountid: string;
  firstname: string;
  lastname: string;
  email: string;
  dob: string;
  gender: string;
  countrycode?: string;
  mobilenumber?: string;
}
