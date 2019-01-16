import { Pipe, PipeTransform } from "@angular/core";
import { ETaskStatus } from "../_enums/task-status.enum";

@Pipe({ name: "status" })
export class StatusPipe implements PipeTransform {
  transform(status: ETaskStatus): string {
    return ETaskStatus[status];
  }
}
