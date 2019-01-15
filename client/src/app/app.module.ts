import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http"; 
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TasksListComponent } from "./tasks-list/tasks-list.component";
import { TaskAddComponent } from "./task-add/task-add.component";
import { PrimengModule } from "./_primeng.module";
import { TasksApi } from "./_services/tasks.api";

@NgModule({
  declarations: [
    AppComponent,
    TasksListComponent,
    TaskAddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimengModule,
    HttpClientModule
  ],
  providers: [TasksApi],
  bootstrap: [AppComponent]
})
export class AppModule { }
