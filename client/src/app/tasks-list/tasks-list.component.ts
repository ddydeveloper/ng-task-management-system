import { Component, OnInit, OnDestroy } from "@angular/core";
import { TasksApi } from "../_services/tasks.api";
import { interval, forkJoin } from "rxjs";
import TaskViewModel from "../_models/task.view-model";
import TaskModel from "../_models/task.model";
import { getDateDiffInSeconds, secondsToText } from "../_helpers/date.helper";
import * as moment from "moment";
import { LazyLoadEvent, MessageService } from "primeng/api";

@Component({
  selector: "app-tasks-list",
  templateUrl: "./tasks-list.component.html",
  styleUrls: ["./tasks-list.component.scss"]
})
export class TasksListComponent implements OnInit, OnDestroy {
  constructor(
    private taskApi: TasksApi,
    private messageService: MessageService
  ) {}

  pollingTasks: any;

  cols = [
    { field: "name", header: "Name", width: "45%" },
    { field: "priority", header: "Priority", width: "15%" },
    { field: "added", header: "Added", width: "15%" },
    { field: "timeToComplete", header: "Time to complete", width: "15%" }
  ];

  tasks: TaskViewModel[] = [];
  totalTasks: number;
  loading: boolean;
  selectedTask: TaskViewModel = null;

  loadDataOnScroll(event: LazyLoadEvent) {
    if (event.first + event.rows > this.totalTasks) {
      return;
    }

    this.loadData(event.first, event.rows);
  }

  loadData(skip: number, take: number): void {
    this.loading = true;
    this.tasks = [];

    const obs = forkJoin(
      this.taskApi.getAllTasks(skip, take),
      this.taskApi.getAllTasksCount()
    );

    obs.subscribe(
      (result: any) => {
        this.totalTasks = result[1];
        if (this.totalTasks > 0) {
          result[0].forEach((t: TaskModel) => {
            this.tasks.push(new TaskViewModel(t));
          });
        }
      },
      () =>
        this.messageService.add({
          severity: "error",
          summary: "Task loading error",
          detail: "An error occured when loading tasks"
        }),
      () => {
        this.loading = false;
      }
    );
  }

  ngOnInit() {
    this.pollingTasks = interval(1000).subscribe(() => {
      let date = moment().toDate();
      this.tasks.forEach((t: TaskViewModel) => {
        t.timeToComplete = secondsToText(
          getDateDiffInSeconds(date, t.completed)
        );
      });
    });

    this.loading = true;
  }

  ngOnDestroy() {
    this.pollingTasks.unsubscribe();
  }
}
