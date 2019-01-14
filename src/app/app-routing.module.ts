import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TasksListComponent } from "./tasks-list/tasks-list.component";
import { TaskViewComponent } from "./task-view/task-view.component";
import { TaskAddComponent } from "./task-add/task-add.component";

const routes: Routes = [
  { path: "", redirectTo: "tasks", pathMatch: "full" },
  { path: "tasks", component: TasksListComponent, pathMatch: "full" },
  { path: "tasks/new", component: TaskAddComponent, pathMatch: "full" },
  { path: "tasks/:id", component: TaskViewComponent, pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
