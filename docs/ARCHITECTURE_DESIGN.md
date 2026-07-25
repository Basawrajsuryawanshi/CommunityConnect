# CommunityConnect - Backend Architecture Design Document

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Design](#architecture-design)
3. [Microservices Breakdown](#microservices-breakdown)
4. [Database Design](#database-design)
5. [Technology Stack](#technology-stack)
6. [API Gateway Design](#api-gateway-design)
7. [Security & Authentication](#security--authentication)
8. [Deployment Strategy](#deployment-strategy)
9. [Development Roadmap](#development-roadmap)

---

## 1. System Overview

### 1.1 Project Description
CommunityConnect is a community management platform that enables users to:
- Register and authenticate (Email/Password & Google OAuth)
- Manage community events (general events and trekking expeditions)
- Participate in discussions and forums
- View and post announcements
- Connect with other members
- View community dashboard and analytics

### 1.2 Architecture Pattern
**Microservices Architecture** with API Gateway pattern

### 1.3 Key Principles
- **Separation of Concerns**: Each microservice handles specific business domain
- **Independent Deployment**: Services can be deployed independently
- **Database per Service**: Each microservice has its own database
- **Resilience**: Failure in one service doesn't crash entire system
- **Scalability**: Scale individual services based on load

---

## 2. Architecture Design

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Web Client   │  │ Mobile App   │  │ Admin Panel  │          │
│  │  (React)     │  │  (Future)    │  │  (Future)    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
		  │                  │                  │
		  └──────────────────┴──────────────────┘
							 │
					HTTPS/WSS │
							 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (Port 5000)                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ • Authentication & Authorization                           │ │
│  │ • Request Routing & Load Balancing                        │ │
│  │ • Rate Limiting & Throttling                              │ │
│  │ • Request/Response Transformation                         │ │
│  │ • Logging & Monitoring                                    │ │
│  │ • CORS & Security Headers                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
							 │
			┌────────────────┼────────────────┐
			│                │                │
			▼                ▼                ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Auth Service   │ │  User Service   │ │ Event Service   │
│   (Port 5001)   │ │   (Port 5002)   │ │  (Port 5003)    │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ • Registration  │ │ • User Profile  │ │ • Event CRUD    │
│ • Login         │ │ • Member List   │ │ • RSVP/Booking  │
│ • OAuth         │ │ • User Search   │ │ • Categories    │
│ • JWT Tokens    │ │ • Roles/Perms   │ │ • Trekking      │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
		 │                   │                   │
		 ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   AuthDB        │ │    UserDB       │ │   EventDB       │
│  (PostgreSQL)   │ │  (PostgreSQL)   │ │  (PostgreSQL)   │
└─────────────────┘ └─────────────────┘ └─────────────────┘

			│                │                │
			▼                ▼                ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│Discussion Svc   │ │Announcement Svc │ │Notification Svc │
│  (Port 5004)    │ │  (Port 5005)    │ │  (Port 5006)    │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ • Threads       │ │ • Announcements │ │ • Email         │
│ • Comments      │ │ • Categories    │ │ • Push          │
│ • Reactions     │ │ • Priority      │ │ • In-App        │
│ • Tags          │ │ • Attachments   │ │ • SMS           │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
		 │                   │                   │
		 ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  DiscussionDB   │ │ AnnouncementDB  │ │NotificationDB   │
│  (PostgreSQL)   │ │  (PostgreSQL)   │ │   (MongoDB)     │
└─────────────────┘ └─────────────────┘ └─────────────────┘

			│                │
			▼                ▼
┌─────────────────┐ ┌─────────────────┐
│ Analytics Svc   │ │  Media Service  │
│  (Port 5007)    │ │  (Port 5008)    │
├─────────────────┤ ├─────────────────┤
│ • Dashboard     │ │ • Upload        │
│ • Reports       │ │ • Resize        │
│ • Metrics       │ │ • Storage       │
│ • Statistics    │ │ • CDN           │
└────────┬────────┘ └────────┬────────┘
		 │                   │
		 ▼                   ▼
┌─────────────────┐ ┌─────────────────┐
│  AnalyticsDB    │ │    MediaDB      │
│  (TimeSeries)   │ │  (S3/Azure)     │
└─────────────────┘ └─────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    CROSS-CUTTING CONCERNS                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Message    │  │    Redis     │  │    Logging   │          │
│  │     Bus      │  │    Cache     │  │  (Seq/ELK)   │          │
│  │ (RabbitMQ)   │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Communication Patterns

#### Synchronous Communication
- **REST APIs**: Client → API Gateway → Microservices
- **gRPC**: Inter-service communication (optional, for high performance)

#### Asynchronous Communication
- **Message Queue (RabbitMQ)**: 
  - Event notifications
  - Email sending
  - Background jobs
  - Data synchronization

#### Real-time Communication
- **SignalR/WebSockets**: 
  - Live notifications
  - Real-time discussions
  - Event updates

---

## 3. Microservices Breakdown

### 3.1 Auth Service (CommunityConnect.Auth.API)
**Port**: 5001  
**Database**: AuthDB (PostgreSQL)

**Responsibilities**:
- User registration
- Email/Password authentication
- Google OAuth 2.0 integration
- JWT token generation and validation
- Password reset functionality
- Email verification
- Refresh token management

**Endpoints**:
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/google
POST   /api/auth/refresh-token
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
GET    /api/auth/validate-token
```

---

### 3.2 User Service (CommunityConnect.User.API)
**Port**: 5002  
**Database**: UserDB (PostgreSQL)

**Responsibilities**:
- User profile management
- Member directory
- User search and filtering
- Role and permission management
- User preferences
- Profile photos
- Batch and JNV information

**Endpoints**:
```
GET    /api/users
GET    /api/users/{id}
PUT    /api/users/{id}
DELETE /api/users/{id}
GET    /api/users/search
GET    /api/users/{id}/profile
PUT    /api/users/{id}/profile
POST   /api/users/{id}/avatar
GET    /api/users/roles
PUT    /api/users/{id}/roles
```

---

### 3.3 Event Service (CommunityConnect.Event.API)
**Port**: 5003  
**Database**: EventDB (PostgreSQL)

**Responsibilities**:
- Event creation, update, delete
- Event categories (General, Trekking, Workshop, etc.)
- RSVP and attendance management
- Event scheduling
- Trekking-specific features (difficulty, duration, etc.)
- Event search and filtering
- Capacity management

**Endpoints**:
```
GET    /api/events
POST   /api/events
GET    /api/events/{id}
PUT    /api/events/{id}
DELETE /api/events/{id}
POST   /api/events/{id}/rsvp
DELETE /api/events/{id}/rsvp
GET    /api/events/{id}/attendees
GET    /api/events/categories
GET    /api/events/trekking
POST   /api/events/trekking
GET    /api/events/search
```

---

### 3.4 Discussion Service (CommunityConnect.Discussion.API)
**Port**: 5004  
**Database**: DiscussionDB (PostgreSQL)

**Responsibilities**:
- Discussion thread creation
- Comments and replies
- Reactions (likes, votes)
- Thread categories/tags
- Pinned discussions
- Search and filtering
- Moderation

**Endpoints**:
```
GET    /api/discussions
POST   /api/discussions
GET    /api/discussions/{id}
PUT    /api/discussions/{id}
DELETE /api/discussions/{id}
POST   /api/discussions/{id}/comments
GET    /api/discussions/{id}/comments
POST   /api/discussions/{id}/reactions
GET    /api/discussions/categories
GET    /api/discussions/search
```

---

### 3.5 Announcement Service (CommunityConnect.Announcement.API)
**Port**: 5005  
**Database**: AnnouncementDB (PostgreSQL)

**Responsibilities**:
- Announcement creation and management
- Priority levels (High, Medium, Low)
- Categories
- Scheduled announcements
- Read/unread tracking
- Attachments

**Endpoints**:
```
GET    /api/announcements
POST   /api/announcements
GET    /api/announcements/{id}
PUT    /api/announcements/{id}
DELETE /api/announcements/{id}
POST   /api/announcements/{id}/mark-read
GET    /api/announcements/categories
GET    /api/announcements/unread
```

---

### 3.6 Notification Service (CommunityConnect.Notification.API)
**Port**: 5006  
**Database**: NotificationDB (MongoDB)

**Responsibilities**:
- Send email notifications
- Push notifications
- In-app notifications
- SMS notifications (optional)
- Notification preferences
- Notification history
- Template management

**Endpoints**:
```
GET    /api/notifications
GET    /api/notifications/{id}
PUT    /api/notifications/{id}/mark-read
DELETE /api/notifications/{id}
GET    /api/notifications/preferences
PUT    /api/notifications/preferences
POST   /api/notifications/send (Internal)
```

---

### 3.7 Analytics Service (CommunityConnect.Analytics.API)
**Port**: 5007  
**Database**: AnalyticsDB (TimescaleDB/InfluxDB)

**Responsibilities**:
- Dashboard statistics
- Event analytics
- User engagement metrics
- Reports generation
- Data aggregation
- Trends analysis

**Endpoints**:
```
GET    /api/analytics/dashboard
GET    /api/analytics/events
GET    /api/analytics/users
GET    /api/analytics/engagement
GET    /api/analytics/reports
POST   /api/analytics/reports/custom
```

---

### 3.8 Media Service (CommunityConnect.Media.API)
**Port**: 5008  
**Storage**: Azure Blob Storage / AWS S3

**Responsibilities**:
- Image upload and storage
- Image resizing and optimization
- Video storage
- Document storage
- CDN integration
- File validation

**Endpoints**:
```
POST   /api/media/upload
GET    /api/media/{id}
DELETE /api/media/{id}
GET    /api/media/user/{userId}
POST   /api/media/bulk-upload
```

---

## 4. Database Design

### Total Databases: **8 Databases**

#### Database List:
1. **AuthDB** (PostgreSQL)
2. **UserDB** (PostgreSQL)
3. **EventDB** (PostgreSQL)
4. **DiscussionDB** (PostgreSQL)
5. **AnnouncementDB** (PostgreSQL)
6. **NotificationDB** (MongoDB - for flexibility and scalability)
7. **AnalyticsDB** (TimescaleDB/InfluxDB - for time-series data)
8. **MediaDB** (Metadata in PostgreSQL, files in Blob Storage)

See **DATABASE_SCHEMAS.md** for detailed table structures.

---

## 5. Technology Stack

### Backend
- **Framework**: ASP.NET Core 8.0
- **Language**: C# 12
- **API Style**: RESTful APIs
- **Authentication**: JWT Bearer Tokens
- **Validation**: FluentValidation
- **Mapping**: AutoMapper
- **Documentation**: Swagger/OpenAPI

### Databases
- **Primary**: PostgreSQL 15+
- **Cache**: Redis 7+
- **NoSQL**: MongoDB 6+ (for notifications)
- **Time-Series**: TimescaleDB or InfluxDB

### Message Queue
- **Broker**: RabbitMQ 3.12+
- **Library**: MassTransit

### Storage
- **Cloud Storage**: Azure Blob Storage / AWS S3
- **CDN**: Azure CDN / AWS CloudFront

### Monitoring & Logging
- **Logging**: Serilog → Seq / ELK Stack
- **APM**: Application Insights / Prometheus + Grafana
- **Health Checks**: ASP.NET Core Health Checks

### DevOps
- **Containerization**: Docker
- **Orchestration**: Kubernetes / Docker Compose
- **CI/CD**: GitHub Actions / Azure DevOps
- **Repository**: GitHub

---

## 6. API Gateway Design

### 6.1 Gateway Responsibilities
1. **Authentication & Authorization**
   - Validate JWT tokens
   - Check user permissions
   - Refresh token handling

2. **Request Routing**
   - Route to appropriate microservice
   - Load balancing between instances
   - Circuit breaker pattern

3. **Rate Limiting**
   - Per-user limits
   - Per-endpoint limits
   - Protect backend services

4. **Request/Response Transformation**
   - Aggregate responses from multiple services
   - Transform data formats
   - Add/remove headers

5. **Cross-Cutting Concerns**
   - Logging all requests
   - CORS configuration
   - Security headers
   - Response caching

### 6.2 Gateway Technology
**Options**:
- **Ocelot** (Lightweight, .NET native)
- **YARP** (Yet Another Reverse Proxy - Microsoft)
- **Kong** (Feature-rich, with plugins)

**Recommendation**: Start with **Ocelot** for simplicity

### 6.3 Gateway Configuration Example
```json
{
  "Routes": [
	{
	  "DownstreamPathTemplate": "/api/auth/{everything}",
	  "DownstreamScheme": "http",
	  "DownstreamHostAndPorts": [
		{ "Host": "localhost", "Port": 5001 }
	  ],
	  "UpstreamPathTemplate": "/api/auth/{everything}",
	  "UpstreamHttpMethod": [ "Get", "Post", "Put", "Delete" ]
	},
	{
	  "DownstreamPathTemplate": "/api/users/{everything}",
	  "DownstreamScheme": "http",
	  "DownstreamHostAndPorts": [
		{ "Host": "localhost", "Port": 5002 }
	  ],
	  "UpstreamPathTemplate": "/api/users/{everything}",
	  "UpstreamHttpMethod": [ "Get", "Post", "Put", "Delete" ],
	  "AuthenticationOptions": {
		"AuthenticationProviderKey": "Bearer"
	  }
	}
  ],
  "GlobalConfiguration": {
	"RateLimitOptions": {
	  "EnableRateLimiting": true
	}
  }
}
```

---

## 7. Security & Authentication

### 7.1 Authentication Flow
```
1. User registers/logs in → Auth Service
2. Auth Service validates credentials
3. Generate JWT access token (15 min expiry)
4. Generate refresh token (7 days expiry)
5. Return both tokens to client
6. Client stores tokens (localStorage/cookie)
7. Client sends access token with each request
8. API Gateway validates token
9. On token expiry, use refresh token to get new access token
```

### 7.2 JWT Token Structure
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "roles": ["Member", "EventOrganizer"],
  "exp": 1234567890,
  "iss": "CommunityConnect",
  "aud": "CommunityConnect.API"
}
```

### 7.3 Security Best Practices
- ✅ Use HTTPS in production
- ✅ Hash passwords with BCrypt
- ✅ Validate all inputs
- ✅ Implement rate limiting
- ✅ Use parameterized queries (prevent SQL injection)
- ✅ Enable CORS properly
- ✅ Sanitize user-generated content
- ✅ Implement refresh token rotation
- ✅ Log all authentication attempts
- ✅ Use secrets management (Azure Key Vault / AWS Secrets Manager)

---

## 8. Deployment Strategy

### 8.1 Development Environment
```
Docker Compose with all services running locally
- API Gateway: localhost:5000
- Auth Service: localhost:5001
- User Service: localhost:5002
- Event Service: localhost:5003
- ...
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- RabbitMQ: localhost:5672
```

### 8.2 Staging Environment
```
Kubernetes cluster with:
- 1 replica per service
- Managed PostgreSQL (Azure Database / AWS RDS)
- Managed Redis
- Managed RabbitMQ (CloudAMQP)
```

### 8.3 Production Environment
```
Kubernetes cluster with:
- Multiple replicas (auto-scaling)
- Load balancers
- Managed databases with backups
- CDN for static content
- Monitoring and alerts
```

---

## 9. Development Roadmap

### Phase 1: Foundation (Weeks 1-3)
- ✅ Setup solution structure
- ✅ Create API Gateway project
- ✅ Create Auth Service
- ✅ Setup PostgreSQL databases
- ✅ Implement JWT authentication
- ✅ Create shared libraries (Common, Contracts)

### Phase 2: Core Services (Weeks 4-6)
- ✅ User Service implementation
- ✅ Event Service implementation
- ✅ Basic API Gateway routing
- ✅ Redis caching
- ✅ Docker compose setup

### Phase 3: Community Features (Weeks 7-9)
- ✅ Discussion Service
- ✅ Announcement Service
- ✅ Notification Service (basic)
- ✅ RabbitMQ integration

### Phase 4: Advanced Features (Weeks 10-12)
- ✅ Media Service
- ✅ Analytics Service
- ✅ Real-time features (SignalR)
- ✅ Advanced search

### Phase 5: Testing & Deployment (Weeks 13-14)
- ✅ Unit tests
- ✅ Integration tests
- ✅ Load testing
- ✅ CI/CD pipeline
- ✅ Production deployment

---

## 10. Getting Started

See **BACKEND_DEVELOPER_GUIDE.md** for step-by-step implementation instructions.

---

## 📚 Additional Documentation
- `DATABASE_SCHEMAS.md` - Detailed database table structures
- `BACKEND_DEVELOPER_GUIDE.md` - Implementation guide for developers
- `API_CONTRACTS.md` - API request/response contracts
- `DEPLOYMENT_GUIDE.md` - Deployment instructions

---

**Version**: 1.0  
**Last Updated**: 2024  
**Author**: CommunityConnect Team
