docker build -t ddydeveloper/task-management-client:latest -t ddydeveloper/task-management-client:$SHA -f ./client/Dockerfile.stage ./client 
docker build -t ddydeveloper/task-management-server:latest -t ddydeveloper/task-management-server:$SHA -f ./api/Dockerfile.stage    ./api 
docker build -t ddydeveloper/task-management-mssql:latest  -t ddydeveloper/task-management-mssql:$SHA  -f ./database/Dockerfile.k8s ./database

docker push ddydeveloper/task-management-client:latest
docker push ddydeveloper/task-management-server:latest
docker push ddydeveloper/task-management-mssql:latest

docker push ddydeveloper/task-management-client:$SHA
docker push ddydeveloper/task-management-server:$SHA
docker push ddydeveloper/task-management-mssql:$SHA

kubectl apply -f k8s
# create secrets if needed via GKE console to keep data hidden 
kubectl set image deployments/client-deployment server=ddydeveloper/task-management-client:$SHA
kubectl set image deployments/server-deployment server=ddydeveloper/task-management-server:$SHA
kubectl set image deployments/mssql-deployment  server=ddydeveloper/task-management-mssql:$SHA