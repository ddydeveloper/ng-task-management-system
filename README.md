# Description

The project is an implementation of the tasks management system. There are several opportunities provided by the system:
  - Creating tasks with a name, a description, a priority and a time to complete;
  - Updating task with one of the status: "Completed", "Archived";
  - Observation a list of tasks filtered by a status;
  
Changes provided by a user apply to connected clients via a browser. A server-side paging is implemented and a sorting as well. A tasks grid allows to change a rows per page value and to select a particular page. The time to complete field is been updating every second. 

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
  - MS SQL database provided by latest docker [image](https://hub.docker.com/r/microsoft/mssql-server-linux/)

# Get Started

## Docker-compose flow (preferred way)

To set up a project:
  - Make sure you have [Docker](https://hub.docker.com/editions/community/docker-ce-desktop-windows) installed on your local machine
  - Clone the repository, [github desktop](https://desktop.github.com/) can be used
  - Choose the master branch
  - Use CLI and go to a root directory (should contains `docker-compose.yaml` file)
  - Build images with the `docker-compose build` command
  - Execute containers with the `docker-compose up` command
  - You can also use the `docker-compose up --build` command instead of the last 2 steps. Include `-d` flag to a command to start containers in the detached mode.

Navigate to `http://localhost:3000/` and enjoy the app! 

The back-end [API specification](http://localhost:8001/swagger) should be available on `http://localhost:8001/swagger`. 

You can also connect to the SQL database with any tool, such as [azure-data-studio](https://docs.microsoft.com/ru-ru/sql/azure-data-studio/download?view=sql-server-2017) and [SQL Server management studio](https://docs.microsoft.com/ru-ru/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-2017). Connection params:
  - Server: `localhost,1434`
  - Database: `Tasks`
  - User: `sa`
  - Password: `P@ssw0rd`

There is also a logging system implemented with the [Serilog](https://serilog.net/) and the [Seq](https://getseq.net/) as a collect and analyzing tool. Navigate to `http://localhost:8005/` to reach the [Seq web UI](http://localhost:8005/).

## Docker flow

You can also run containers separately and run them with preferred settings.

### Seq

  - Run the command: `docker run -e ACCEPT_EULA=Y -p PORT_FOR_SEQ_WEB_UI:80 -p PORT_FOR_SEQ:5341 -d datalust/seq:latest`

### Database

  - Go to the `./database` folder
  - Build an image with the command: `docker build -f Dockerfile.stage -t YOUR_DB_IMAGE_TAG .`
  - Run a container with the command: `docker run -p YOUR_DB_PORT:1433 YOUR_DB_IMAGE_TAG`

### API app

  - Go to the `./api` folder
  - Make sure your have correct settings in app.settings.config file: 
    - Seq="http://localhost:PORT_FOR_SEQ_WEB_UI"
    - ConnectionStrings__TasksDb": "Server=localhost,YOUR_DB_PORT;DataBase=Tasks;User Id=sa;Password=P@ssw0rd;Connection Timeout=30;"
  - Build an image with the command: `docker build -f Dockerfile.stage -t YOUR_API_IMAGE_TAG .`
  - Run a container with the command: `docker run -p YOUR_API_PORT:80 YOUR_API_IMAGE_TAG`
  
### Client app

  - Go to the `./client` folder
  - Make sure your have correct settings in environment.ts file: 
    - API_URL: "http://localhost:YOUR_API_PORT"
  - Build an image with the command: `docker build -f Dockerfile.stage -t YOUR_CLIENT_IMAGE_TAG .`
  - Run a container with the command: `docker run -p YOUR_CLIENT_PORT:3000 YOUR_CLIENT_IMAGE_TAG`
  
### Try app

There should be all services available according to the bounded ports: YOUR_CLIENT_PORT, YOUR_API_PORT, YOUR_DB_PORT, PORT_FOR_SEQ_WEB_UI
