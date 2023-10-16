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

docker exec --interactive kafka kafka-console-consumer --bootstrap-server kafka:9092 --topic user-created --from-beginning


