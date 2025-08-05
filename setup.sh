#!/bin/bash

# High-Traffic Travel Platform Setup Script
# This script sets up the entire travel platform with all necessary components

set -e

echo "🚀 Setting up High-Traffic Travel Platform..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker is installed and running"
}

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker Compose is installed"
}

# Check if Java is installed
check_java() {
    if ! command -v java &> /dev/null; then
        print_warning "Java is not installed. Installing OpenJDK 17..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            brew install openjdk@17
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            sudo apt-get update
            sudo apt-get install -y openjdk-17-jdk
        else
            print_error "Unsupported operating system. Please install Java 17 manually."
            exit 1
        fi
    fi
    
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -lt 17 ]; then
        print_error "Java 17 or higher is required. Current version: $JAVA_VERSION"
        exit 1
    fi
    
    print_success "Java $(java -version 2>&1 | head -n 1 | cut -d'"' -f2) is installed"
}

# Check if Node.js is installed
check_nodejs() {
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. Installing Node.js 18..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            brew install node@18
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        else
            print_error "Unsupported operating system. Please install Node.js 18 manually."
            exit 1
        fi
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js 18 or higher is required. Current version: $NODE_VERSION"
        exit 1
    fi
    
    print_success "Node.js $(node --version) is installed"
}

# Check if Maven is installed
check_maven() {
    if ! command -v mvn &> /dev/null; then
        print_warning "Maven is not installed. Installing Maven..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            brew install maven
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            sudo apt-get install -y maven
        else
            print_error "Unsupported operating system. Please install Maven manually."
            exit 1
        fi
    fi
    
    print_success "Maven $(mvn --version | head -n 1 | cut -d' ' -f3) is installed"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p infrastructure/monitoring
    mkdir -p infrastructure/nginx
    mkdir -p infrastructure/sql
    mkdir -p docs
    
    print_success "Directories created"
}

# Create database initialization script
create_db_init() {
    print_status "Creating database initialization script..."
    
    cat > infrastructure/sql/init.sql << 'EOF'
-- Travel Platform Database Initialization Script

-- Create databases for different services
CREATE DATABASE travel_platform_users;
CREATE DATABASE travel_platform_travels;
CREATE DATABASE travel_platform_payments;
CREATE DATABASE travel_platform_notifications;
CREATE DATABASE travel_platform_analytics;

-- Create user for application access
CREATE USER travel_user WITH PASSWORD 'travel_password';
GRANT ALL PRIVILEGES ON DATABASE travel_platform_users TO travel_user;
GRANT ALL PRIVILEGES ON DATABASE travel_platform_travels TO travel_user;
GRANT ALL PRIVILEGES ON DATABASE travel_platform_payments TO travel_user;
GRANT ALL PRIVILEGES ON DATABASE travel_platform_notifications TO travel_user;
GRANT ALL PRIVILEGES ON DATABASE travel_platform_analytics TO travel_user;

-- Create extensions
\c travel_platform_users;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c travel_platform_travels;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c travel_platform_payments;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c travel_platform_notifications;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c travel_platform_analytics;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
EOF

    print_success "Database initialization script created"
}

# Create Prometheus configuration
create_prometheus_config() {
    print_status "Creating Prometheus configuration..."
    
    cat > infrastructure/monitoring/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'api-gateway'
    static_configs:
      - targets: ['api-gateway:8080']
    metrics_path: '/actuator/prometheus'

  - job_name: 'user-service'
    static_configs:
      - targets: ['user-service:8081']
    metrics_path: '/actuator/prometheus'

  - job_name: 'travel-service'
    static_configs:
      - targets: ['travel-service:8082']
    metrics_path: '/actuator/prometheus'

  - job_name: 'payment-service'
    static_configs:
      - targets: ['payment-service:8083']
    metrics_path: '/actuator/prometheus'

  - job_name: 'search-service'
    static_configs:
      - targets: ['search-service:8084']
    metrics_path: '/actuator/prometheus'

  - job_name: 'notification-service'
    static_configs:
      - targets: ['notification-service:8085']
    metrics_path: '/actuator/prometheus'

  - job_name: 'analytics-service'
    static_configs:
      - targets: ['analytics-service:8086']
    metrics_path: '/actuator/prometheus'
EOF

    print_success "Prometheus configuration created"
}

# Create Nginx configuration
create_nginx_config() {
    print_status "Creating Nginx configuration..."
    
    cat > infrastructure/nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream api_gateway {
        server api-gateway:8080;
    }

    upstream frontend {
        server travel-app:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/s;

    server {
        listen 80;
        server_name localhost;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API Gateway
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://api_gateway;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Authentication endpoints with stricter rate limiting
        location /api/v1/auth/login {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://api_gateway;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health checks
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

    print_success "Nginx configuration created"
}

# Build and start services
start_services() {
    print_status "Starting infrastructure services..."
    
    # Start only infrastructure services first
    docker-compose up -d postgres redis zookeeper kafka elasticsearch kibana prometheus grafana nginx
    
    print_success "Infrastructure services started"
    
    print_status "Waiting for services to be ready..."
    sleep 30
    
    print_status "Starting backend services..."
    docker-compose up -d eureka-server api-gateway user-service travel-service payment-service search-service notification-service analytics-service
    
    print_success "Backend services started"
    
    print_status "Waiting for backend services to be ready..."
    sleep 60
}

# Install frontend dependencies
install_frontend_deps() {
    print_status "Installing frontend dependencies..."
    
    cd frontend/travel-app
    npm install
    cd ../..
    
    print_success "Frontend dependencies installed"
}

# Create environment files
create_env_files() {
    print_status "Creating environment files..."
    
    # Backend environment
    cat > backend/.env << 'EOF'
# Database Configuration
DATABASE_URL=jdbc:postgresql://localhost:5432/travel_platform_users
DB_USERNAME=postgres
DB_PASSWORD=password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Kafka Configuration
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Elasticsearch Configuration
ELASTICSEARCH_HOST=localhost
ELASTICSEARCH_PORT=9200

# JWT Configuration
JWT_SECRET=your-secret-key-here-make-it-very-long-and-secure-in-production
JWT_EXPIRATION=86400000

# Multi-tenant Configuration
DEFAULT_TENANT_ID=default
EOF

    # Frontend environment
    cat > frontend/travel-app/.env << 'EOF'
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080
REACT_APP_DEFAULT_LOCALE=en
REACT_APP_DEFAULT_TENANT=default
EOF

    print_success "Environment files created"
}

# Main setup function
main() {
    echo "Starting setup process..."
    
    # Check prerequisites
    check_docker
    check_docker_compose
    check_java
    check_nodejs
    check_maven
    
    # Create necessary files and directories
    create_directories
    create_db_init
    create_prometheus_config
    create_nginx_config
    create_env_files
    
    # Install frontend dependencies
    install_frontend_deps
    
    # Start services
    start_services
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Service URLs:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - API Gateway: http://localhost:8080"
    echo "   - Eureka Server: http://localhost:8761"
    echo "   - Grafana: http://localhost:3000 (admin/admin)"
    echo "   - Prometheus: http://localhost:9090"
    echo "   - Kibana: http://localhost:5601"
    echo ""
    echo "🔧 Next steps:"
    echo "   1. Start the frontend: cd frontend/travel-app && npm start"
    echo "   2. Access the application at http://localhost:3000"
    echo "   3. Monitor services at http://localhost:8761"
    echo ""
    echo "📚 Documentation:"
    echo "   - API Documentation: http://localhost:8080/swagger-ui.html"
    echo "   - Architecture: See README.md"
    echo ""
}

# Run main function
main "$@" 