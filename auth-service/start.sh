#!/bin/sh

# Run Flyway migrate
java ${JAVA_OPTS} -jar app.jar --spring.flyway.baseline-on-migrate=true migrate

# Start the application
exec java ${JAVA_OPTS} -jar app.jar