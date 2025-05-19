# Variable for the docker-compose file name
COMPOSE_FILE = docker-compose.yml

# Target to start the services
up:
	@echo "Starting services with Docker Compose..."
	docker-compose -f $(COMPOSE_FILE) up -d
	@echo "All services have been started."

# Target to stop the services
down:
	@echo "Stopping services..."
	docker-compose -f $(COMPOSE_FILE) down
	@echo "All services have been stopped."

# Target to clean up volumes and containers
clean:
	@echo "Stopping services and cleaning up volumes..."
	docker-compose -f $(COMPOSE_FILE) down --volumes
	@echo "All services and volumes have been removed."

# Target to clean up volumes and containers
restart:
	@echo "Stopping services and cleaning up volumes..."
	docker-compose -f $(COMPOSE_FILE) down --volumes
	docker-compose -f $(COMPOSE_FILE) up -d
	@echo "All services and volumes have been removed."

# Target to view logs
logs:
	@echo "Displaying logs for all services..."
	docker-compose -f $(COMPOSE_FILE) logs -f

# Target to check the status of services
status:
	@echo "Checking the status of services..."
	docker-compose -f $(COMPOSE_FILE) ps
