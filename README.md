# CarManager
Capstone


To stop the services defined in your docker-compose.yml file without destroying the containers, use:
docker-compose stop

To start the services again, use:
docker-compose start

To destroy the services (which destroys the containers but not the volumes), use:
docker-compose down

To destroy the services and volumes, use:
docker-compose down -v



Create new Kakfa Topic
docker exec kafka kafka-topics --bootstrap-server kafka:9092 --create --topic user-created
docker exec kafka kafka-topics --bootstrap-server kafka:9092 --create --topic invoice-created
docker exec kafka kafka-topics --bootstrap-server kafka:9092 --create --topic mileage-updated
docker exec kafka kafka-topics --bootstrap-server kafka:9092 --create --topic car-created

docker exec --interactive kafka kafka-console-consumer --bootstrap-server kafka:9092 --topic user-created --from-beginning

docker exec --interactive kafka kafka-console-consumer --bootstrap-server kafka:9092 --topic invoice-created --from-beginning

docker exec --interactive kafka kafka-console-consumer --bootstrap-server kafka:9092 --topic car-created --from-beginning


List all topics
docker exec kafka kafka-topics --bootstrap-server kafka:9092 --list

to get in a container
docker exec -it <container_id_or_name> /bin/sh

docker exec -it userserviceapi:1 /bin/sh





