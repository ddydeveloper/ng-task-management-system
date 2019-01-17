import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TasksListComponent } from "./tasks-list/tasks-list.component";
import { TaskAddComponent } from "./task-add/task-add.component";

const routes: Routes = [
  { path: "", redirectTo: "tasks", pathMatch: "full" },
  { path: "tasks", component: TasksListComponent, pathMatch: "full" },
  { path: "tasks/:id", component: TasksListComponent, pathMatch: "full" },
  { path: "new/tasks", component: TaskAddComponent, pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
