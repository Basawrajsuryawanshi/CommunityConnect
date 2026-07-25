# CommunityConnect - Visual Architecture Diagrams

## 🏗️ System Architecture Diagrams

### 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATIONS                       │
│  ┏━━━━━━━━━━━┓  ┏━━━━━━━━━━━┓  ┏━━━━━━━━━━━┓                 │
│  ┃  React    ┃  ┃  Mobile    ┃  ┃   Admin   ┃                 │
│  ┃   Web     ┃  ┃    App     ┃  ┃   Panel   ┃                 │
│  ┗━━━━━┯━━━━━┛  ┗━━━━━┯━━━━━┛  ┗━━━━━┯━━━━━┛                 │
└────────┼──────────────┼──────────────┼──────────────────────────┘
		 │              │              │
		 └──────────────┴──────────────┘
						│
						│ HTTPS
						▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Ocelot)                          │
│                       Port: 5000                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • Authentication & Authorization (JWT Validation)        │  │
│  │ • Request Routing & Load Balancing                       │  │
│  │ • Rate Limiting & Throttling                            │  │
│  │ • CORS Configuration                                     │  │
│  │ • Response Caching                                       │  │
│  │ • Logging & Monitoring                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
						│
		┌───────────────┼───────────────┐
		│               │               │
		▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Auth Service │ │ User Service │ │Event Service │
│  Port: 5001  │ │  Port: 5002  │ │  Port: 5003  │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
	   │                │                │
	   ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│    AuthDB    │ │    UserDB    │ │   EventDB    │
│ (PostgreSQL) │ │ (PostgreSQL) │ │ (PostgreSQL) │
└──────────────┘ └──────────────┘ └──────────────┘

		│               │               │
		▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Discussion  │ │Announcement  │ │Notification  │
│   Service    │ │   Service    │ │   Service    │
│  Port: 5004  │ │  Port: 5005  │ │  Port: 5006  │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
	   │                │                │
	   ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ DiscussionDB │ │AnnouncementDB│ │NotificationDB│
│ (PostgreSQL) │ │ (PostgreSQL) │ │  (MongoDB)   │
└──────────────┘ └──────────────┘ └──────────────┘

		│               │
		▼               ▼
┌──────────────┐ ┌──────────────┐
│  Analytics   │ │    Media     │
│   Service    │ │   Service    │
│  Port: 5007  │ │  Port: 5008  │
└──────┬───────┘ └──────┬───────┘
	   │                │
	   ▼                ▼
┌──────────────┐ ┌──────────────┐
│ AnalyticsDB  │ │   MediaDB    │
│(TimescaleDB) │ │+ Blob Storage│
└──────────────┘ └──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  SHARED INFRASTRUCTURE                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │  RabbitMQ  │  │   Redis    │  │  Logging   │               │
│  │  (Message  │  │  (Cache)   │  │(Serilog/   │               │
│  │    Bus)    │  │            │  │    SEQ)    │               │
│  └────────────┘  └────────────┘  └────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Request Flow Diagram

### User Registration Flow
```
┌────────┐                                                         
│ React  │                                                         
│  App   │                                                         
└───┬────┘                                                         
	│                                                              
	│ 1. POST /api/auth/register                                  
	│    { email, password, name }                                
	▼                                                              
┌─────────────┐                                                    
│ API Gateway │                                                    
└──────┬──────┘                                                    
	   │                                                           
	   │ 2. Route to Auth Service                                 
	   ▼                                                           
┌──────────────┐                                                   
│ Auth Service │                                                   
└──────┬───────┘                                                   
	   │                                                           
	   │ 3. Validate input                                        
	   │ 4. Hash password (BCrypt)                                
	   │ 5. Save to AuthDB                                        
	   ▼                                                           
┌──────────────┐                                                   
│    AuthDB    │                                                   
└──────┬───────┘                                                   
	   │                                                           
	   │ 6. Publish UserRegisteredEvent                           
	   ▼                                                           
┌──────────────┐                                                   
│   RabbitMQ   │                                                   
└──────┬───────┘                                                   
	   │                                                           
	   ├─────────────────┬─────────────────┐                     
	   │                 │                 │                      
	   ▼                 ▼                 ▼                      
┌────────────┐   ┌────────────┐   ┌────────────┐                
│   User     │   │Notification│   │ Analytics  │                
│  Service   │   │  Service   │   │  Service   │                
└─────┬──────┘   └─────┬──────┘   └────────────┘                
	  │                │                                          
	  │ Create         │ Send Welcome                            
	  │ Profile        │ Email                                    
	  ▼                ▼                                          
┌──────────┐     ┌──────────┐                                    
│  UserDB  │     │  Email   │                                    
└──────────┘     │  SMTP    │                                    
				 └──────────┘                                    

	   ┌─────────────────────────┐                               
	   │ 7. Return JWT Tokens    │                               
	   │    { accessToken,       │                               
	   │      refreshToken }     │                               
	   └────────────┬────────────┘                               
					│                                             
					▼                                             
			 ┌────────────┐                                       
			 │  React App │                                       
			 │   (Store   │                                       
			 │   tokens)  │                                       
			 └────────────┘                                       
```

---

## 3. Event RSVP Flow

```
User wants to RSVP for an event:

┌────────┐                                                         
│ User   │                                                         
└───┬────┘                                                         
	│                                                              
	│ 1. POST /api/events/{id}/rsvp                               
	│    Authorization: Bearer <JWT>                              
	▼                                                              
┌─────────────┐                                                    
│ API Gateway │                                                    
└──────┬──────┘                                                    
	   │                                                           
	   │ 2. Validate JWT token                                    
	   │ 3. Route to Event Service                                
	   ▼                                                           
┌──────────────┐                                                   
│Event Service │                                                   
└──────┬───────┘                                                   
	   │                                                           
	   │ 4. Check event capacity                                  
	   │ 5. Check registration deadline                           
	   │ 6. Create RSVP record                                    
	   ▼                                                           
┌──────────────┐                                                   
│   EventDB    │                                                   
└──────┬───────┘                                                   
	   │                                                           
	   │ 7. Publish EventRSVPEvent                                
	   ▼                                                           
┌──────────────┐                                                   
│   RabbitMQ   │                                                   
└──────┬───────┘                                                   
	   │                                                           
	   ├─────────────────────┐                                    
	   │                     │                                     
	   ▼                     ▼                                     
┌────────────────┐   ┌────────────────┐                          
│  Notification  │   │   Analytics    │                          
│    Service     │   │    Service     │                          
└───────┬────────┘   └───────┬────────┘                          
		│                    │                                     
		│ Send               │ Record                             
		│ Confirmation       │ Metric                             
		▼                    ▼                                     
   ┌─────────┐        ┌─────────────┐                            
   │  Email  │        │AnalyticsDB  │                            
   │  User   │        └─────────────┘                            
   └─────────┘                                                     
```

---

## 4. Database Relationships

### AuthDB Structure
```
┌─────────────────────┐
│       Users         │
│─────────────────────│
│ Id (PK)             │◄─────┐
│ Email (Unique)      │      │
│ PasswordHash        │      │
│ EmailVerified       │      │
│ CreatedAt           │      │
└─────────────────────┘      │
							  │
		 ┌────────────────────┼────────────────────┐
		 │                    │                    │
		 │                    │                    │
┌────────▼─────────┐  ┌───────▼──────────┐  ┌─────▼──────────┐
│  RefreshTokens   │  │  OAuthProviders  │  │ LoginAttempts  │
│──────────────────│  │──────────────────│  │────────────────│
│ Id (PK)          │  │ Id (PK)          │  │ Id (PK)        │
│ UserId (FK)      │  │ UserId (FK)      │  │ Email          │
│ Token (Unique)   │  │ Provider         │  │ IpAddress      │
│ ExpiresAt        │  │ ProviderUserId   │  │ Success        │
│ IsRevoked        │  │ AccessToken      │  │ AttemptedAt    │
└──────────────────┘  └──────────────────┘  └────────────────┘
```

### EventDB Structure
```
┌─────────────────────┐
│  EventCategories    │
│─────────────────────│
│ Id (PK)             │◄─────┐
│ Name                │      │
│ Slug                │      │
└─────────────────────┘      │
							  │
					 ┌────────▼─────────┐
					 │      Events      │
					 │──────────────────│
					 │ Id (PK)          │◄────┬────────────┐
					 │ Title            │     │            │
					 │ CategoryId (FK)  │     │            │
					 │ StartDate        │     │            │
					 │ Capacity         │     │            │
					 └──────────────────┘     │            │
							  │               │            │
		 ┌────────────────────┼───────────────┼───────────┐
		 │                    │               │           │
┌────────▼────────┐  ┌────────▼────────┐  ┌──▼────────┐ │
│ TrekkingDetails │  │   EventRSVPs    │  │  Reviews  │ │
│─────────────────│  │─────────────────│  │───────────│ │
│ EventId (FK,PK) │  │ EventId (FK)    │  │EventId(FK)│ │
│ Difficulty      │  │ UserId          │  │UserId     │ │
│ Duration        │  │ Status          │  │ Rating    │ │
│ MaxAltitude     │  │ BookingRef      │  │ Comment   │ │
└─────────────────┘  └─────────────────┘  └───────────┘ │
														 │
														 │
```

---

## 5. Clean Architecture Layers

```
┌───────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                       │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              API Controllers                         │ │
│  │  • AuthController    • UserController                │ │
│  │  • EventController   • DiscussionController          │ │
│  │                                                       │ │
│  │  Responsibilities:                                    │ │
│  │  - HTTP request/response handling                    │ │
│  │  - Input validation (FluentValidation)               │ │
│  │  - DTOs (Data Transfer Objects)                      │ │
│  │  - Authentication/Authorization attributes           │ │
│  └──────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
						  │
						  ▼
┌───────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                         │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              Business Services                        │ │
│  │  • AuthService      • UserService                     │ │
│  │  • EventService     • NotificationService            │ │
│  │                                                       │ │
│  │  Responsibilities:                                    │ │
│  │  - Business logic implementation                     │ │
│  │  - Orchestration of domain operations                │ │
│  │  - Transaction management                            │ │
│  │  - Calling repositories and external services        │ │
│  └──────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
						  │
						  ▼
┌───────────────────────────────────────────────────────────┐
│                    DOMAIN LAYER                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              Domain Entities                          │ │
│  │  • User        • Event       • Discussion             │ │
│  │  • Comment     • RSVP        • Announcement          │ │
│  │                                                       │ │
│  │  • Interfaces (IRepository, IService)                │ │
│  │  • Domain exceptions                                  │ │
│  │  • Value objects                                      │ │
│  │                                                       │ │
│  │  Pure business domain - no dependencies              │ │
│  └──────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
						  │
						  ▼
┌───────────────────────────────────────────────────────────┐
│                INFRASTRUCTURE LAYER                        │
│  ┌──────────────────────────────────────────────────────┐ │
│  │           Data Access & External Services             │ │
│  │                                                       │ │
│  │  • DbContext (Entity Framework)                      │ │
│  │  • Repositories implementation                       │ │
│  │  • External API clients                              │ │
│  │  • Message queue publishers/consumers                │ │
│  │  • File storage clients                              │ │
│  │  • Email service implementation                      │ │
│  │                                                       │ │
│  │  Dependencies on external systems                    │ │
│  └──────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

---

## 6. Deployment Architecture (Azure)

```
┌─────────────────────────────────────────────────────────────┐
│                         AZURE CLOUD                          │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Azure Front Door (CDN + WAF)                  │ │
│  │           • Global load balancing                       │ │
│  │           • SSL termination                             │ │
│  │           • DDoS protection                             │ │
│  └──────────────────────┬─────────────────────────────────┘ │
│                         │                                    │
│  ┌──────────────────────▼─────────────────────────────────┐ │
│  │         Azure Application Gateway (API Gateway)         │ │
│  │         • Rate limiting                                 │ │
│  │         • Request routing                               │ │
│  └──────────────────────┬─────────────────────────────────┘ │
│                         │                                    │
│  ┌──────────────────────▼─────────────────────────────────┐ │
│  │       Azure Kubernetes Service (AKS)                    │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │ Auth Service │  │ User Service │  │Event Service │ │ │
│  │  │   (3 pods)   │  │   (3 pods)   │  │   (3 pods)   │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │Discussion Svc│  │Announce. Svc │  │Notific. Svc  │ │ │
│  │  │   (2 pods)   │  │   (2 pods)   │  │   (2 pods)   │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                         │                                    │
│  ┌──────────────────────┴─────────────────────────────────┐ │
│  │           Azure Database for PostgreSQL                 │ │
│  │           • Primary + Read Replicas                     │ │
│  │           • Automated backups                           │ │
│  │           • Point-in-time restore                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │           Azure Cache for Redis                         │ │
│  │           • Distributed caching                         │ │
│  │           • Session storage                             │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │           Azure Service Bus                             │ │
│  │           • Message queue                               │ │
│  │           • Pub/Sub messaging                           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │           Azure Blob Storage                            │ │
│  │           • Media files storage                         │ │
│  │           • CDN integration                             │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │           Azure Monitor & Application Insights          │ │
│  │           • Logging and monitoring                      │ │
│  │           • Alerts and dashboards                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │           Azure Key Vault                               │ │
│  │           • Secrets management                          │ │
│  │           • Certificate storage                         │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Message Queue Flow

```
Event Publisher                RabbitMQ                Event Consumers

┌──────────────┐              ┌──────────┐           ┌──────────────┐
│ Auth Service │              │          │           │ User Service │
└──────┬───────┘              │          │           └──────▲───────┘
	   │                      │          │                  │
	   │ UserRegistered       │  Queue:  │                  │
	   │ Event                │  user.   │                  │
	   ├─────────────────────►│registered├──────────────────┤
	   │                      │          │                  │
┌──────▼───────┐              │          │           ┌──────┴───────┐
│Event Service │              │          │           │Notification  │
└──────┬───────┘              │          │           │  Service     │
	   │                      │          │           └──────▲───────┘
	   │ EventCreated         │  Queue:  │                  │
	   │ Event                │  event.  │                  │
	   ├─────────────────────►│ created  ├──────────────────┤
	   │                      │          │                  │
	   │ EventRSVP            │  Queue:  │           ┌──────┴───────┐
	   │ Event                │  event.  │           │  Analytics   │
	   ├─────────────────────►│   rsvp   ├──────────►│   Service    │
	   │                      │          │           └──────────────┘
┌──────▼───────┐              │          │
│Announcement  │              │  Queue:  │           ┌──────────────┐
│  Service     │              │announce. │           │ All services │
└──────┬───────┘              │published │           │  (listeners) │
	   │                      │          │           └──────▲───────┘
	   │ Announcement         │          │                  │
	   │ Published            │          │                  │
	   └─────────────────────►│          ├──────────────────┘
							  └──────────┘

Features:
• Async communication
• Loose coupling
• Retry mechanisms
• Dead letter queues
• Message persistence
```

---

## 8. Caching Strategy

```
┌───────────────────────────────────────────────────────────┐
│                      Client Request                        │
└─────────────────────┬─────────────────────────────────────┘
					  │
					  ▼
┌───────────────────────────────────────────────────────────┐
│                    API Gateway                             │
└─────────────────────┬─────────────────────────────────────┘
					  │
					  ▼
		   ┌──────────────────────┐
		   │  Check Redis Cache   │
		   └──────────┬───────────┘
					  │
		  ┌───────────┴───────────┐
		  │                       │
	Cache Hit                Cache Miss
		  │                       │
		  ▼                       ▼
  ┌───────────────┐      ┌───────────────┐
  │ Return from   │      │ Call Service  │
  │ Redis Cache   │      │    Layer      │
  │               │      └───────┬───────┘
  │ TTL:          │              │
  │ - Profiles:   │              ▼
  │   5 mins      │      ┌───────────────┐
  │ - Events:     │      │ Query Database│
  │   1 min       │      └───────┬───────┘
  │ - Analytics:  │              │
  │   10 mins     │              ▼
  └───────────────┘      ┌───────────────┐
						 │  Store in     │
						 │  Redis Cache  │
						 └───────┬───────┘
								 │
								 ▼
						 ┌───────────────┐
						 │Return Response│
						 └───────────────┘

Cache Invalidation Triggers:
- User updates profile → Clear user:{id} cache
- Event modified → Clear event:{id} and events:list cache
- Announcement posted → Clear announcements:list cache
- Time-to-Live (TTL) expires
```

---

## 9. Security Layers

```
┌───────────────────────────────────────────────────────────┐
│                  SECURITY ONION LAYERS                     │
└───────────────────────────────────────────────────────────┘

Layer 1: Network Security
┌───────────────────────────────────────────────────────────┐
│ • Azure WAF (Web Application Firewall)                    │
│ • DDoS Protection                                          │
│ • SSL/TLS Encryption                                       │
│ • IP Whitelisting                                          │
└───────────────────────────────────────────────────────────┘
						  ▼
Layer 2: API Gateway Security
┌───────────────────────────────────────────────────────────┐
│ • Rate Limiting (per user, per IP)                       │
│ • Request Size Limits                                      │
│ • CORS Policy                                              │
│ • Security Headers (HSTS, CSP, X-Frame-Options)          │
└───────────────────────────────────────────────────────────┘
						  ▼
Layer 3: Authentication
┌───────────────────────────────────────────────────────────┐
│ • JWT Token Validation                                     │
│ • Token Expiration Check (15 min for access token)       │
│ • Refresh Token Rotation                                   │
│ • OAuth 2.0 (Google)                                       │
└───────────────────────────────────────────────────────────┘
						  ▼
Layer 4: Authorization
┌───────────────────────────────────────────────────────────┐
│ • Role-Based Access Control (RBAC)                        │
│ • Permission Checks                                        │
│ • Resource Ownership Validation                           │
│ • Policy-Based Authorization                              │
└───────────────────────────────────────────────────────────┘
						  ▼
Layer 5: Input Validation
┌───────────────────────────────────────────────────────────┐
│ • FluentValidation for all inputs                         │
│ • SQL Injection Prevention (parameterized queries)        │
│ • XSS Prevention (input sanitization)                     │
│ • CSRF Protection                                          │
└───────────────────────────────────────────────────────────┘
						  ▼
Layer 6: Data Security
┌───────────────────────────────────────────────────────────┐
│ • Password Hashing (BCrypt)                               │
│ • Sensitive Data Encryption at Rest                       │
│ • Database Access Control                                  │
│ • Audit Logging                                            │
└───────────────────────────────────────────────────────────┘
```

---

## 10. Monitoring Dashboard

```
┌───────────────────────────────────────────────────────────┐
│              MONITORING & OBSERVABILITY                    │
└───────────────────────────────────────────────────────────┘

Metrics Collection
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Application │  │   System    │  │  Database   │
│   Metrics   │  │   Metrics   │  │   Metrics   │
│             │  │             │  │             │
│ • Requests  │  │ • CPU Usage │  │ • Query Time│
│ • Errors    │  │ • Memory    │  │ • Conn Pool │
│ • Response  │  │ • Disk I/O  │  │ • Deadlocks │
│   Times     │  │             │  │             │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
	   │                │                │
	   └────────────────┼────────────────┘
						│
						▼
			┌───────────────────────┐
			│  Prometheus/AppInsight│
			│   (Metrics Storage)   │
			└───────────┬───────────┘
						│
						▼
			┌───────────────────────┐
			│   Grafana/Azure       │
			│   (Visualization)     │
			│                       │
			│  Dashboards:          │
			│  • System Health      │
			│  • API Performance    │
			│  • User Activity      │
			│  • Error Tracking     │
			└───────────┬───────────┘
						│
						▼
			┌───────────────────────┐
			│   Alert Manager       │
			│                       │
			│  Alerts:              │
			│  • High Error Rate    │
			│  • Slow Response      │
			│  • High CPU/Memory    │
			│  • Service Down       │
			└───────────┬───────────┘
						│
						▼
			┌───────────────────────┐
			│   Notifications       │
			│  • Email              │
			│  • SMS                │
			│  • Slack              │
			└───────────────────────┘

Logging Pipeline
┌─────────────┐
│   Services  │
│   (Serilog) │
└──────┬──────┘
	   │
	   ▼
┌─────────────┐
│ Seq / ELK   │
│   Stack     │
└──────┬──────┘
	   │
	   ▼
┌─────────────┐
│  Log Query  │
│  & Analysis │
└─────────────┘
```

---

**These diagrams provide visual representation of the architecture!**

**Use these diagrams in presentations, documentation, and team onboarding.**
