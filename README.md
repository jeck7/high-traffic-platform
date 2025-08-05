# High-Traffic Travel Platform

A scalable, multi-tenant, multilingual travel platform built with Java Spring Boot, React, and PostgreSQL.

## 🏗️ Architecture Overview

### Backend Services
- **API Gateway**: Spring Cloud Gateway for routing and load balancing
- **User Service**: Authentication, authorization, and user management
- **Travel Service**: Core travel booking and management
- **Payment Service**: Payment processing and financial operations
- **Notification Service**: Email, SMS, and push notifications
- **Search Service**: Elasticsearch-based search functionality
- **Analytics Service**: Data analytics and reporting

### Frontend
- **React Web App**: Main travel booking interface with Material-UI
- **Admin Dashboard**: Multi-tenant administration panel
- **Mobile App**: React Native (future expansion)

### Infrastructure
- **Database**: PostgreSQL with read replicas and performance optimizations
- **Cache**: Redis for session and data caching
- **Message Queue**: Apache Kafka for async processing
- **Monitoring**: Prometheus + Grafana
- **Containerization**: Docker + Docker Compose

## 🚀 Features

### ✅ Implemented Features

#### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- User registration and login
- User profile management
- Multi-tenant user isolation

#### ✈️ Travel Management
- Browse travel packages with beautiful images
- Search and filter packages by destination, price, category
- View package details with ratings and reviews
- Booking management system
- Travel history tracking

#### 📋 Booking System
- Create and manage travel bookings
- View booking status (Confirmed, Pending, Cancelled)
- Filter bookings by status
- Booking details with traveler information
- Booking cancellation for pending bookings

#### 🎨 Modern UI/UX
- Responsive Material-UI design
- Beautiful travel package cards with images
- Interactive filters and search
- Smooth navigation and transitions
- Mobile-friendly interface

#### 📊 API Documentation
- Swagger/OpenAPI 3.0 documentation
- Interactive API testing interface
- Complete API specifications
- Available for User Service and Travel Service

### 🔄 Planned Features

#### Multi-tenancy
- Tenant isolation at database and application level
- Customizable branding per tenant
- Tenant-specific configurations

#### Multilingual Support
- i18n support for multiple languages
- Dynamic content translation
- Locale-specific formatting

#### High Availability
- Horizontal scaling with load balancers
- Database clustering and replication
- Circuit breakers and fallback mechanisms

## 📁 Project Structure

```
high-traffic-platform/
├── backend/
│   ├── api-gateway/          # Spring Cloud Gateway
│   ├── user-service/         # Authentication & User Management
│   ├── travel-service/       # Travel Packages & Bookings
│   ├── eureka-server/        # Service Discovery
│   ├── payment-service/      # Payment Processing
│   ├── notification-service/ # Email, SMS, Push Notifications
│   ├── search-service/       # Elasticsearch Search
│   └── analytics-service/    # Data Analytics
├── frontend/
│   └── travel-app/           # React Web Application
├── infrastructure/
│   ├── docker-compose.yml    # Docker services orchestration
│   ├── sql/                  # Database schemas and data
│   ├── redis/                # Redis configuration
│   ├── nginx/                # Reverse proxy configuration
│   ├── prometheus/           # Monitoring configuration
│   └── grafana/              # Dashboard configurations
└── docs/
```

## 🛠️ Technology Stack

### Backend
- **Java 17** with Spring Boot 3.x
- **Spring Cloud** for microservices architecture
- **Spring Security** for authentication and authorization
- **Spring Data JPA** for data access
- **PostgreSQL** as primary database with performance optimizations
- **Redis** for caching and session management
- **Apache Kafka** for asynchronous messaging
- **Elasticsearch** for search functionality
- **Swagger/OpenAPI 3.0** for API documentation

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router DOM** for client-side routing
- **Material-UI (MUI)** for UI components
- **Axios** for HTTP client
- **React Hook Form** for form handling

### DevOps & Infrastructure
- **Docker** for containerization
- **Docker Compose** for local development
- **Prometheus** for metrics collection
- **Grafana** for metrics visualization
- **Nginx** for reverse proxy and load balancing

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd high-traffic-platform
   ```

2. **Start all services with Docker Compose**
   ```bash
   cd infrastructure
   docker-compose up -d
   ```

3. **Start React frontend (optional - for development)**
   ```bash
   cd frontend/travel-app
   npm install
   npm start
   ```

4. **Access the application**
   - **React App**: http://localhost:3000
   - **API Gateway**: http://localhost:8080
   - **User Service**: http://localhost:8081
   - **Travel Service**: http://localhost:8082
   - **Eureka Dashboard**: http://localhost:8761
   - **Grafana**: http://localhost:3001
   - **Kibana**: http://localhost:5601

## 📊 Available Services

### 🌐 Frontend
- **React App**: http://localhost:3000
  - Modern travel booking interface
  - User authentication and registration
  - Travel package browsing and filtering
  - Booking management
  - User profile management

### 🔧 Backend Services
- **API Gateway**: http://localhost:8080
  - Central routing and load balancing
  - Rate limiting and circuit breakers
  - JWT authentication middleware

- **User Service**: http://localhost:8081
  - User registration and authentication
  - JWT token management
  - User profile management
  - Role-based access control

- **Travel Service**: http://localhost:8082
  - Travel package management
  - Booking operations
  - Package search and filtering

- **Eureka Server**: http://localhost:8761
  - Service discovery and registration
  - Service health monitoring

### 📊 Monitoring & Observability
- **Grafana**: http://localhost:3001
  - Metrics visualization
  - Performance dashboards
  - System monitoring

- **Kibana**: http://localhost:5601
  - Log analysis and visualization
  - Search and analytics

### 🗄️ Data Services
- **PostgreSQL**: localhost:5432
  - Primary database with performance optimizations
  - Multi-tenant data isolation
  - Test data included

- **Redis**: localhost:6379
  - Session management
  - Caching layer
  - Rate limiting storage

## 📚 API Documentation

### Swagger UI Endpoints
- **User Service API**: http://localhost:8081/swagger-ui/index.html
- **Travel Service API**: http://localhost:8082/swagger-ui/index.html

### API Features
- Complete OpenAPI 3.0 specifications
- Interactive testing interface
- Request/response examples
- Authentication documentation
- Error handling documentation

## 🧪 Test Data

### Users
- **Admin**: admin@travelplatform.com / password123
- **Regular Users**: johndoe, janesmith, bobwilson, alicebrown
- **Moderator**: moderator@travelplatform.com

### Travel Packages
- 10 diverse travel packages with beautiful images
- Categories: Beach, Adventure, City, Cultural, Luxury, Budget
- Price range: $699 - $3499
- Destinations: Bali, Swiss Alps, Paris, Serengeti, Greek Islands, Kyoto, Maldives, etc.

### Bookings
- Sample bookings with different statuses
- Confirmed, pending, and cancelled bookings
- Realistic booking data for testing

## 🔧 Configuration

### Environment Variables
- `SPRING_PROFILES_ACTIVE`: Active Spring profile
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `KAFKA_BOOTSTRAP_SERVERS`: Kafka broker addresses
- `JWT_SECRET`: JWT signing secret

### Performance Optimizations
- **Database**: Connection pooling, query optimization, indexing
- **Caching**: Redis for session and data caching
- **Load Balancing**: Nginx with least connections algorithm
- **Rate Limiting**: API Gateway rate limiting
- **Circuit Breakers**: Resilience4j for fault tolerance

## 📈 Performance Targets

- **Response Time**: < 200ms for 95% of requests
- **Availability**: 99.9% uptime
- **Throughput**: 10,000+ concurrent users
- **Scalability**: Horizontal scaling to 100+ instances

## 🔒 Security Features

- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Row-level security (RLS) in PostgreSQL
- **API Security**: Rate limiting, input validation
- **Audit Logging**: Complete audit trail

## 🚀 Deployment

### Local Development
```bash
# Start all services
cd infrastructure
docker-compose up -d

# Start React app (optional)
cd frontend/travel-app
npm start
```

### Production Deployment
```bash
# Build and deploy with Docker
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact: support@travelplatform.com
- Documentation: [Wiki](link-to-wiki)

---

**Built with ❤️ using Spring Boot, React, and modern web technologies** 