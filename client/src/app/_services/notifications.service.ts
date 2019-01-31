import { HubConnection } from "@aspnet/signalr";
import * as signalR from "@aspnet/signalr";
import { environment } from "src/environments/environment";
import TaskModel from "../_models/task.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class NotificationsService {
  private hubConnection: HubConnection;

  start(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(`${environment.API_URL}/api/signalR/notifications`)
      .build();

    this.hubConnection.start();
  }

  stop(): void {
    this.hubConnection.stop();
  }

  subscribe(name: string, callback: (tm: TaskModel) => any) {
    this.hubConnection.on(name, callback);
  }
}
