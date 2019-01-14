import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "task-management";

  items: MenuItem[];
  activeItem: MenuItem;

  ngOnInit() {
    this.items = [
      { label: "Add new task", icon: "pi pi-plus", routerLink: "tasks/new" },
      { label: "Tasks list", icon: "pi pi-list", routerLink: "tasks" }
    ];

    this.activeItem = this.items[1];
  }
}
