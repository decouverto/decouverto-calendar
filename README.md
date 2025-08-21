# decouverto-calendar
The website of Découverto calendar: events and registrations.


**You have to add a file `email-password.json` at the root of the project with:**
```
{
    "password": "mymagicpassword"
}
```

To dump a database:
mongodump --uri="mongodb://localhost:27017/decouverto" --archive=~/mongo_backups/decouverto.gz --gzip
mongodump --uri="mongodb://localhost:27017/decouverto-calendar" --archive=~/mongo_backups/decouverto-calendar.gz --gzip

To load a database:
docker cp ./mongo_backups/decouverto.gz decouverto-website-mongo-1:/decouverto.gz
docker exec -it decouverto-website-mongo-1 mongorestore --gzip --archive=/decouverto.gz

Dropdatabase