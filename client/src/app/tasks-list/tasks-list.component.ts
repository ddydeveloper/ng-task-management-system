import { Component, OnInit, OnDestroy } from "@angular/core";
import { TasksApi } from "../_services/tasks.api";
import { interval } from "rxjs";
import TaskViewModel from "../_models/task.view-model";
import TaskModel from "../_models/task.model";
import { getDateDiffInSeconds, secondsToText } from "../_helpers/date.helper";
import * as moment from "moment";
import { MessageService, SelectItem, ConfirmationService } from "primeng/api";
import { ETaskStatus } from "../_enums/task-status.enum";
import { ActivatedRoute, Router } from "@angular/router";
import TaskSetModel from "../_models/task-set.model";
import { HubConnection } from "@aspnet/signalr";
import { environment } from "src/environments/environment";
import * as signalR from "@aspnet/signalr";
import { ETaskPriority } from "../_enums/task-priority.enum";
import {
  DarkedRedHex,
  DangerHex,
  WarningHex,
  SuccessHex,
  LightGrayHex,
  LightYellowHex
} from "../_constants/colors.constants";
import { getTextColor } from "../_helpers/color.helper";

@Component({
  selector: "app-tasks-list",
  templateUrl: "./tasks-list.component.html",
  styleUrls: ["./tasks-list.component.scss"]
})
export class TasksListComponent implements OnInit, OnDestroy {
  constructor(
    private taskApi: TasksApi,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  private hubConnection: HubConnection;
  pollingTasks: any;

  cols = [
    { field: "name", header: "Name", width: null, sortable: true },
    { field: "priority", header: "Priority", width: "15%", sortable: true },
    { field: "added", header: "Added", width: "15%", sortable: false },
    {
      field: "timeToComplete",
      header: "Time to complete",
      width: "20%",
      sortable: false
    }
  ];

  private sub: any;
  private initialTaskId: number;

  isInitialized = false;

  tasks: TaskViewModel[] = [];
  totalTasks: number;
  loading: boolean;
  selectedTask: TaskViewModel = null;
  modifiedTaskId: number = null;

  statuses: SelectItem[] = [
    { label: "All", value: null },
    { label: "Active", value: ETaskStatus.Active },
    { label: "Completed", value: ETaskStatus.Completed }
  ];

  selectedStatus: ETaskStatus = this.statuses[0].value;

  first = 0;
  rows = 15;
  rowsPerPageOptions = [15, 30, 100, 500, 1000];

  getPriorityStyle(priority: ETaskPriority): any {
    if (priority === ETaskPriority.Blocker) {
      return {
        "background-color": DarkedRedHex,
        color: getTextColor(DarkedRedHex)
      };
    }

    if (priority === ETaskPriority.Highest) {
      return { "background-color": DangerHex, color: getTextColor(DangerHex) };
    }

    if (priority === ETaskPriority.High) {
      return {
        "background-color": WarningHex,
        color: getTextColor(WarningHex)
      };
    }

    if (priority === ETaskPriority.Minor) {
      return {
        "background-color": LightGrayHex,
        color: getTextColor(LightGrayHex)
      };
    }

    if (priority === ETaskPriority.Medium) {
      return {
        "background-color": LightYellowHex,
        color: getTextColor(LightYellowHex)
      };
    }

    return null;
  }

  getTimeToCompleteStyle(task: TaskViewModel): any {
    if (task.status === ETaskStatus.Completed) {
      return {
        "background-color": SuccessHex,
        color: getTextColor(SuccessHex)
      };
    }

    if (task.timeToComplete < 0) {
      return { "background-color": DangerHex, color: getTextColor(DangerHex) };
    }

    if (task.timeToComplete < 60 * 60) {
      return {
        "background-color": WarningHex,
        color: getTextColor(WarningHex)
      };
    }

    return null;
  }

  refreshData(): void {
    this.first = 0;
    this.onRowUnselect();

    this.loadData();
  }

  onPageChanged(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.onRowUnselect();

    this.loadData();
  }

  onStatusChanged(): void {
    this.loadData();
  }

  openDialog(taskId: number, isDelete: boolean = true): void {
    this.modifiedTaskId = taskId;

    const msg = `Are you sure want to ${
      isDelete ? "delete" : "complete"
    } a task?`;

    this.confirmationService.confirm({
      message: msg,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.updateTaskStatus(
          isDelete ? ETaskStatus.Archived : ETaskStatus.Completed
        );
      }
    });
  }

  onRowSelect(): void {
    this.initialTaskId = this.selectedTask.id;

    const idx = this.router.url.indexOf("tasks");
    const route = this.router.url.substring(0, idx + 5);

    window.history.replaceState({}, "", `${route}/${this.selectedTask.id}`);
  }

  onRowUnselect(): void {
    this.initialTaskId = null;

    const idx = this.router.url.indexOf("tasks");
    const route = this.router.url.substring(0, idx + 5);

    window.history.replaceState({}, "", `${route}`);
  }

  updateTaskStatus(status: ETaskStatus): void {
    const updated = Object.assign(
      {},
      this.tasks.find(t => t.id === this.modifiedTaskId)
    );
    updated.status = status;
    this.taskApi.updateTask(updated).subscribe(
      () => {},
      () => {
        this.messageService.add({
          severity: "error",
          summary: "Task updating error",
          detail: "An error occured when updating task status"
        });
      }
    );
  }

  loadData(): void {
    this.loading = true;
    this.tasks = [];
    this.selectedTask = null;

    const obs =
      this.selectedStatus !== null
        ? this.taskApi.getTasksByStatus(
            this.selectedStatus,
            this.first,
            this.rows
          )
        : this.taskApi.getAllTasks(this.first, this.rows);

    obs.subscribe(
      (result: TaskSetModel) => {
        this.totalTasks = result.totalCount;
        if (this.totalTasks > 0) {
          result.tasks.forEach((t: TaskModel) => {
            this.tasks.push(new TaskViewModel(t));
          });
        }

        if (this.initialTaskId) {
          const selected = this.tasks.find(t => t.id === this.initialTaskId);
          this.selectedTask = selected ? selected : null;
        }

        this.loading = false;
      },
      () => {
        this.messageService.add({
          severity: "error",
          summary: "Task loading error",
          detail: "An error occured when loading tasks"
        });

        this.loading = false;
      }
    );
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const taskId = +params["id"];
      if (taskId) {
        this.initialTaskId = taskId;

        const obs =
          this.selectedStatus !== null
            ? this.taskApi.getTasksRowNumberByStatus(
                taskId,
                this.selectedStatus
              )
            : this.taskApi.getTasksRowNumber(taskId);

        obs.subscribe((row: number) => {
          if (!row) {
            this.onRowUnselect();
            this.initialTaskId = null;

            this.messageService.add({
              severity: "info",
              summary: "Wrong task ID in URL",
              detail: `There are no tasks with the ID = "${taskId}", the first page was loaded`
            });
          }

          if (row > this.rows) {
            const page =
              row % this.rows === 0
                ? row / this.rows - 1
                : Math.floor(row / this.rows);

            this.first = page * this.rows;
          }

          this.loadData();
          this.isInitialized = true;
        });
      } else {
        this.loadData();
        this.isInitialized = true;
      }
    });

    this.pollingTasks = interval(1000).subscribe(() => {
      const date = moment().toDate();
      this.tasks
        .filter(t => t.status !== ETaskStatus.Completed)
        .forEach((t: TaskViewModel) => {
          const diff = getDateDiffInSeconds(date, t.completed);
          t.timeToComplete = diff;
          t.timeToCompleteText = secondsToText(diff);
        });
    });

    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(`${environment.API_URL}/hubs/notifications`)
      .build();

    this.hubConnection.start();

    this.hubConnection.on("TaskCreated", (t: TaskModel) => {
      this.messageService.add({
        severity: "success",
        summary: "Task created",
        detail: `A new task "${t.name}" was created`
      });

      this.loadData();
    });

    this.hubConnection.on("TaskUpdated", (t: TaskModel) => {
      if (t.status === ETaskStatus.Archived) {
        this.messageService.add({
          severity: "success",
          summary: "Task deleted",
          detail: `A task "${t.name}" was deleted`
        });
      }

      if (t.status === ETaskStatus.Completed) {
        this.messageService.add({
          severity: "success",
          summary: "Task completed",
          detail: `A task "${t.name}" was completed`
        });
      }

      this.loadData();
    });

    this.loading = true;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.pollingTasks.unsubscribe();
    this.hubConnection.stop();
  }
}
