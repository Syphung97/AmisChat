import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LazyLoadService {


  constructor(
    private readonly factoryResolver: ComponentFactoryResolver
  ) { }


  async loadHeaderConversation(isNewConver: boolean): Promise<ComponentFactory<any>> {
    if (isNewConver) {
      const module = await import("../conversation-select-user/conversation-select-user.module");
      return this.factoryResolver.resolveComponentFactory(module.ConversationSelectUserModule.component.Component);
    }
    else {
      const module = await import("../conversation-header/conversation-header.module");
      return this.factoryResolver.resolveComponentFactory(module.ConversationHeaderModule.component.Component);
    }

  }


}
