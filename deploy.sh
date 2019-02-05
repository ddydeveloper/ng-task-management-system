# docker build -t ddydeveloper/task-management-client:latest -t ddydeveloper/task-management-client:$SHA -f ./client/Dockerfile.stage ./client 
# docker build -t ddydeveloper/task-management-server:latest -t ddydeveloper/task-management-server:$SHA -f ./api/Dockerfile.stage    ./api 
# docker build -t ddydeveloper/task-management-mssql:latest  -t ddydeveloper/task-management-mssql:$SHA  -f ./database/Dockerfile.k8s ./database

# docker push ddydeveloper/task-management-client:latest
# docker push ddydeveloper/task-management-server:latest
# docker push ddydeveloper/task-management-mssql:latest

# docker push ddydeveloper/task-management-client:$SHA
# docker push ddydeveloper/task-management-server:$SHA
# docker push ddydeveloper/task-management-mssql:$SHA

# # Apply command separately to keep data in secure way
# kubectl delete secret mssql-secret
# kubectl create secret generic mssql-secret --from-literal SA_PASSWORD="P@ssw0rd" --from-literal TASKS_DB="Server=mssql-cluster-ip-service;DataBase=Tasks;User Id=sa;Password=P@ssw0rd;Connection Timeout=30;"

# Apply workloads and services
kubectl apply -f k8s
# kubectl set image deployments/client-deployment client=ddydeveloper/task-management-client:$SHA
# kubectl set image deployments/server-deployment server=ddydeveloper/task-management-server:$SHA

# Database initialize single instance, set up availability level to replicate
# kubectl apply -f k8s_db
# kubectl set image deployments/mssql-deployment  mssql=ddydeveloper/task-management-mssql:$SHA