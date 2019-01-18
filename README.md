# Description

The project is an implementation of the tasks management system. There are several opportunities provided by the system:
  - Creating tasks with a name, description, priority and time to complete;
  - Updating task with one of the status "Completed", "Archived";
  - observation a list of tasks filtered by status;
  
Changes provided by a user apply to connected clients via browser. A server-side paging is implemented and a sorting as well. A tasks grid allows to change a rows per page value and to select a particular page. The time to complete field is been updating every second. 

For convinience a color differentiation was applied for the priority field:
  - Minor: light gray
  - Medium: light yellow
  - High: coral
  - Highes: red
  - Blocker: dark red.
  
There is a color differentiation for the time to complete field as well:
  - Task completed: green
  - Task expired: red
  - Task should be completed in 4 hours: coral
  - Task should be completed in a day: light yellow.
    
To restore the initial state of the UI use a refresh button. To observe a task details make a row selection.
    
# Components

This project consist of the following parts:
  - Front-end app generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.1.
  - [Asp.net Core](https://github.com/aspnet/AspNetCore) version 2.1 rest API service
  - MS SQL database provided by latest docker [image](https://hub.docker.com/r/microsoft/mssql-server-linux/).

# Get Started

## Docker flow (preferred way)

To set up a project:
  - Make sure you have [Docker](https://hub.docker.com/editions/community/docker-ce-desktop-windows) installed on your local machine
  - Clone the repository, [github desktop](https://desktop.github.com/) can be used
  - Choose the master branch
  - Use CLI and go to a root directory (should contains `docker-compose.yaml` file)
  - Build images with the `docker-compose build -d` command
  - Execute containers with the `docker-compose up -d` command
  - Navigate to `http://localhost:3000/`, there should be a web app available
  
Enjoy the app!

## Manual deploy 
