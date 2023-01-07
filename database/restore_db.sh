if [ "$( sudo -i -u postgres psql -XtAc "SELECT 1 FROM pg_database WHERE datname='ZATools'" )" = '1' ]
then
    echo "Database already exists"
else
    echo "Database does not exist"
    echo "Creating database"
    sudo -i -u postgres createdb ZATools
fi

pg_restore -d ZATools -h 127.0.0.1 -U toolslabel ZATools.dump
