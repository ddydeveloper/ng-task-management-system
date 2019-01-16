import { Component, OnInit, OnDestroy } from "@angular/core";
import { TasksApi } from "../_services/tasks.api";
import { interval } from "rxjs";
import TaskViewModel from "../_models/task.view-model";
import TaskModel from "../_models/task.model";
import { getDateDiffInSeconds, secondsToText } from "../_helpers/date.helper";
import * as moment from "moment";

@Component({
  selector: "app-tasks-list",
  templateUrl: "./tasks-list.component.html",
  styleUrls: ["./tasks-list.component.scss"]
})
export class TasksListComponent implements OnInit, OnDestroy {
  constructor(private taskApi: TasksApi) {}

  pollingTasks: any;

  cols = [
    { field: "name", header: "Name", width: "45%" },
    { field: "priority", header: "Priority", width: "15%" },
    { field: "added", header: "Added", width: "15%" },
    { field: "timeToComplete", header: "Time to complete", width: "15%" }
  ];

  tasks: TaskViewModel[] = [];
  selectedTask: TaskViewModel = null;
  msgs: any[] = [];

  ngOnInit() {
    this.msgs.push({
      severity: "warn",
      summary: "There are no tasks created",
      detail: `Go to "Add new task" to create the first one`
    });

    this.taskApi.getAllTasks(0, 200).subscribe((data: TaskModel[]) => {
      data.forEach((t: TaskModel) => {
        this.tasks.push(new TaskViewModel(t));
      });
    });

    this.pollingTasks = interval(1000).subscribe(() => {
      let date = moment().toDate();
      this.tasks.forEach((t: TaskViewModel) => {
        t.timeToComplete = secondsToText(getDateDiffInSeconds(date, t.completed));
      });
    });
  }

  ngOnDestroy() {
    this.pollingTasks.unsubscribe();
  }
}
