FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /app

# copy csproj and restore as distinct layers
COPY api-task-management/*.sln .
COPY api-task-management/api-task-management/*.csproj ./api-task-management/

# copy everything else and build app
COPY api-task-management/api-task-management/. ./api-task-management/
WORKDIR /app/api-task-management
RUN dotnet restore
RUN dotnet publish -c Release -o out

# Build runtime image
FROM microsoft/dotnet:2.1-aspnetcore-runtime AS runtime
WORKDIR /app
COPY --from=build /app/api-task-management/out ./

EXPOSE 5000
CMD ASPNETCORE_URLS=http://*:5000  dotnet api-task-management.dll