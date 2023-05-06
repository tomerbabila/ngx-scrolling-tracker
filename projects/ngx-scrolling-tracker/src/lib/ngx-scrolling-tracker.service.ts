import { Injectable } from '@angular/core';
import { IScrollTracker } from './models';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NgxScrollingTrackerService<T> {
  private elements: IScrollTracker<T>[] = [];
  private elementsSubject = new BehaviorSubject(this.elements);
  public elements$ = this.elementsSubject.asObservable();
  public stData$ = this.elements$.pipe(map((els) => els.map((el) => el.data)));

  private activeIndex = new BehaviorSubject<number | undefined>(0);
  public activeIndex$ = this.activeIndex.asObservable();

  addElement(element: HTMLElement, data: T) {
    this.elements.push({ element, data });
    const index = this.elements.length - 1;
    this.elementsSubject.next(this.elements);
    return index;
  }

  updateElement(index: number, data: T) {
    this.elements[index].data = data;
    this.elementsSubject.next(this.elements);
  }

  updateActiveIndex(index: number | undefined) {
    this.activeIndex.next(index);
  }
}
