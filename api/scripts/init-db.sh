#!/bin/bash

# Load environment variables
source ../.env

# Run the SQL script
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -f init-db.sql

echo "Database initialization completed." 