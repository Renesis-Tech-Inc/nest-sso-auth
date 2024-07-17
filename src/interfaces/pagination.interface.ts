/**
 * Interface representing paginated data.
 *
 * This interface defines the structure of a paginated response, which includes
 * the records and pagination details.
 *
 * @interface
 * @template T - The type of the records.
 */
export interface IPagination<T> {
  /**
   * The records for the current page.
   *
   * @type {T}
   */
  records: T;

  /**
   * The pagination details.
   *
   * @type {PaginationDetail}
   */
  paginationInfo: PaginationDetail;
}

/**
 * Interface representing pagination details.
 *
 * This interface defines the structure of the pagination details, including
 * current page, total pages, total records, and records per page.
 *
 * @interface
 */
interface PaginationDetail {
  /**
   * The current page number.
   *
   * @type {number}
   */
  currentPage: number;

  /**
   * The total number of pages.
   *
   * @type {number}
   */
  pages: number;

  /**
   * The total number of records.
   *
   * @type {number}
   */
  totalRecords: number;

  /**
   * The number of records per page.
   *
   * @type {number}
   */
  perPage: number;
}
