import TaskModel from "./task.model";
import { ETaskStatus } from "../_enums/task-status.enum";

export default class TaskViewModel extends TaskModel {
    constructor(task: TaskModel) {
        super();

        this.id = task.id;
        this.name = task.name;
        this.description = task.description;
        this.status = task.status;
        this.priority = task.priority;
        this.added = task.added;
        this.completed = task.completed;

        if (task.status === ETaskStatus.Completed) {
            this.timeToCompleteText = "Completed";
        }
    }

    get isActive(): boolean {
        return this.status === ETaskStatus.Active;
    }

    timeToComplete: number;
    timeToCompleteText: string;
}
