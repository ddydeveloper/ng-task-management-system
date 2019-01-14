import { NgModule } from "@angular/core";
import { TabMenuModule } from "primeng/tabmenu";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { PanelModule } from "primeng/panel";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    TabMenuModule,
    ButtonModule,
    TableModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    PanelModule
  ],
  exports: [
    BrowserAnimationsModule,
    TabMenuModule,
    ButtonModule,
    TableModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    PanelModule
  ],
  providers: [MessageService]
})
export class PrimengModule {}
