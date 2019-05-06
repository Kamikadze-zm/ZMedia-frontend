import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { AuthService } from 'src/core/services/auth.service';

@Directive({
  selector: '[authorized]'
})
export class AuthorizedDirective {

  private _role: string;
  private _userName: string;
  private _and: boolean = false;
  private _or: boolean = false;

  constructor(private template: TemplateRef<any>, private container: ViewContainerRef, private authService: AuthService) { }

  @Input() set authorized(role: string) {
    this._role = role;
    this.updateView();
  }

  @Input()
  set authorizedAndName(userName: string) {
    this._userName = userName;
    this._and = true;
    this._or = false;
    this.updateView();
  }

  @Input()
  set authorizedOrName(userName: string) {
    this._userName = userName;
    this._or = true;
    this._and = false;
    this.updateView();
  }

  private updateView(): void {
    this.container.clear();
    if (this.isAuthorized()) {
      this.container.createEmbeddedView(this.template);
    }
  }

  private isAuthorized(): boolean {
    //console.log("role: " + this._role + ", name: " + this._userName + ", _and: " + this._and + ", _or: " + this._or);
    if (!this.authService.isAuthenticatedOrCanRefresh()) {
      return false;
    }
    const hasRole: boolean = this.authService.hasStringRole(this._role);
    if (!this._userName) {
      return hasRole;
    }
    const equalUsers: boolean = this._userName === this.authService.user.name;
    if (this._and) {
      return hasRole && equalUsers;
    }
    if (this._or) {
      return hasRole || equalUsers;
    }
    return false;
  }
}
