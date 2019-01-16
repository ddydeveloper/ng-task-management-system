import { Pipe, PipeTransform } from "@angular/core";
import { ETaskPriority } from "../_enums/task-priority.enum";

@Pipe({ name: "priority" })
export class PriorityPipe implements PipeTransform {
  transform(priority: ETaskPriority): string {
    return ETaskPriority[priority];
  }
}
