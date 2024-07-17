/**
 * Interface representing email options for sending an email.
 *
 * This interface defines the structure of the options object used to configure
 * the details of an email, including recipients, subject, sender, and content.
 *
 * @interface
 */
export interface IEmailOptions {
  /**
   * The primary recipient of the email.
   *
   * @type {string}
   */
  to?: string;

  /**
   * The blind carbon copy (BCC) recipients of the email.
   *
   * @type {string[]}
   */
  bcc?: string[];

  /**
   * The carbon copy (CC) recipients of the email.
   *
   * @type {string[]}
   */
  cc?: string[];

  /**
   * The subject of the email.
   *
   * @type {string}
   */
  subject: string;

  /**
   * The sender of the email.
   *
   * @type {string}
   */
  from?: string;

  /**
   * The plain text content of the email.
   *
   * @type {string}
   */
  text?: string;

  /**
   * The HTML content of the email.
   *
   * @type {any}
   */
  html?: any;
}
