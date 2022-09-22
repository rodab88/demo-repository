import {Component, TemplateRef} from '@angular/core';
import {ToastService} from './toast-service';


@Component({
  selector: 'app-toasts',
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hidden)="toastService.remove(toast)"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text>
        <div class="row">
          <div class="col-3"><img src='{{ toast.textOrTpl.image }}' style='width: 60px; height: 50px;' /></div>
          <div class="col-9"><b>{{ toast.textOrTpl.title }}</b><br>{{ toast.textOrTpl.body }}</div>
        </div>
      </ng-template>
    </ngb-toast>
  `,
  host: {'class': 'toast-container position-fixed top-0 end-0 p-3', 'style': 'z-index: 99999'}
})
export class ToastsContainer {
  constructor(public toastService: ToastService) {}
  isTemplate(toast: any) { return toast.textOrTpl instanceof TemplateRef; }
}