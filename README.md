# Description

The project is an implementation of the tasks management system. There are several opportunities provided by the system:
  - creating tasks with a name, description, priority and time to complete;
  - updating task with one of the status "Completed", "Archived";
  - observation a list of tasks filtered by status;
  
Changes provided by a user apply to connected clients via browser. A server-side paging is implemented and a sorting as well. A tasks grid allows to change a rows per page value and to select a particular page. The time to complete field is been updating every second. 

For convinience a color differentiation was applied for the priority field:
  - minor: light gray;
  - medium: light yellow;
  - high: coral;
  - highes: red;
  - blocker: dark red.
  
There is a color differentiation for the time to complete field as well:
  - task completed: green;
  - task expired: red;
  - task should be completed in 4 hours: coral;
  - task should be completed in a day: light yellow.
    
To restore the initial state of the UI use a refresh button. To observe a task details make a row selection.
    
# Components

This project consist of the following parts:
  - front-end app generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.1.;
  - [asp.net Core](https://github.com/aspnet/AspNetCore) version 2.1 rest API service;
  - mssql database provided by latest docker [image](https://hub.docker.com/r/microsoft/mssql-server-linux/).

## Get Started

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
