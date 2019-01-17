import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TasksListComponent } from "./tasks-list/tasks-list.component";
import { TaskAddComponent } from "./task-add/task-add.component";
import { PrimengModule } from "./_primeng.module";
import { TasksApi } from "./_services/tasks.api";
import { StatusPipe } from "./_pipes/status.pipe";
import { PriorityPipe } from "./_pipes/priority.pipe";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    TasksListComponent,
    TaskAddComponent,
    StatusPipe,
    PriorityPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimengModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [TasksApi],
  bootstrap: [AppComponent]
})
export class AppModule { }
