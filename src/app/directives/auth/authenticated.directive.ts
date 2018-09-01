import { Directive, ViewContainerRef, TemplateRef, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Directive({
  selector: '[authenticated]'
})
export class AuthenticatedDirective implements OnInit {

  constructor(private template: TemplateRef<any>, private container: ViewContainerRef, private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticatedOrCanRefresh()) {
      this.container.createEmbeddedView(this.template);
    } else {
      this.container.clear();
    }
  }
}
