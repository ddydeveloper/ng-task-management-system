import { Component, OnInit } from "@angular/core";
import TaskModel from "../_models/task.model";
import { ETaskPriority } from "../_enums/task-priority.enum";
import { ETaskStatus } from "../_enums/task-status.enum";

@Component({
  selector: "app-tasks-list",
  templateUrl: "./tasks-list.component.html",
  styleUrls: ["./tasks-list.component.scss"]
})
export class TasksListComponent implements OnInit {
  constructor() {}

  tasks: TaskModel[] = [];
  selectedTask: TaskModel = null;
  msgs: any[] = [];

  ngOnInit() {
    this.msgs.push({
      severity: "warn",
      summary: "There are no tasks created",
      detail: `Go to "Add new task" to create the first one`
    });

    for (let index = 1; index < 21; index++) {
      this.tasks.push({
        id: index,
        name: "Test task " + index,
        description: "Very long task description very very long \r\n very very long \r\n very very long \r\n very very long",
        added: new Date(),
        completed: new Date(),
        timeToComplete: index + " weeks",
        priority: ETaskPriority.Highest,
        status: ETaskStatus.Active
      });
    }
  }
}
