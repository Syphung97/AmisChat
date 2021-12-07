/**
 * Configuration for opening a popover with the Popover service.
 */
 export interface MentionControlConfig<T = any> {
    backdropClass: string;
    data?: T;
    disableClose: boolean;
    panelClass: string | string[];
    arrowOffset?: number;
    arrowSize?: number;
  }