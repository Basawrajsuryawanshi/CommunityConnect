# CommunityConnect - Quick Reference Guide

## 🎯 At a Glance

### System Type
**Microservices Architecture** with API Gateway pattern

### Technology Stack
- **Backend**: ASP.NET Core 8, C# 12
- **Databases**: PostgreSQL, MongoDB, TimescaleDB
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Storage**: Azure Blob / AWS S3
- **API Gateway**: Ocelot

---

## 📊 Services Overview

| Service | Port | Database | Purpose |
|---------|------|----------|---------|
| **API Gateway** | 5000 | - | Entry point, routing, auth |
| **Auth Service** | 5001 | AuthDB (PostgreSQL) | Registration, login, JWT, OAuth |
| **User Service** | 5002 | UserDB (PostgreSQL) | User profiles, roles, search |
| **Event Service** | 5003 | EventDB (PostgreSQL) | Events, RSVP, trekking |
| **Discussion Service** | 5004 | DiscussionDB (PostgreSQL) | Forums, threads, comments |
| **Announcement Service** | 5005 | AnnouncementDB (PostgreSQL) | Announcements, notifications |
| **Notification Service** | 5006 | NotificationDB (MongoDB) | Email, push, in-app alerts |
| **Analytics Service** | 5007 | AnalyticsDB (TimescaleDB) | Metrics, reports, dashboard |
| **Media Service** | 5008 | MediaDB (PostgreSQL) + Blob | File uploads, images |

---

## 🗄️ Database Summary

### Total Databases: 8

1. **AuthDB** (PostgreSQL)
   - Users, RefreshTokens, OAuthProviders, LoginAttempts
   - Purpose: Authentication credentials

2. **UserDB** (PostgreSQL)
   - UserProfiles, Roles, UserRoleAssignments, UserPreferences, UserConnections
   - Purpose: User information and relationships

3. **EventDB** (PostgreSQL)
   - Events, EventCategories, TrekkingDetails, EventRSVPs, EventReviews
   - Purpose: Event management

4. **DiscussionDB** (PostgreSQL)
   - Discussions, DiscussionCategories, Comments, Reactions
   - Purpose: Community forums

5. **AnnouncementDB** (PostgreSQL)
   - Announcements, AnnouncementCategories, AnnouncementReads
   - Purpose: Community bulletins

6. **NotificationDB** (MongoDB)
   - Notifications, NotificationTemplates
   - Purpose: Multi-channel notifications (NoSQL for flexibility)

7. **AnalyticsDB** (TimescaleDB)
   - EventMetrics, UserEngagement
   - Purpose: Time-series analytics data

8. **MediaDB** (PostgreSQL + Blob Storage)
   - MediaFiles (metadata)
   - Purpose: File storage metadata

---

## 🔄 Key Workflows

### User Registration Flow
```
1. Frontend → API Gateway → Auth Service
2. Auth Service validates email/password
3. Hash password with BCrypt
4. Save to AuthDB
5. Create profile in UserDB (via message queue)
6. Send verification email (Notification Service)
7. Return JWT tokens
```

### Event RSVP Flow
```
1. Frontend → API Gateway → Event Service
2. Event Service checks capacity
3. Create RSVP record in EventDB
4. Publish EventRSVPEvent to message queue
5. Notification Service sends confirmation email
6. Analytics Service records metric
```

### Announcement Publishing Flow
```
1. Admin creates announcement → Announcement Service
2. Save to AnnouncementDB
3. Publish AnnouncementPublishedEvent
4. Notification Service receives event
5. Query User Service for target users
6. Send notifications (email/push/in-app)
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "roles": ["Member", "EventOrganizer"],
  "exp": 1234567890,
  "iss": "CommunityConnect",
  "aud": "CommunityConnect.API"
}
```

### Token Expiration
- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

### Roles
- **Admin**: Full system access
- **Moderator**: Content moderation
- **EventOrganizer**: Create/manage events
- **Member**: Default user role

---

## 📡 API Endpoints Summary

### Auth Service (5001)
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/google
POST   /api/auth/refresh-token
POST   /api/auth/logout
```

### User Service (5002)
```
GET    /api/users
GET    /api/users/{id}
PUT    /api/users/{id}
GET    /api/users/search?q={query}&batch={year}
PUT    /api/users/{id}/profile
POST   /api/users/{id}/avatar
```

### Event Service (5003)
```
GET    /api/events
POST   /api/events
GET    /api/events/{id}
PUT    /api/events/{id}
POST   /api/events/{id}/rsvp
GET    /api/events/trekking
POST   /api/events/trekking
```

### Discussion Service (5004)
```
GET    /api/discussions
POST   /api/discussions
GET    /api/discussions/{id}
POST   /api/discussions/{id}/comments
POST   /api/discussions/{id}/reactions
```

### Announcement Service (5005)
```
GET    /api/announcements
POST   /api/announcements
GET    /api/announcements/{id}
GET    /api/announcements/unread
POST   /api/announcements/{id}/mark-read
```

### Notification Service (5006)
```
GET    /api/notifications
GET    /api/notifications/unread
PUT    /api/notifications/{id}/mark-read
PUT    /api/notifications/preferences
```

### Analytics Service (5007)
```
GET    /api/analytics/dashboard
GET    /api/analytics/events
GET    /api/analytics/users
```

### Media Service (5008)
```
POST   /api/media/upload
GET    /api/media/{id}
DELETE /api/media/{id}
```

---

## 🏗️ Clean Architecture Layers

Each service follows this structure:

### 1. API Layer
- Controllers
- Middleware
- Filters
- DTOs (Request/Response)

### 2. Core Layer
- Domain Entities
- Business Logic
- Interfaces
- Domain Services

### 3. Infrastructure Layer
- DbContext (Entity Framework)
- Repositories
- External Service Clients
- Message Queue Publishers/Consumers

### 4. Shared Libraries
- **Common**: Utilities, extensions, helpers
- **Contracts**: Shared DTOs, interfaces, events

---

## 📦 NuGet Packages (Common)

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" />
<PackageReference Include="FluentValidation.AspNetCore" />
<PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" />
<PackageReference Include="Swashbuckle.AspNetCore" />
<PackageReference Include="Serilog.AspNetCore" />
<PackageReference Include="MassTransit.RabbitMQ" />
```

---

## 🐳 Docker Compose (Development)

```yaml
services:
  postgres:
	image: postgres:15
	ports: ["5432:5432"]

  redis:
	image: redis:7-alpine
	ports: ["6379:6379"]

  rabbitmq:
	image: rabbitmq:3-management
	ports: ["5672:5672", "15672:15672"]

  auth-service:
	build: ./src/Services/Auth/CommunityConnect.Auth.API
	ports: ["5001:80"]

  user-service:
	build: ./src/Services/User/CommunityConnect.User.API
	ports: ["5002:80"]

  # ... other services
```

---

## 📈 Scaling Strategy

### Horizontal Scaling
- Run multiple instances of each service
- Use load balancer (Kubernetes, Azure Load Balancer)
- Redis for distributed caching
- RabbitMQ for async processing

### Database Scaling
- Read replicas for heavy read operations
- Partitioning/Sharding for large tables
- Connection pooling
- Caching frequently accessed data

### CDN
- Serve static assets (images, videos) from CDN
- Reduce latency for global users

---

## 🔍 Monitoring & Observability

### Metrics to Track
- Request rate (requests/second)
- Response time (p50, p95, p99)
- Error rate (%)
- CPU and memory usage
- Database query performance
- Cache hit rate

### Tools
- **Logs**: Serilog → Seq / ELK Stack
- **APM**: Application Insights / Datadog
- **Metrics**: Prometheus + Grafana
- **Tracing**: OpenTelemetry

### Alerts
- High error rate (> 5%)
- Slow response time (> 2s)
- High CPU usage (> 80%)
- Database connection pool full

---

## 🧪 Testing Strategy

### Unit Tests (80% coverage target)
- Test business logic in Core layer
- Mock dependencies (repositories, external services)
- Use xUnit, Moq, FluentAssertions

### Integration Tests
- Test API endpoints end-to-end
- Use test database (Docker container)
- Test authentication flow
- Test inter-service communication

### Load Tests
- Use JMeter or k6
- Simulate 1000 concurrent users
- Identify bottlenecks
- Test auto-scaling

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Security scan passed
- [ ] Database migrations ready
- [ ] Environment variables configured
- [ ] Secrets stored in Key Vault

### Deployment
- [ ] Deploy to staging first
- [ ] Run smoke tests
- [ ] Check logs for errors
- [ ] Perform manual testing
- [ ] Deploy to production
- [ ] Monitor for 30 minutes post-deployment

### Post-Deployment
- [ ] Verify all services healthy
- [ ] Check error rates
- [ ] Review performance metrics
- [ ] Communicate to team

---

## 🆘 Troubleshooting

### Service Not Starting
1. Check logs for errors
2. Verify database connection string
3. Ensure dependencies (DB, Redis) are running
4. Check port conflicts

### Authentication Failing
1. Verify JWT secret key matches across services
2. Check token expiration
3. Ensure user exists in AuthDB
4. Verify CORS settings

### Database Connection Errors
1. Check connection string
2. Verify database exists
3. Check firewall rules
4. Test connection using psql/pgAdmin

### High Response Times
1. Check database query performance
2. Add indexes to frequently queried columns
3. Implement caching
4. Optimize N+1 queries

---

## 📞 Support Resources

### Documentation
- Architecture Design: `docs/ARCHITECTURE_DESIGN.md`
- Database Schemas: `docs/DATABASE_SCHEMAS.md`
- Developer Guide: `docs/BACKEND_DEVELOPER_GUIDE.md`
- Prompts: `docs/BACKEND_PROMPTS.md`

### Code Examples
- Auth Service implementation
- Entity Framework configuration
- API controller patterns
- Message queue integration

### External Resources
- [.NET Documentation](https://docs.microsoft.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Microservices Patterns](https://microservices.io/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## 🎓 Team Onboarding

### Day 1
- Setup development environment
- Clone repository
- Run Docker Compose
- Explore solution structure

### Week 1
- Understand domain models
- Review database schemas
- API endpoint testing with Postman
- Read architecture documentation

### Week 2
- Implement first feature (small bug fix)
- Write tests
- Code review process
- Deploy to staging

---

## 📏 Coding Standards

### Naming Conventions
- **Classes**: PascalCase (UserProfile, EventService)
- **Methods**: PascalCase (GetUserById, CreateEvent)
- **Variables**: camelCase (userId, eventList)
- **Constants**: UPPER_SNAKE_CASE (MAX_FILE_SIZE)

### Code Structure
```csharp
// 1. Using statements
using System;
using CommunityConnect.Core;

// 2. Namespace
namespace CommunityConnect.User.API.Controllers
{
	// 3. Class with XML comments
	/// <summary>
	/// Handles user-related operations
	/// </summary>
	public class UserController : ControllerBase
	{
		// 4. Private fields
		private readonly IUserService _userService;

		// 5. Constructor
		public UserController(IUserService userService)
		{
			_userService = userService;
		}

		// 6. Public methods
		[HttpGet]
		public async Task<IActionResult> GetUsers()
		{
			// Implementation
		}
	}
}
```

### Git Commit Messages
```
feat: Add user profile update endpoint
fix: Resolve null reference in event RSVP
refactor: Extract auth logic into service
docs: Update API documentation
test: Add unit tests for UserService
```

---

## 🎯 Success Metrics

### Performance Targets
- API response time: < 200ms (p95)
- Database query time: < 50ms
- Page load time: < 2s
- Uptime: 99.9%

### Quality Targets
- Code coverage: > 80%
- Critical bugs: 0
- Security vulnerabilities: 0
- Documentation: 100% of APIs

---

**Quick Reference Version 1.0 | Last Updated: 2024**
