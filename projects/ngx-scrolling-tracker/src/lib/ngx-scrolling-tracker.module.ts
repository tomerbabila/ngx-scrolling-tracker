import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxScrollingItemDirective } from './ngx-scrolling-item.directive';
import { IOptions } from './models';
import { NgxScrollingTrackerService } from './ngx-scrolling-tracker.service';

@NgModule({
  declarations: [NgxScrollingItemDirective],
  providers: [NgxScrollingTrackerService],
  exports: [NgxScrollingItemDirective],
})
export class NgxScrollingTrackerModule {
  static forRoot(
    ops: IOptions
  ): ModuleWithProviders<NgxScrollingTrackerModule> {
    return {
      ngModule: NgxScrollingTrackerModule,
      providers: [{ provide: NgxScrollingTrackerService, useValue: ops }],
    };
  }
}
