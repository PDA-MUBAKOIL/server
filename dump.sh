#!/bin/sh
echo "load files"

mkdir /app/ws
cd /app/ws

echo "dump data from DB"
mongodump --uri mongodb+srv://<username>:<password>@<HOST_URL>/<DB_NAME>

echo "restore data from dump file"
mongorestore --db=<DB_NAME> --username=<username> --password=<password> --port=27017 --authenticationDatabase=admin .

echo "done, remove dump files"
cd /app
rm-rf ./ws/