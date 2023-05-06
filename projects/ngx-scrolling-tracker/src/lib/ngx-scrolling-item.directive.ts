import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { NgxScrollingTrackerService } from './ngx-scrolling-tracker.service';

@Directive({ selector: '[scrollingItem]' })
export class NgxScrollingItemDirective<T> implements OnChanges {
  @Input() stData!: T;
  private readonly index: number;
  private animationFrameRequested = false;

  @Output() isActive = new EventEmitter<boolean>();

  constructor(
    private elementRef: ElementRef,
    private scrollingTrackerService: NgxScrollingTrackerService<T>
  ) {
    this.index = this.scrollingTrackerService.addElement(
      elementRef.nativeElement,
      this.stData
    );
  }

  ngOnChanges() {
    this.scrollingTrackerService.updateElement(this.index, this.stData);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!this.animationFrameRequested) {
      this.animationFrameRequested = true;
      window.requestAnimationFrame(() => {
        this.updateActiveIndex();
        this.isActiveIndex();
        this.animationFrameRequested = false;
      });
    }
  }

  private updateActiveIndex() {
    this.scrollingTrackerService.elements$
      .pipe(take(1))
      .subscribe((elements) => {
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        let largestVisibleArea = 0;
        let activeIndex = undefined;

        elements.forEach(({ element }, i) => {
          const rect = element.getBoundingClientRect();
          const elementHeight = rect.height;
          const elementTop = rect.top + scrollTop;
          const elementBottom = elementTop + elementHeight;

          if (
            elementTop <= scrollTop + windowHeight &&
            elementBottom >= scrollTop
          ) {
            const visibleArea =
              Math.min(elementBottom, scrollTop + windowHeight) -
              Math.max(elementTop, scrollTop);
            if (visibleArea > largestVisibleArea) {
              largestVisibleArea = visibleArea;
              activeIndex = i;
            }
          }
        });

        this.scrollingTrackerService.updateActiveIndex(activeIndex);
      });
  }

  isActiveIndex() {
    this.scrollingTrackerService.activeIndex$
      .pipe(take(1))
      .subscribe((isActive) => {
        this.isActive.emit(isActive === this.index);
      });
  }
}
