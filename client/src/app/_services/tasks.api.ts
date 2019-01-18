import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import TaskModel from "../_models/task.model";
import { ETaskStatus } from "../_enums/task-status.enum";
import { environment } from "src/environments/environment";
import TaskSetModel from "../_models/task-set.model";

const base_url = environment.API_URL;
const headers = new HttpHeaders()
  .set("Accept", "application/json; v=1.0")
  .set("Content-type", "application/json; v=1.0");
const options = { headers: headers };

@Injectable({
  providedIn: "root"
})
export class TasksApi {
  constructor(private http: HttpClient) {}

  public getAllTasks = (
    skip: number,
    take: number,
    orderBy: string,
    isDesc: boolean
  ): Observable<TaskSetModel> => {
    let url = `${base_url}/api/tasks?skip=${skip}&take=${take}&isDesc=${isDesc}`;
    if (orderBy) {
      url += `&orderBy=${orderBy}`;
    }

    return this.http.get<TaskSetModel>(url, options);
  }

  public getTasksByStatus = (
    status: ETaskStatus,
    skip: number,
    take: number,
    orderBy: string,
    isDesc: boolean
  ): Observable<TaskSetModel> => {
    let url = `${base_url}/api/tasks?status=${status}&skip=${skip}&take=${take}&isDesc=${isDesc}`;
    if (orderBy) {
      url += `&orderBy=${orderBy}`;
    }

    return this.http.get<TaskSetModel>(url, options);
  }

  public getTasksRowNumber = (id: number): Observable<number> => {
    return this.http.get<number>(`${base_url}/api/tasks/${id}/number`, options);
  }

  public getTasksRowNumberByStatus = (id: number, status: ETaskStatus): Observable<number> => {
    return this.http.get<number>(`${base_url}/api/tasks/${id}?status=${status}`, options);
  }

  public createTask = (task: TaskModel): Observable<TaskModel> => {
    return this.http.post<TaskModel>(`${base_url}/api/tasks`, task, options);
  }

  public updateTask = (task: TaskModel): Observable<TaskModel> => {
    return this.http.put<TaskModel>(`${base_url}/api/tasks/${task.id}`, task, options);
  }
}
