#!/bin/bash

# Wait for Kafka to be ready
until kafka-topics --bootstrap-server localhost:9092 --list > /dev/null 2>&1; do
  echo "Waiting for Kafka to be ready..."
  sleep 1
done

# Create topics if they don't exist
for topic in user-created invoice-created mileage-updated; do
  kafka-topics --bootstrap-server localhost:9092 --topic $topic --create --partitions 1 --replication-factor 1 || true
done

# Execute the default entrypoint
exec /etc/confluent/docker/run
