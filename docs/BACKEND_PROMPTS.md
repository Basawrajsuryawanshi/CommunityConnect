# Backend Developer Prompts & Tasks

## 🎯 Overview
This document contains **ready-to-use prompts** for implementing the CommunityConnect backend. Use these with AI assistants (ChatGPT, GitHub Copilot, Claude) or as task descriptions for your development team.

---

## 📋 Setup Tasks

### Task 1: Initial Project Setup
```
Create a .NET 8 microservices solution for CommunityConnect with the following structure:
- API Gateway using Ocelot
- Auth Service (authentication and authorization)
- User Service (user profiles and management)
- Event Service (events and trekking management)
- Discussion Service (forums and discussions)
- Announcement Service (community announcements)
- Notification Service (email, push, in-app notifications)
- Media Service (file uploads and storage)
- Analytics Service (metrics and reporting)
- Shared libraries for common code and contracts

Each service should follow Clean Architecture with:
- API layer (controllers, middleware)
- Core layer (domain models, interfaces)
- Infrastructure layer (data access, external services)

Include proper .gitignore for .NET projects.
```

### Task 2: Database Setup
```
Set up PostgreSQL databases for a microservices architecture with the following databases:

1. AuthDB - for authentication (users, passwords, tokens, OAuth)
2. UserDB - for user profiles (personal info, roles, preferences)
3. EventDB - for events (general events, trekking expeditions, RSVPs)
4. DiscussionDB - for discussions (threads, comments, reactions)
5. AnnouncementDB - for announcements (posts, categories, read status)
6. MediaDB - for media files metadata
7. NotificationDB - MongoDB for notifications (flexible schema)
8. AnalyticsDB - TimescaleDB for time-series analytics data

Create schema scripts with proper indexes, foreign keys, and constraints.
Include seed data for categories and default roles.
```

---

## 🔐 Auth Service Tasks

### Task 3: Implement JWT Authentication
```
Implement JWT-based authentication in ASP.NET Core with:
- User registration with email and password
- Login with email/password
- JWT access token generation (15-minute expiry)
- Refresh token mechanism (7-day expiry with rotation)
- Password hashing using BCrypt
- Email verification flow
- Password reset flow
- Token validation middleware
- Logout (token revocation)

Include proper error handling, validation, and security best practices.
Store sensitive configuration in appsettings.json with options for Azure Key Vault.
```

### Task 4: Implement Google OAuth
```
Add Google OAuth 2.0 authentication to the Auth Service:
- Google sign-in endpoint
- Verify Google ID token
- Create or link user account
- Generate JWT tokens after successful OAuth
- Store OAuth provider info (provider, provider user ID)
- Handle OAuth token refresh

Use Google.Apis.Auth.AspNetCore library.
Support both new user registration and existing user login via Google.
```

### Task 5: Implement Role-Based Authorization
```
Implement role-based access control (RBAC):
- Define roles: Admin, Moderator, EventOrganizer, Member
- Create middleware to check user roles from JWT claims
- Add [Authorize(Roles = "Admin,Moderator")] attributes
- Implement policy-based authorization for complex scenarios
- Create endpoints to:
  - Get user roles
  - Assign roles to users (Admin only)
  - Remove roles from users (Admin only)

Store roles in UserDB and include them in JWT token claims.
```

---

## 👤 User Service Tasks

### Task 6: User Profile Management
```
Implement user profile management with:
- Get user profile by ID
- Update user profile (name, bio, avatar, contact info)
- Get list of all users (with pagination, search, filters)
- Search users by name, email, batch, JNV
- Upload profile avatar (integrate with Media Service)
- Delete user account (soft delete)
- User preferences (notifications, theme, language)

Include DTOs for requests/responses, AutoMapper for mapping, FluentValidation for input validation.
Support filtering by: Batch, JNV, City, Role.
```

### Task 7: Member Directory with Advanced Search
```
Create a comprehensive member directory with:
- Pagination support (skip, take)
- Full-text search on name, email
- Filters:
  - By JNV (Jawahar Navodaya Vidyalaya)
  - By batch year
  - By city/state
  - By role
- Sorting options (name, join date, batch)
- Return user profiles with: name, avatar, batch, JNV, bio, social links

Optimize queries with proper indexes.
Cache frequently accessed data using Redis.
```

---

## 📅 Event Service Tasks

### Task 8: Event CRUD Operations
```
Implement event management with:
- Create event (title, description, category, date/time, location, capacity, pricing)
- Update event
- Delete event (soft delete)
- Get event by ID (with full details)
- List events with pagination and filters
- Event categories (Workshop, Trekking, Networking, Sports, Cultural, Social)
- Event status: Draft, Published, Cancelled, Completed
- Support both online and in-person events
- Image upload for event banner

Validate:
- End date must be after start date
- Registration deadline before event start
- Capacity constraints
```

### Task 9: Event RSVP System
```
Implement event RSVP functionality:
- RSVP to event (Going, Interested, Not Going)
- Cancel RSVP
- Waitlist support (when event is full)
- Check-in functionality (track actual attendance)
- Get list of attendees for an event
- Booking reference generation
- Payment integration preparation (status tracking)
- Email confirmation on RSVP (trigger notification)
- Prevent over-booking (enforce capacity limits)

Include business logic:
- Can't RSVP after registration deadline
- Can't RSVP if event is full (unless waitlist enabled)
- Auto-promote from waitlist when someone cancels
```

### Task 10: Trekking Events (Special Event Type)
```
Extend Event Service for trekking expeditions:
- TrekkingDetails entity with:
  - Difficulty level (Easy, Moderate, Hard, Expert)
  - Duration in days
  - Distance in kilometers
  - Maximum altitude
  - Trek route description
  - Required equipment list
  - Provided equipment list
  - Age restrictions (min/max)
  - Fitness level requirement
  - Itinerary (day-by-day JSON)
  - Guide information
  - Medical support availability
  - Insurance inclusion

Create specialized endpoints for trekking events:
- GET /api/events/trekking (list all treks)
- POST /api/events/trekking (create trek)
- Filter by difficulty, duration, max altitude
```

---

## 💬 Discussion Service Tasks

### Task 11: Discussion Forum
```
Implement a discussion forum with:
- Create discussion thread (title, content, category, tags)
- Update/delete discussion (only by author or moderators)
- Get discussion by ID (with all details)
- List discussions (paginated, filtered, sorted)
- Discussion categories
- Pin/unpin discussions (moderators only)
- Lock/unlock discussions (moderators only)
- View count tracking
- Last activity tracking
- Tags support (array of strings)

Filters: by category, by tags, by author, by status (active/closed/pinned)
Sorting: by date, by popularity (view count + comment count), by last activity
```

### Task 12: Comments and Nested Replies
```
Implement commenting system with:
- Add comment to discussion
- Reply to comment (nested replies, one level deep)
- Edit comment (only by author)
- Delete comment (soft delete, by author or moderator)
- Like/unlike comment
- Get comments for discussion (with pagination)
- Load more replies for a comment

Return comments in tree structure.
Show like count.
Include author info (name, avatar).
```

### Task 13: Reactions System
```
Add reactions to discussions and comments:
- Reaction types: Like, Love, Helpful, Insightful
- Add reaction to discussion/comment
- Remove reaction
- Get reaction counts for a discussion/comment
- Prevent duplicate reactions from same user
- Real-time update of reaction counts (prepare for SignalR)

Store efficiently using composite key (user, target type, target ID).
```

---

## 📢 Announcement Service Tasks

### Task 14: Announcement Management
```
Implement announcement system:
- Create announcement (title, content, category, priority)
- Update announcement
- Delete announcement (soft delete)
- Get announcement by ID
- List announcements (paginated, filtered)
- Priority levels: Low, Normal, High, Critical
- Schedule announcements (publish at specific time)
- Expiration dates for announcements
- Target audience (by role, batch, JNV)
- Attachment support (integrate with Media Service)
- View count tracking

Auto-publish scheduled announcements using background job.
Send notifications when new announcement is published.
```

### Task 15: Read/Unread Tracking
```
Implement read tracking for announcements:
- Mark announcement as read (per user)
- Get unread count for user
- Get list of unread announcements
- Track who has read each announcement
- Analytics: read percentage for each announcement

Optimize querying for large user base.
Use indexing appropriately.
```

---

## 🔔 Notification Service Tasks

### Task 16: Multi-Channel Notifications
```
Implement notification system supporting:
- Email notifications (using SendGrid or SMTP)
- Push notifications (using Firebase Cloud Messaging)
- In-app notifications
- SMS notifications (optional, using Twilio)

Notification categories:
- Event reminders
- New announcements
- Discussion replies
- RSVP confirmations
- System alerts

Include:
- Notification templates with placeholders
- User preferences (which channels to use)
- Notification history
- Read/unread status
- Mark as read/unread
- Delete notifications

Use message queue (RabbitMQ) for async processing.
Implement retry logic for failed sends.
```

### Task 17: Email Templates
```
Create email templates for:
- Welcome email (on registration)
- Email verification
- Password reset
- Event RSVP confirmation
- Event reminder (1 day before)
- New announcement notification
- Discussion reply notification

Use Razor templates or Handlebars.
Include variables: {{userName}}, {{eventName}}, {{eventDate}}, etc.
Support HTML and plain text versions.
Include unsubscribe link.
```

---

## 📊 Analytics Service Tasks

### Task 18: Dashboard Analytics
```
Implement analytics for community dashboard:
- Total users count
- Active users (last 30 days)
- Total events count
- Upcoming events count
- Total discussions count
- Total announcements count
- Event attendance rate
- Most popular event categories
- Most active discussion categories
- User growth over time (chart data)
- Event registrations over time

Optimize for read performance.
Cache results in Redis with periodic refresh.
Return data in format suitable for charts (labels, values).
```

### Task 19: User Engagement Metrics
```
Track user engagement:
- Login frequency
- Profile views
- Events attended
- Discussions created
- Comments posted
- Announcements read
- Time spent on platform (estimate)

Use TimescaleDB for efficient time-series queries.
Create materialized views for common aggregations.
Support date range filtering.
```

---

## 📁 Media Service Tasks

### Task 20: File Upload and Storage
```
Implement media upload service:
- Upload image (profile avatars, event banners)
- Upload document (announcement attachments)
- Upload video (event recordings)
- File validation (type, size limits)
- Virus scanning (optional)
- Generate unique filenames
- Store metadata in database
- Store files in Azure Blob Storage or AWS S3
- Generate CDN URLs
- Image resizing (thumbnails, different sizes)
- Delete file

Support max file sizes:
- Images: 5 MB
- Documents: 10 MB
- Videos: 100 MB

Return URL for accessing the file.
Implement signed URLs for private files.
```

---

## 🌐 API Gateway Tasks

### Task 21: Setup API Gateway with Ocelot
```
Configure Ocelot API Gateway:
- Route requests to appropriate microservices
- Aggregate responses from multiple services
- Authentication (JWT validation)
- Rate limiting (per user, per IP)
- CORS configuration
- Request/response logging
- Health checks for downstream services
- Load balancing between service instances
- Circuit breaker pattern (handle service failures)

Configuration for routes:
- /api/auth/** → Auth Service (port 5001)
- /api/users/** → User Service (port 5002)
- /api/events/** → Event Service (port 5003)
- /api/discussions/** → Discussion Service (port 5004)
- /api/announcements/** → Announcement Service (port 5005)
- /api/notifications/** → Notification Service (port 5006)
- /api/analytics/** → Analytics Service (port 5007)
- /api/media/** → Media Service (port 5008)

Public routes (no auth): /api/auth/login, /api/auth/register, /api/auth/google
Protected routes: everything else
```

---

## 🔄 Message Queue Tasks

### Task 22: RabbitMQ Integration with MassTransit
```
Set up RabbitMQ message bus using MassTransit:
- Configure RabbitMQ connection
- Create message contracts (events):
  - UserRegisteredEvent
  - EventCreatedEvent
  - EventRSVPEvent
  - AnnouncementPublishedEvent
  - DiscussionReplyEvent

Implement publishers:
- Auth Service: publish UserRegisteredEvent
- Event Service: publish EventCreatedEvent, EventRSVPEvent
- Announcement Service: publish AnnouncementPublishedEvent
- Discussion Service: publish DiscussionReplyEvent

Implement consumers:
- Notification Service: consume all events and send appropriate notifications
- Analytics Service: consume events for metrics tracking

Handle failures with retry policies.
Use dead letter queues for failed messages.
```

---

## 🧪 Testing Tasks

### Task 23: Unit Tests
```
Write unit tests for:
- Auth Service: registration, login, token generation
- User Service: profile CRUD operations
- Event Service: event creation, RSVP logic
- Discussion Service: thread creation, commenting

Use xUnit, Moq for mocking, FluentAssertions.
Aim for 80%+ code coverage on business logic.
Mock database context using in-memory database.
```

### Task 24: Integration Tests
```
Write integration tests:
- Test full auth flow (register → login → access protected endpoint)
- Test event creation + RSVP flow
- Test announcement creation + notification sending
- Test discussion creation + commenting

Use WebApplicationFactory for testing.
Use test database (Docker PostgreSQL container).
Clean up test data after each test.
```

---

## 🚀 Deployment Tasks

### Task 25: Docker Containerization
```
Create Dockerfiles for each service:
- Multi-stage build (build, publish, runtime)
- Use mcr.microsoft.com/dotnet/aspnet:8.0 as base
- Optimize image size
- Set proper working directory
- Expose appropriate ports
- Set environment variables

Create docker-compose.yml for local development:
- All microservices
- PostgreSQL
- Redis
- RabbitMQ
- MongoDB

Include docker-compose.override.yml for dev settings.
```

### Task 26: CI/CD Pipeline (GitHub Actions)
```
Create GitHub Actions workflow:
- Trigger on: push to main, pull requests
- Steps:
  1. Checkout code
  2. Setup .NET 8
  3. Restore dependencies
  4. Build solution
  5. Run unit tests
  6. Run integration tests
  7. Build Docker images
  8. Push to Docker registry
  9. Deploy to staging (on main branch)
  10. Deploy to production (on release tags)

Include:
- Code quality checks (dotnet format)
- Security scanning
- Automated PR reviews
```

### Task 27: Azure Deployment
```
Deploy to Azure:
- Azure Container Apps for microservices
- Azure Database for PostgreSQL
- Azure Cache for Redis
- Azure Storage for media files
- Azure Service Bus (alternative to RabbitMQ)
- Azure Application Insights for monitoring
- Azure Key Vault for secrets

Create IaC scripts (Bicep or Terraform).
Setup staging and production environments.
Configure auto-scaling rules.
Setup alerts and monitoring.
```

---

## 📚 Documentation Tasks

### Task 28: API Documentation
```
Create comprehensive API documentation:
- Use Swagger/OpenAPI for each service
- Include request/response examples
- Document all error codes and messages
- Authentication requirements
- Rate limit information
- Provide Postman collection

Generate documentation site using:
- Swagger UI (built-in)
- Or ReDoc
- Or API Blueprint

Include quick start guide for developers.
```

### Task 29: Architecture Documentation
```
Document the architecture:
- System architecture diagram
- Database schema diagrams (ERDs)
- Sequence diagrams for key flows:
  - User registration and login
  - Event creation and RSVP
  - Announcement publishing and notification
  - Discussion thread with comments
- Deployment architecture
- Security model
- Scalability strategy

Use:
- Draw.io or Lucidchart for diagrams
- Markdown for text documentation
- PlantUML for code-as-diagram
```

---

## 🔒 Security Tasks

### Task 30: Security Hardening
```
Implement security best practices:
- Use HTTPS only in production
- Implement CORS properly (restrict origins)
- Add security headers (HSTS, CSP, X-Frame-Options)
- Encrypt sensitive data at rest
- Hash passwords with strong algorithm (BCrypt)
- Implement rate limiting on auth endpoints
- Validate all inputs (use FluentValidation)
- Sanitize user-generated content (prevent XSS)
- Use parameterized queries (prevent SQL injection)
- Implement CSRF protection for cookies
- Use secrets management (Azure Key Vault)
- Rotate secrets regularly
- Implement audit logging for sensitive operations
- Add IP-based blocking for suspicious activities
- Implement account lockout after failed login attempts

Run security audit tools:
- OWASP Dependency Check
- SonarQube
- Snyk
```

---

## 📊 Monitoring Tasks

### Task 31: Logging and Monitoring
```
Set up comprehensive logging:
- Use Serilog for structured logging
- Log levels: Debug, Info, Warning, Error, Fatal
- Log request/response for APIs
- Log performance metrics
- Send logs to centralized logging (Seq or ELK Stack)

Implement Application Performance Monitoring:
- Integrate Azure Application Insights or Datadog
- Track:
  - Request rates
  - Response times
  - Error rates
  - Database query performance
  - External API calls
- Set up alerts for:
  - High error rates
  - Slow response times
  - High CPU/memory usage
  - Database connection pool exhaustion

Create dashboards in Grafana or Azure Portal.
```

---

## 🎛️ Advanced Features Tasks

### Task 32: Real-time Features with SignalR
```
Implement real-time features using SignalR:
- Real-time notifications (new announcement, event update)
- Live discussion updates (new comments)
- Online user presence
- Typing indicators in discussions
- Real-time analytics dashboard updates

Create SignalR hubs:
- NotificationHub
- DiscussionHub
- AnalyticsHub

Allow frontend to subscribe to specific channels.
Handle connection lifecycle (connect, disconnect, reconnect).
Scale with Redis backplane for multiple server instances.
```

### Task 33: Search with Elasticsearch
```
Implement advanced search using Elasticsearch:
- Index users, events, discussions, announcements
- Full-text search across all entities
- Fuzzy matching for typos
- Faceted search (filters)
- Autocomplete suggestions
- Search result highlighting
- Search analytics (popular searches)

Create background job to:
- Sync data from PostgreSQL to Elasticsearch
- Handle incremental updates
- Rebuild indexes periodically

Provide unified search API endpoint.
```

### Task 34: Caching Strategy
```
Implement caching with Redis:
- Cache frequently accessed data:
  - User profiles
  - Event lists
  - Announcement lists
  - Dashboard analytics
- Set appropriate TTLs (Time To Live):
  - User profiles: 5 minutes
  - Event lists: 1 minute
  - Analytics: 10 minutes
- Implement cache invalidation on updates
- Use cache-aside pattern
- Implement distributed caching for shared state
- Add cache hit/miss metrics

Create caching middleware or use:
- ResponseCaching middleware
- OutputCache (new in .NET 8)
```

---

## 🔧 Utilities & Helper Tasks

### Task 35: Common Libraries
```
Create shared libraries used across services:

CommunityConnect.Common:
- Extensions (string, datetime, IEnumerable)
- Validators (email, phone, URL)
- Constants (roles, statuses)
- Helpers (pagination, filtering, sorting)
- Custom exceptions
- Result pattern (Success/Failure wrapper)

CommunityConnect.Contracts:
- DTOs for all services
- Request/Response models
- Shared interfaces
- Message contracts (events)

Keep these packages lightweight with minimal dependencies.
```

### Task 36: Background Jobs
```
Implement background jobs using Hangfire:
- Schedule event reminders (1 day before, 1 hour before)
- Send digest emails (daily/weekly summaries)
- Clean up expired refresh tokens
- Archive old discussions
- Generate reports
- Sync data between services
- Process pending notifications
- Cleanup temporary files

Create a dedicated BackgroundJobs service or host in API Gateway.
Use cron expressions for scheduling.
Implement job retries with exponential backoff.
Monitor job execution in Hangfire dashboard.
```

---

## ✅ Checklist for Backend Developer

Use this checklist to track progress:

### Setup & Configuration
- [ ] Solution structure created
- [ ] All services scaffolded
- [ ] NuGet packages installed
- [ ] PostgreSQL databases created
- [ ] Database schemas applied
- [ ] Seed data inserted
- [ ] Redis configured
- [ ] RabbitMQ configured

### Core Services
- [ ] Auth Service (register, login, JWT, refresh token)
- [ ] Auth Service (Google OAuth)
- [ ] User Service (profile CRUD)
- [ ] User Service (search & filters)
- [ ] Event Service (CRUD)
- [ ] Event Service (RSVP)
- [ ] Event Service (Trekking)
- [ ] Discussion Service (threads)
- [ ] Discussion Service (comments)
- [ ] Discussion Service (reactions)
- [ ] Announcement Service (CRUD)
- [ ] Announcement Service (read tracking)

### Advanced Features
- [ ] Notification Service (email)
- [ ] Notification Service (push)
- [ ] Notification Service (in-app)
- [ ] Media Service (upload)
- [ ] Media Service (storage)
- [ ] Analytics Service (dashboard)
- [ ] Analytics Service (metrics)

### Infrastructure
- [ ] API Gateway (Ocelot)
- [ ] Message Queue (RabbitMQ + MassTransit)
- [ ] Caching (Redis)
- [ ] Logging (Serilog)
- [ ] Health checks

### Testing & Quality
- [ ] Unit tests (>80% coverage)
- [ ] Integration tests
- [ ] API documentation (Swagger)
- [ ] Postman collection

### Security & Performance
- [ ] JWT authentication implemented
- [ ] Role-based authorization
- [ ] Input validation (FluentValidation)
- [ ] Security headers
- [ ] Rate limiting
- [ ] Caching strategy

### DevOps
- [ ] Dockerfiles created
- [ ] Docker Compose for local dev
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Deployment scripts

### Documentation
- [ ] README with setup instructions
- [ ] API documentation
- [ ] Architecture diagrams
- [ ] Database ERDs

---

## 🎓 Learning Resources for Backend Developer

### Official Documentation
- [.NET Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)

### Video Tutorials
- [.NET Microservices by Microsoft](https://www.youtube.com/watch?v=CqCDOosvZIk)
- [Clean Architecture by Jason Taylor](https://www.youtube.com/watch?v=dK4Yb6-LxAk)
- [API Gateway with Ocelot](https://www.youtube.com/watch?v=m2geHgzRFrk)

### Sample Projects
- [eShopOnContainers](https://github.com/dotnet-architecture/eShopOnContainers) - Microsoft's reference microservices app
- [Clean Architecture Solution Template](https://github.com/jasontaylordev/CleanArchitecture)

---

**These prompts are ready to use with AI assistants or as developer tasks!**
