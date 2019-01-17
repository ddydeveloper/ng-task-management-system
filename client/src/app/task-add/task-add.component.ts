import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { MessageService } from "primeng/api";
import { TasksApi } from "../_services/tasks.api";
import { ETaskPriority } from "../_enums/task-priority.enum";
import TaskModel from "../_models/task.model";
import { ETaskStatus } from "../_enums/task-status.enum";
import { Router } from "@angular/router";
import * as moment from "moment";
import { EnumValues } from "enum-values";

@Component({
  selector: "app-task-add",
  templateUrl: "./task-add.component.html",
  styleUrls: ["./task-add.component.scss"]
})
export class TaskAddComponent implements OnInit {
  taskForm: FormGroup;

  name: string = null;
  description: string = null;
  completed: Date = null;
  priority: ETaskPriority = ETaskPriority.Medium;

  priorities = EnumValues.getNames(ETaskPriority).map(key => ({
    label: key,
    value: ETaskPriority[key]
  }));

  showDialog = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private tasksApi: TasksApi,
    private router: Router
  ) {}

  onSubmit(): void {
    this.showDialog = true;
  }

  confirmDialog(): void {
    this.showDialog = false;

    const added: TaskModel = {
      id: -1,
      name: this.name,
      description: this.description,
      added: new Date(),
      completed: this.completed,
      priority: this.priority,
      status: ETaskStatus.Active
    };

    this.tasksApi.createTask(added).subscribe(
      t => {
        this.messageService.add({
          severity: "success",
          summary: "Task created",
          detail: `A new task ${t.name} was created`
        });

        setTimeout(() => this.router.navigate([`/tasks/${t.id}`]), 1000);
      },
      () => {
        this.messageService.add({
          severity: "error",
          summary: "Task ceating error",
          detail: "An error occured when creating a new task"
        });
      }
    );
  }

  ngOnInit() {
    this.taskForm = this.fb.group({
      name: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(100)])),
      description: new FormControl("", Validators.maxLength(500)),
      completed: new FormControl("", Validators.required),
      priority: new FormControl("", Validators.required)
    });
  }
}
