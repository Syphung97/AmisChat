import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { ConversationTab } from './enums/conversation-tab.enum';

@Injectable({
  providedIn: 'root'
})
export class LazyLoadService {

  constructor(
    private readonly factoryResolver: ComponentFactoryResolver
  ) { }

  async loadConversationAndUser(tab: ConversationTab): Promise<ComponentFactory<any>> {
    if (tab == ConversationTab.Conversation) {
      const module = await import("../sidebar/conversation-list/conversation-list.module");
      return this.factoryResolver.resolveComponentFactory(module.ConversationListModule.component.Component);
    }
    else {
      const module = await import("../sidebar/user-list/user-list.module");
      return this.factoryResolver.resolveComponentFactory(module.UserListModule.component.Component);
    }

  }

  async loadPopup(url: string): Promise<ComponentFactory<any>> {
    const module = await import(url);
    return this.factoryResolver.resolveComponentFactory(module)
  }
}
