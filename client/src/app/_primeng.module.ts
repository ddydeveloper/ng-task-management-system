import { NgModule } from "@angular/core";
import { TabMenuModule } from "primeng/tabmenu";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { ToastModule } from "primeng/toast";
import { MessageService, ConfirmationService } from "primeng/api";
import { PanelModule } from "primeng/panel";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FieldsetModule } from "primeng/fieldset";
import { SelectButtonModule } from "primeng/selectbutton";
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { PaginatorModule } from "primeng/paginator";
import { ConfirmDialogModule } from "primeng/confirmdialog";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    TabMenuModule,
    ButtonModule,
    TableModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    PanelModule,
    FieldsetModule,
    SelectButtonModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    InputTextareaModule,
    InputTextModule,
    PaginatorModule,
    ConfirmDialogModule
  ],
  exports: [
    BrowserAnimationsModule,
    TabMenuModule,
    ButtonModule,
    TableModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    PanelModule,
    FieldsetModule,
    SelectButtonModule,
    TooltipModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    InputTextareaModule,
    InputTextModule,
    PaginatorModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class PrimengModule {}
