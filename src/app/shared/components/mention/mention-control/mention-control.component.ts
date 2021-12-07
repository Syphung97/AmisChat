import { Component, ComponentRef, EmbeddedViewRef, OnInit, ViewChild } from '@angular/core';
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
@Component({
  selector: 'amis-mention-control',
  templateUrl: './mention-control.component.html',
  styleUrls: ['./mention-control.component.scss']
})
export class MentionControlComponent extends BasePortalOutlet {

  @ViewChild(CdkPortalOutlet) portalOutlet!: CdkPortalOutlet;

  attachComponentPortal<T>(componentPortal: ComponentPortal<any>): ComponentRef<T> {
    return this.portalOutlet.attachComponentPortal(componentPortal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    return this.portalOutlet.attachTemplatePortal(portal);
  }

}
