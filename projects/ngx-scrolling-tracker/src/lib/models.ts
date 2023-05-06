export interface IScrollTracker<T> {
  element: HTMLElement;
  data: T;
}

export interface IOptions {
  initialIndex: number | undefined;
  parent: string;
}
