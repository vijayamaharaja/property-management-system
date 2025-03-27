#!/bin/bash

# Setup Backend
echo "Setting up Spring Boot backend..."
cd /workspace/property-catalog-service
./mvnw clean package -DskipTests

# Setup Frontend
echo "Setting up React frontend..."
cd /workspace/property-management-webui
npm install

# Script to start both services
cat > /workspace/start-services.sh << 'EOL'
#!/bin/bash

# Start backend in background
echo "Starting Spring Boot backend..."
cd /workspace/property-catalog-service
./mvnw spring-boot:run &

# Start frontend
echo "Starting React frontend..."
cd /workspace/property-management-webui
npm start
EOL

chmod +x /workspace/start-services.sh

echo "Setup complete! Run './start-services.sh' to start the application."