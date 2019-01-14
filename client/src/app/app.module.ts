import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TasksListComponent } from "./tasks-list/tasks-list.component";
import { TaskAddComponent } from "./task-add/task-add.component";
import { TaskViewComponent } from "./task-view/task-view.component";
import { PrimengModule } from "./_primeng.module";

@NgModule({
  declarations: [
    AppComponent,
    TasksListComponent,
    TaskAddComponent,
    TaskViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimengModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
