import { Component, OnInit } from "@angular/core";
import TaskModel from "../_models/task.model";
import { TasksApi } from "../_services/tasks.api";

@Component({
  selector: "app-tasks-list",
  templateUrl: "./tasks-list.component.html",
  styleUrls: ["./tasks-list.component.scss"]
})
export class TasksListComponent implements OnInit {
  constructor(private taskApi: TasksApi) {}

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
  }
}
