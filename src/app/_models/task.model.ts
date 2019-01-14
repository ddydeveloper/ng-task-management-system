import { ETaskStatus } from "../_enums/task-status.enum";
import { ETaskPriority } from "../_enums/task-priority.enum";

export default class TaskModel {
    id: number;
    name: string;
    description: string;
    priority: ETaskPriority;
    completed: Date;
    added: Date;
    status: ETaskStatus;

    // Is used to display remaining time to complete
    timeToComplete: string;
}
