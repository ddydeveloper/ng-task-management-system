#start SQL Server, start the script to create the DB and initial data
echo 'starting database setup'
/opt/mssql/bin/sqlservr & ./setup.sh & bash