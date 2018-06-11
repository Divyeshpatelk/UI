export interface Page {
  size?: number;
  totalElements?: number;
  totalPages?: number;
  number?: number;
}

export interface Sort {
  sortOn?: string;
  order?: string;
}

export interface SearchFilterData {
  title?: string;
  type?: string;
  courses?: Array<any>;
  status?: string;
}

export interface QuesSearchFilterData {
  question?: string;
  type?: string;
  courses?: Array<any>;
  status?: string;
}

export interface FilterConfig {
  name?: string;
  value?: string;
  selected?: boolean;
}

/**
 * Interface for Mapping Info in Study Material
 *
 * @export
 * @interface MappingInfo
 */
export interface MappingInfo {
  mappingId: string;
  mappingName?: string;
  subjectId: string;
  indexId: string;
}
