echo 'Please wait while SQL Server 2017 warms up'
sleep 10s

echo 'Initializing database after 10 seconds of wait'
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P P@ssw0rd -i ./setup.sql

echo 'Finished initializing the database'