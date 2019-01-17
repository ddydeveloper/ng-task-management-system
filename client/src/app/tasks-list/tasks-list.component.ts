import { Component, OnInit, OnDestroy } from "@angular/core";
import { TasksApi } from "../_services/tasks.api";
import { interval, forkJoin, Observable } from "rxjs";
import TaskViewModel from "../_models/task.view-model";
import TaskModel from "../_models/task.model";
import { getDateDiffInSeconds, secondsToText } from "../_helpers/date.helper";
import * as moment from "moment";
import { LazyLoadEvent, MessageService, SelectItem } from "primeng/api";
import { ETaskStatus } from "../_enums/task-status.enum";
import { ActivatedRoute, Router } from "@angular/router";

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
  skip = 0;
  take = 40;

  loadDataOnScroll(event: LazyLoadEvent): void {
    if (event.first + event.rows > this.totalTasks) {
      return;
    }

    this.skip = event.first;
    this.take = event.rows;

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
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: "A task status was succesfully updated"
        });
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
        ? forkJoin(
            this.taskApi.getTasksByStatus(
              this.selectedStatus,
              this.skip,
              this.take
            ),
            this.taskApi.getTasksByStatusCount(this.selectedStatus)
          )
        : forkJoin(
            this.taskApi.getAllTasks(this.skip, this.take),
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
    this.pollingTasks = interval(1000).subscribe(() => {
      const date = moment().toDate();
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
