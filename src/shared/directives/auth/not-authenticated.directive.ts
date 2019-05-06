import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/core/services/auth.service';

@Directive({
  selector: '[notAuthenticated]'
})
export class NotAuthenticatedDirective {

  constructor(private template: TemplateRef<any>, private container: ViewContainerRef, private authService: AuthService) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticatedOrCanRefresh()) {
      this.container.createEmbeddedView(this.template);
    } else {
      this.container.clear();
    }
  }

}
