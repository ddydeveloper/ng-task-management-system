import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { TasksApi } from "../_services/tasks.api";
import { interval } from "rxjs";
import TaskViewModel from "../_models/task.view-model";
import TaskModel from "../_models/task.model";
import { getDateDiffInSeconds, secondsToText } from "../_helpers/date.helper";
import * as moment from "moment";
import { LazyLoadEvent, MessageService, SelectItem } from "primeng/api";
import { ETaskStatus } from "../_enums/task-status.enum";
import { ActivatedRoute, Router } from "@angular/router";
import TaskSetModel from "../_models/task-set.model";
import { HubConnection } from "@aspnet/signalr";
import { environment } from "src/environments/environment";
import * as signalR from "@aspnet/signalr";
import { closestNext } from "../_helpers/number.helper";

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
    private router: Router
  ) {}

  private hubConnection: HubConnection;
  pollingTasks: any;

  cols = [
    { field: "name", header: "Name", width: "36.7%", sortable: true },
    { field: "priority", header: "Priority", width: "15%", sortable: true },
    { field: "added", header: "Added", width: "15%", sortable: false },
    { field: "completed", header: "Deadline", width: "15%", sortable: false },
    {
      field: "timeToComplete",
      header: "Time to complete",
      width: "15%",
      sortable: false
    }
  ];

  private sub: any;
  private initialTaskId: number;

  isInitialized = false;
  showCompleteDialog = false;
  showDeleteDialog = false;

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
  rowsPerPageOptions = [15, 30, 100, 500, 1000];

  refreshData(): void {
    this.first = 0;
    this.onRowUnselect();

    this.loadData();
  }

  onPageChanged(event: any): void {
    this.first = event.first;
    this.rows = event.rows;

    this.loadData();
  }

  onStatusChanged(): void {
    this.loadData();
  }

  closeDialog(): void {
    this.showCompleteDialog = false;
    this.showDeleteDialog = false;
  }

  confirmCompleteDialog(): void {
    this.updateTaskStatus(ETaskStatus.Completed);
  }

  confirmDeleteDialog(): void {
    this.updateTaskStatus(ETaskStatus.Archived);
  }

  onRowSelect(): void {
    const idx = this.router.url.indexOf("tasks");
    const route = this.router.url.substring(0, idx + 5);
    window.history.replaceState({}, "", `${route}/${this.selectedTask.id}`);
  }

  onRowUnselect(): void {
    const idx = this.router.url.indexOf("tasks");
    const route = this.router.url.substring(0, idx + 5);
    window.history.replaceState({}, "", `${route}`);
  }

  updateTaskStatus(status: ETaskStatus): void {
    const updated = Object.assign({}, this.selectedTask);
    updated.status = status;
    this.taskApi.updateTask(updated).subscribe(
      () => {
        this.loadData();
      },
      () => {
        this.messageService.add({
          severity: "error",
          summary: "Task updating error",
          detail: "An error occured when updating task status"
        });
      }
    );

    this.showCompleteDialog = false;
    this.showDeleteDialog = false;
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
          this.initialTaskId = null;
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
          if (row > this.rows) {
            this.first = Math.trunc(row / this.rows) * this.rows;
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
      this.tasks.forEach((t: TaskViewModel) => {
        t.timeToComplete = secondsToText(
          getDateDiffInSeconds(date, t.completed)
        );
      });
    });

    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(`${environment.API_URL}/hubs/notifications`)
      .build();

    this.hubConnection.start();

    this.hubConnection.on("TaskCreated", (t: TaskModel) => {
      debugger;
      if (this.selectedStatus !== ETaskStatus.Completed) {
        const last = this.tasks[this.tasks.length - 1];
        if (t.id === last.id + 1) {
          this.tasks.push(new TaskViewModel(t));
        }
      }

      this.messageService.add({
        severity: "success",
        summary: "Task created",
        detail: `A new task "${t.name}" was created`
      });
    });

    this.hubConnection.on("TaskUpdated", (t: TaskModel) => {
      debugger;
      if (t.status === ETaskStatus.Archived) {
        const deleted = this.tasks.find(task => task.id === t.id);
        if (deleted) {
          if (this.selectedTask === deleted) {
            this.selectedTask = null;
          }

          const idx = this.tasks.indexOf(deleted);
          this.tasks.splice(idx, 1);
        }

        this.messageService.add({
          severity: "success",
          summary: "Task deleted",
          detail: `A task "${t.name}" was deleted`
        });
      }

      if (t.status === ETaskStatus.Completed) {
        if (this.selectedStatus === null) {
          const updated = this.tasks.find(task => task.id === t.id);
          if (updated) {
            const indexOf = this.tasks.indexOf(updated);
            const replace = new TaskViewModel(t);
            this.tasks[indexOf] = replace;

            if (updated === this.selectedTask) {
              this.selectedTask = replace;
            }
          }
        }

        if (this.selectedStatus === ETaskStatus.Active) {
          const deleted = this.tasks.find(task => task.id === t.id);
          if (deleted) {
            if (this.selectedTask === deleted) {
              this.selectedTask = null;
            }

            const idx = this.tasks.indexOf(deleted);
            this.tasks.splice(idx, 1);
          }
        }

        if (this.selectedStatus === ETaskStatus.Completed) {
          const next = closestNext(this.tasks.map(task => task.id), t.id);
          if (next) {
            const nextTask = this.tasks.find(task => task.id === next);
            const idx = this.tasks.indexOf(nextTask);
            this.tasks.splice(idx, 0, new TaskViewModel(t));
          }
        }

        this.messageService.add({
          severity: "success",
          summary: "Task completed",
          detail: `A task "${t.name}" was completed`
        });
      }
    });

    this.loading = true;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.pollingTasks.unsubscribe();
    this.hubConnection.stop();
  }
}
