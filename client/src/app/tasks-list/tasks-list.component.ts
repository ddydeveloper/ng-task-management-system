import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from "@angular/core";
import { TasksApi } from "../_services/tasks.api";
import { interval, Observable, fromEvent } from "rxjs";
import { map, debounceTime, switchMap } from "rxjs/operators";
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
  @ViewChild("pageInput") pageInput: ElementRef;

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
      field: "completed",
      header: "Date to complete",
      width: "15%",
      sortable: true
    },
    {
      field: "timeToComplete",
      header: "Time to complete",
      width: "15%",
      sortable: false
    }
  ];

  private sub: any;
  private initialTaskId: number = null;
  private modifiedTaskId: number = null;

  isInitialized = false;
  isFirstPageLoading = true;

  tasks: TaskViewModel[] = [];
  totalTasks: number;
  loading: boolean;
  selectedTask: TaskViewModel = null;

  statuses: SelectItem[] = [
    { label: "All", value: null },
    { label: "Active", value: ETaskStatus.Active },
    { label: "Completed", value: ETaskStatus.Completed }
  ];

  selectedStatus: ETaskStatus = this.statuses[0].value;

  first = 0;
  rows = 15;
  page = 1;
  orderBy: string = null;
  isDesc = false;

  rowsPerPageOptions = [10, 15, 30, 100, 500, 1000];

  setPage(): void {
    this.first = (this.page - 1) * this.rows;
    this.loadData();
  }

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

    if (task.timeToComplete <= 0) {
      return { "background-color": DangerHex, color: getTextColor(DangerHex) };
    }

    if (task.timeToComplete < 60 * 60 * 4) {
      return {
        "background-color": WarningHex,
        color: getTextColor(WarningHex)
      };
    }

    if (task.timeToComplete < 60 * 60 * 24) {
      return {
        "background-color": LightYellowHex,
        color: getTextColor(LightYellowHex)
      };
    }

    return null;
  }

  refreshData(): void {
    this.first = 0;
    this.rows = 15;
    this.page = 1;
    this.orderBy = null;
    this.isDesc = false;

    this.onRowUnselect();
    this.loadData();
  }

  onPageChanged(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.orderBy = event.sortField;
    this.isDesc = event.sortOrder === -1 ? true : false;
    this.page = this.first / this.rows + 1;

    if (!this.isFirstPageLoading) {
      this.onRowUnselect();
    } else {
      this.isFirstPageLoading = false;
    }

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

  private updateTaskStatus(status: ETaskStatus): void {
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

  private loadData(): void {
    this.loadDataObs().subscribe();
  }

  private loadDataObs(): Observable<void> {
    this.loading = true;
    this.tasks = [];
    this.selectedTask = null;

    const obs =
      this.selectedStatus !== null
        ? this.taskApi.getTasksByStatus(
            this.selectedStatus,
            this.first,
            this.rows,
            this.orderBy,
            this.isDesc
          )
        : this.taskApi.getAllTasks(
            this.first,
            this.rows,
            this.orderBy,
            this.isDesc
          );

    return obs.pipe(
      map(
        (result: TaskSetModel) => {
          this.totalTasks = result.totalCount;
          if (this.totalTasks > 0) {
            result.tasks.forEach((t: TaskModel) => {
              this.tasks.push(new TaskViewModel(t));
            });
          }

          if (!isNaN(this.initialTaskId)) {
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
      )
    );
  }

  ngOnInit() {
    fromEvent(this.pageInput.nativeElement, "change")
      .pipe(
        debounceTime(500),
        map(() => this.setPage())
      )
      .subscribe();

    this.sub = this.route.params.subscribe(params => {
      const taskId = +params["id"];
      if (!isNaN(taskId)) {
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
              detail: `There are no tasks with the ID = "${taskId}", the first page is loaded`
            });
          }

          if (row > this.rows) {
            const page =
              row % this.rows === 0
                ? row / this.rows - 1
                : Math.floor(row / this.rows);

            this.first = page * this.rows;
          }

          this.isInitialized = true;
        });
      } else {
        this.onRowUnselect();
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
