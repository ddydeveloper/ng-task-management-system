import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import TaskModel from "../_models/task.model";
import { ETaskStatus } from "../_enums/task-status.enum";
import { environment } from "src/environments/environment";

const base_url = environment.API_URL;
const headers = new HttpHeaders().set("Accept", "application/json; v=1.0").set("Content-type", "application/json; v=1.0");
const options = { headers: headers };

@Injectable({
    providedIn: "root"
})
export class TasksApi {
    constructor(private http: HttpClient) { }

    public getAllTasks = (skip: number, take: number): Observable<TaskModel[]> => {
        return this.http.get<TaskModel[]>(`${base_url}/api/tasks?skip=${skip}&take=${take}`, options);
    }

    public getAllTasksCount = (): Observable<number> => {
        return this.http.get<number>(`${base_url}/api/tasks/count`, options);
    }

    public getTasksByStatus = (status: ETaskStatus, skip: number, take: number): Observable<TaskModel[]> => {
        return this.http.get<TaskModel[]>(`${base_url}/api/tasks?status=${status}&skip=${skip}&take=${take}`, options);
    }

    public getTasksByStatusCount = (status: ETaskStatus): Observable<number> => {
        return this.http.get<number>(`${base_url}/api/tasks/count?status=${status}`, options);
    }

    public createTask = (task: TaskModel): Observable<TaskModel> => {
        return this.http.post<TaskModel>(`${base_url}/api/tasks`, task, options);
    }

    public updateTask = (task: TaskModel): Observable<TaskModel> => {
        return this.http.put<TaskModel>(`${base_url}/api/tasks/${task.id}`, task, options);
    }
}
