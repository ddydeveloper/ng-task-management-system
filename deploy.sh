docker build -t ddydeveloper/task-management-client:latest -t ddydeveloper/task-management-client:$SHA -f ./client/Dockerfile.stage ./client 
docker build -t ddydeveloper/task-management-server:latest -t ddydeveloper/task-management-server:$SHA -f ./api/Dockerfile.stage    ./api 
docker build -t ddydeveloper/task-management-mssql:latest -f ./database/Dockerfile.k8s ./database

docker push ddydeveloper/task-management-client:latest
docker push ddydeveloper/task-management-server:latest
docker push ddydeveloper/task-management-mssql:latest

docker push ddydeveloper/task-management-client:$SHA
docker push ddydeveloper/task-management-server:$SHA

kubectl apply -f k8s

# In case if you are using secrets to store data in a secure way use create secret command and not to include it inside deploy script 
kubectl delete secret mssql-secret
kubectl create secret generic mssql-secret --from-literal SA_PASSWORD="P@ssw0rd" --from-literal TASKS_DB="Server=mssql-cluster-ip-service;DataBase=Tasks;User Id=sa;Password=P@ssw0rd;Connection Timeout=30;"

kubectl set image deployments/client-deployment client=ddydeveloper/task-management-client:$SHA
kubectl set image deployments/server-deployment server=ddydeveloper/task-management-server:$SHA
kubectl set image deployments/mssql-deployment  mssql=ddydeveloper/task-management-mssql:latest