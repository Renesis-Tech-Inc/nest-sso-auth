# Makefile for Python project
# Variables
PROJECT_NAME=sso-auth
IMAGE_NAME=$(PROJECT_NAME):latest
CONTAINER_NAME=$(PROJECT_NAME)_container

# Docker commands
docker-build:
	@echo "Building the Docker image..."
	docker build -t $(IMAGE_NAME) .

docker-run:
	@echo "Running the Docker container..."
	docker run --name $(CONTAINER_NAME) -p 8000:8000 $(IMAGE_NAME)

docker-stop:
	@echo "Stopping the Docker container..."
	docker stop $(CONTAINER_NAME)

docker-remove:
	@echo "Removing the Docker container..."
	docker rm $(CONTAINER_NAME)

docker-clean:
	@echo "Removing the Docker image..."
	docker rmi $(IMAGE_NAME)

# Combined commands
docker-rebuild: docker-stop docker-remove docker-clean docker-build docker-run
	@echo "Rebuilding and running the Docker container..."


# Default command
.PHONY: docker-build docker-run docker-stop docker-remove docker-clean docker-rebuild