import { Component, OnInit, OnDestroy } from "@angular/core";
import TaskModel from "../_models/task.model";
import { TasksApi } from "../_services/tasks.api";
import { interval } from "rxjs/observable/interval";

@Component({
  selector: "app-tasks-list",
  templateUrl: "./tasks-list.component.html",
  styleUrls: ["./tasks-list.component.scss"]
})
export class TasksListComponent implements OnInit, OnDestroy {
  constructor(private taskApi: TasksApi) {}

  pollingTasks: any;

  tasks: TaskModel[] = [];
  selectedTask: TaskModel = null;
  msgs: any[] = [];

  ngOnInit() {
    this.msgs.push({
      severity: "warn",
      summary: "There are no tasks created",
      detail: `Go to "Add new task" to create the first one`
    });

    this.taskApi.getAllTasks(0, 200).subscribe((data: TaskModel[]) => this.tasks = data);

    this.pollingTasks = interval(1000).subscribe(() => {
      this.tasks.forEach(() => 1);
    });
  }

  ngOnDestroy() {
    this.pollingTasks.unsubscribe();
  }
}
