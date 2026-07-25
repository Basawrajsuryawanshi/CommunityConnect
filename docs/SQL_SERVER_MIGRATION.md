# SQL Server Migration Guide

## 🔄 Switching from PostgreSQL to SQL Server

This document provides all the changes needed to use **Microsoft SQL Server** instead of PostgreSQL for your CommunityConnect backend.

---

## 📋 Key Changes Overview

### What Changes:
- ✅ Database server: PostgreSQL → **SQL Server**
- ✅ NuGet packages: Npgsql → **Microsoft.EntityFrameworkCore.SqlServer**
- ✅ Connection strings format
- ✅ SQL syntax (minor differences)
- ✅ Docker images
- ✅ Some data types

### What Stays the Same:
- ✅ Database structure (tables, columns)
- ✅ Architecture design
- ✅ Number of databases (still 8)
- ✅ Application code (mostly)
- ✅ Entity Framework Core usage

---

## 🗄️ SQL Server Database Setup

### Step 1: Install SQL Server

#### Option A: SQL Server Developer Edition (Free)
```powershell
# Download from:
# https://www.microsoft.com/en-us/sql-server/sql-server-downloads

# Or use Chocolatey:
choco install sql-server-2022

# Install SQL Server Management Studio (SSMS)
choco install sql-server-management-studio
```

#### Option B: SQL Server Express (Free, Limited)
```powershell
# Download from Microsoft or use Chocolatey
choco install sql-server-express
```

#### Option C: Docker Container (Recommended for Dev)
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
   -p 1433:1433 --name sql-server \
   -d mcr.microsoft.com/mssql/server:2022-latest
```

### Step 2: Create Databases

Connect to SQL Server using SSMS or Azure Data Studio and run:

```sql
-- Create all databases
CREATE DATABASE AuthDB;
GO

CREATE DATABASE UserDB;
GO

CREATE DATABASE EventDB;
GO

CREATE DATABASE DiscussionDB;
GO

CREATE DATABASE AnnouncementDB;
GO

CREATE DATABASE MediaDB;
GO

CREATE DATABASE AnalyticsDB;
GO

-- NotificationDB will still use MongoDB (no change)
```

---

## 📦 NuGet Package Changes

### Remove PostgreSQL Packages
```bash
# In each service, remove:
dotnet remove package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet remove package AspNetCore.HealthChecks.Npgsql
```

### Add SQL Server Packages
```bash
# In each service, add:
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package AspNetCore.HealthChecks.SqlServer

# Example for Auth Service:
cd src/Services/Auth/CommunityConnect.Auth.API
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
```

### Complete Package List for Each Service
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="FluentValidation.AspNetCore" Version="11.3.0" />
<PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.1" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
<PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
```

---

## 🔌 Connection String Changes

### PostgreSQL (Old)
```json
{
  "ConnectionStrings": {
	"AuthDb": "Host=localhost;Port=5432;Database=AuthDB;Username=postgres;Password=YourPassword123"
  }
}
```

### SQL Server (New)
```json
{
  "ConnectionStrings": {
	"AuthDb": "Server=localhost,1433;Database=AuthDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

### Connection String Format for Different Scenarios

#### Local SQL Server (Windows Authentication)
```json
"Server=localhost;Database=AuthDB;Integrated Security=true;TrustServerCertificate=True;MultipleActiveResultSets=true"
```

#### Local SQL Server (SQL Authentication)
```json
"Server=localhost,1433;Database=AuthDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;MultipleActiveResultSets=true"
```

#### Azure SQL Database
```json
"Server=tcp:yourserver.database.windows.net,1433;Database=AuthDB;User ID=yourusername;Password=yourpassword;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
```

#### Docker Container
```json
"Server=host.docker.internal,1433;Database=AuthDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True"
```

---

## 🔧 DbContext Configuration Changes

### Program.cs - PostgreSQL (Old)
```csharp
builder.Services.AddDbContext<AuthDbContext>(options =>
	options.UseNpgsql(builder.Configuration.GetConnectionString("AuthDb")));
```

### Program.cs - SQL Server (New)
```csharp
builder.Services.AddDbContext<AuthDbContext>(options =>
	options.UseSqlServer(builder.Configuration.GetConnectionString("AuthDb")));
```

### Complete appsettings.json for Auth Service
```json
{
  "ConnectionStrings": {
	"AuthDb": "Server=localhost,1433;Database=AuthDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;MultipleActiveResultSets=true"
  },
  "Jwt": {
	"SecretKey": "YourSuperSecretKeyHereThatIsAtLeast32CharactersLong",
	"Issuer": "CommunityConnect",
	"Audience": "CommunityConnect.API",
	"ExpiryMinutes": 15
  },
  "Logging": {
	"LogLevel": {
	  "Default": "Information",
	  "Microsoft.AspNetCore": "Warning",
	  "Microsoft.EntityFrameworkCore": "Information"
	}
  },
  "AllowedHosts": "*"
}
```

---

## 📝 SQL Syntax Differences

### Data Type Changes

| PostgreSQL | SQL Server | Notes |
|------------|------------|-------|
| `UUID` | `UNIQUEIDENTIFIER` | GUIDs |
| `SERIAL` | `INT IDENTITY(1,1)` | Auto-increment |
| `TEXT` | `NVARCHAR(MAX)` | Large text |
| `BOOLEAN` | `BIT` | True/False |
| `TIMESTAMP` | `DATETIME2` | Date and time |
| `JSONB` | `NVARCHAR(MAX)` | JSON data |

### Updated SQL Schema Examples

#### PostgreSQL (Old)
```sql
CREATE TABLE Users (
	Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	Email VARCHAR(255) UNIQUE NOT NULL,
	IsActive BOOLEAN DEFAULT TRUE,
	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### SQL Server (New)
```sql
CREATE TABLE Users (
	Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
	Email NVARCHAR(255) NOT NULL UNIQUE,
	IsActive BIT DEFAULT 1,
	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

	CONSTRAINT UQ_Users_Email UNIQUE (Email)
);
```

### Array Handling

#### PostgreSQL (Old)
```sql
Tags TEXT[]
```

#### SQL Server (New)
```sql
-- Option 1: Store as JSON
Tags NVARCHAR(MAX) -- Store as JSON array

-- Option 2: Create separate table
CREATE TABLE DiscussionTags (
	DiscussionId UNIQUEIDENTIFIER,
	Tag NVARCHAR(100),
	PRIMARY KEY (DiscussionId, Tag)
);
```

---

## 🗃️ Updated Database Schemas for SQL Server

### 1. AuthDB - Users Table
```sql
CREATE TABLE Users (
	Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
	Email NVARCHAR(255) NOT NULL,
	PasswordHash NVARCHAR(500) NULL,
	EmailVerified BIT DEFAULT 0,
	EmailVerificationToken NVARCHAR(500) NULL,
	EmailVerificationExpiry DATETIME2 NULL,
	PasswordResetToken NVARCHAR(500) NULL,
	PasswordResetExpiry DATETIME2 NULL,
	IsActive BIT DEFAULT 1,
	IsDeleted BIT DEFAULT 0,
	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
	UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
	LastLoginAt DATETIME2 NULL,

	CONSTRAINT UQ_Users_Email UNIQUE (Email)
);

CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_EmailVerificationToken ON Users(EmailVerificationToken);
CREATE INDEX IX_Users_PasswordResetToken ON Users(PasswordResetToken);
```

### 2. AuthDB - RefreshTokens Table
```sql
CREATE TABLE RefreshTokens (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	UserId UNIQUEIDENTIFIER NOT NULL,
	Token NVARCHAR(500) NOT NULL UNIQUE,
	ExpiresAt DATETIME2 NOT NULL,
	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
	RevokedAt DATETIME2 NULL,
	ReplacedByToken NVARCHAR(500) NULL,
	IsRevoked BIT DEFAULT 0,
	CreatedByIp NVARCHAR(50) NULL,
	RevokedByIp NVARCHAR(50) NULL,

	CONSTRAINT FK_RefreshTokens_Users FOREIGN KEY (UserId) 
		REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE INDEX IX_RefreshTokens_UserId ON RefreshTokens(UserId);
CREATE INDEX IX_RefreshTokens_Token ON RefreshTokens(Token);
```

### 3. AuthDB - OAuthProviders Table
```sql
CREATE TABLE OAuthProviders (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	UserId UNIQUEIDENTIFIER NOT NULL,
	Provider NVARCHAR(50) NOT NULL,
	ProviderUserId NVARCHAR(255) NOT NULL,
	AccessToken NVARCHAR(MAX) NULL,
	RefreshToken NVARCHAR(MAX) NULL,
	TokenExpiresAt DATETIME2 NULL,
	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
	UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

	CONSTRAINT FK_OAuthProviders_Users FOREIGN KEY (UserId) 
		REFERENCES Users(Id) ON DELETE CASCADE,
	CONSTRAINT UQ_Provider_User UNIQUE (Provider, ProviderUserId)
);

CREATE INDEX IX_OAuthProviders_UserId ON OAuthProviders(UserId);
CREATE INDEX IX_OAuthProviders_Provider_ProviderUserId ON OAuthProviders(Provider, ProviderUserId);
```

### 4. UserDB - UserProfiles Table
```sql
CREATE TABLE UserProfiles (
	Id UNIQUEIDENTIFIER PRIMARY KEY,
	FirstName NVARCHAR(100) NOT NULL,
	LastName NVARCHAR(100) NOT NULL,
	DisplayName NVARCHAR(200) NULL,
	AvatarUrl NVARCHAR(500) NULL,
	Bio NVARCHAR(MAX) NULL,
	DateOfBirth DATE NULL,
	Gender NVARCHAR(20) NULL,
	PhoneNumber NVARCHAR(20) NULL,

	-- JNV Specific
	JNV NVARCHAR(200) NULL,
	Batch NVARCHAR(10) NULL,
	StudentId NVARCHAR(50) NULL,

	-- Address
	AddressLine1 NVARCHAR(255) NULL,
	AddressLine2 NVARCHAR(255) NULL,
	City NVARCHAR(100) NULL,
	State NVARCHAR(100) NULL,
	Country NVARCHAR(100) NULL,
	PostalCode NVARCHAR(20) NULL,

	-- Social
	LinkedInUrl NVARCHAR(500) NULL,
	TwitterHandle NVARCHAR(100) NULL,
	GitHubUsername NVARCHAR(100) NULL,

	IsProfileComplete BIT DEFAULT 0,
	IsPublic BIT DEFAULT 1,
	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
	UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX IX_UserProfiles_JNV ON UserProfiles(JNV);
CREATE INDEX IX_UserProfiles_Batch ON UserProfiles(Batch);
CREATE INDEX IX_UserProfiles_DisplayName ON UserProfiles(DisplayName);
```

### 5. EventDB - Events Table
```sql
CREATE TABLE Events (
	Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
	Title NVARCHAR(255) NOT NULL,
	Description NVARCHAR(MAX) NOT NULL,
	CategoryId INT NOT NULL,
	EventType NVARCHAR(20) NOT NULL,

	-- Date & Time
	StartDate DATETIME2 NOT NULL,
	EndDate DATETIME2 NOT NULL,
	RegistrationDeadline DATETIME2 NULL,

	-- Location
	LocationName NVARCHAR(255) NULL,
	LocationAddress NVARCHAR(MAX) NULL,
	Latitude DECIMAL(10, 8) NULL,
	Longitude DECIMAL(11, 8) NULL,
	IsOnline BIT DEFAULT 0,
	OnlineMeetingUrl NVARCHAR(500) NULL,

	-- Capacity
	MaxAttendees INT NULL,
	CurrentAttendees INT DEFAULT 0,
	WaitlistEnabled BIT DEFAULT 0,

	-- Pricing
	IsFree BIT DEFAULT 1,
	Price DECIMAL(10, 2) NULL,
	Currency NVARCHAR(10) DEFAULT 'INR',

	-- Status
	Status NVARCHAR(20) NOT NULL DEFAULT 'Draft',

	-- Media
	BannerImageUrl NVARCHAR(500) NULL,
	ThumbnailUrl NVARCHAR(500) NULL,

	-- Metadata
	CreatedBy UNIQUEIDENTIFIER NOT NULL,
	OrganizerId UNIQUEIDENTIFIER NOT NULL,
	IsPublic BIT DEFAULT 1,
	IsFeatured BIT DEFAULT 0,
	Tags NVARCHAR(MAX) NULL, -- Store as JSON array

	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
	UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
	PublishedAt DATETIME2 NULL,
	CancelledAt DATETIME2 NULL,

	CONSTRAINT FK_Events_Category FOREIGN KEY (CategoryId) 
		REFERENCES EventCategories(Id),
	CONSTRAINT CHK_Events_Dates CHECK (EndDate >= StartDate),
	CONSTRAINT CHK_Events_Price CHECK (Price IS NULL OR Price >= 0)
);

CREATE INDEX IX_Events_CategoryId ON Events(CategoryId);
CREATE INDEX IX_Events_StartDate ON Events(StartDate DESC);
CREATE INDEX IX_Events_Status ON Events(Status);
CREATE INDEX IX_Events_CreatedBy ON Events(CreatedBy);
```

---

## 🔄 Entity Framework Migrations

### Create Initial Migration (SQL Server)

```bash
# Navigate to Auth Service
cd src/Services/Auth/CommunityConnect.Auth.API

# Create migration
dotnet ef migrations add InitialCreate -o Data/Migrations

# Update database
dotnet ef database update
```

### Migration Command for Each Service

```bash
# Auth Service
cd src/Services/Auth/CommunityConnect.Auth.API
dotnet ef migrations add InitialCreate
dotnet ef database update

# User Service
cd src/Services/User/CommunityConnect.User.API
dotnet ef migrations add InitialCreate
dotnet ef database update

# Event Service
cd src/Services/Event/CommunityConnect.Event.API
dotnet ef migrations add InitialCreate
dotnet ef database update

# Repeat for all services...
```

---

## 🐳 Docker Compose Update

### PostgreSQL (Old)
```yaml
version: '3.8'
services:
  postgres:
	image: postgres:15
	environment:
	  POSTGRES_PASSWORD: YourPassword123
	ports:
	  - "5432:5432"
```

### SQL Server (New)
```yaml
version: '3.8'
services:
  sqlserver:
	image: mcr.microsoft.com/mssql/server:2022-latest
	environment:
	  ACCEPT_EULA: Y
	  SA_PASSWORD: YourStrong@Passw0rd
	  MSSQL_PID: Developer
	ports:
	  - "1433:1433"
	volumes:
	  - sqlserver_data:/var/opt/mssql
	healthcheck:
	  test: /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -Q "SELECT 1" || exit 1
	  interval: 10s
	  timeout: 3s
	  retries: 10
	  start_period: 10s

  redis:
	image: redis:7-alpine
	ports:
	  - "6379:6379"

  rabbitmq:
	image: rabbitmq:3-management
	ports:
	  - "5672:5672"
	  - "15672:15672"
	environment:
	  RABBITMQ_DEFAULT_USER: guest
	  RABBITMQ_DEFAULT_PASS: guest

  mongodb:
	image: mongo:6
	ports:
	  - "27017:27017"
	environment:
	  MONGO_INITDB_ROOT_USERNAME: admin
	  MONGO_INITDB_ROOT_PASSWORD: password123

volumes:
  sqlserver_data:
```

---

## 🔍 Health Check Updates

### PostgreSQL (Old)
```csharp
builder.Services.AddHealthChecks()
	.AddNpgSql(
		connectionString: builder.Configuration.GetConnectionString("AuthDb")!,
		name: "authdb");
```

### SQL Server (New)
```csharp
builder.Services.AddHealthChecks()
	.AddSqlServer(
		connectionString: builder.Configuration.GetConnectionString("AuthDb")!,
		name: "authdb");
```

---

## 📊 TimescaleDB Alternative for Analytics

Since TimescaleDB is PostgreSQL-based, for SQL Server use:

### Option 1: Use SQL Server with Partitioning
```sql
-- Create partitioned table for time-series data
CREATE TABLE EventMetrics (
	Time DATETIME2 NOT NULL,
	EventId UNIQUEIDENTIFIER NOT NULL,
	MetricType NVARCHAR(50) NOT NULL,
	UserId UNIQUEIDENTIFIER NULL,
	Value NUMERIC NULL,
	Metadata NVARCHAR(MAX) NULL,

	INDEX IX_EventMetrics_Time CLUSTERED (Time),
	INDEX IX_EventMetrics_EventId (EventId, Time)
);

-- Use table partitioning for large datasets
```

### Option 2: Use Azure SQL Database with Temporal Tables
```sql
CREATE TABLE EventMetrics (
	Time DATETIME2 NOT NULL,
	EventId UNIQUEIDENTIFIER NOT NULL,
	MetricType NVARCHAR(50) NOT NULL,
	Value NUMERIC NULL,
	PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
) WITH (SYSTEM_VERSIONING = ON);
```

### Option 3: Keep TimescaleDB Separately
Continue using TimescaleDB (PostgreSQL) only for AnalyticsDB while using SQL Server for others.

---

## ✅ Complete Checklist for Migration

### Installation
- [ ] Install SQL Server (Developer/Express or Docker)
- [ ] Install SQL Server Management Studio (SSMS) or Azure Data Studio
- [ ] Test connection to SQL Server

### Code Changes
- [ ] Remove Npgsql packages from all services
- [ ] Add Microsoft.EntityFrameworkCore.SqlServer packages
- [ ] Update all connection strings in appsettings.json
- [ ] Change UseNpgsql() to UseSqlServer() in all services
- [ ] Update health checks to use AddSqlServer()

### Database Setup
- [ ] Create all 7 databases in SQL Server
- [ ] Run migrations for each service
- [ ] Verify databases created successfully
- [ ] Insert seed data (categories, roles)

### Testing
- [ ] Test Auth Service (register, login)
- [ ] Test User Service (profile CRUD)
- [ ] Test Event Service (create event)
- [ ] Verify all services connecting successfully

### Docker
- [ ] Update docker-compose.yml with SQL Server
- [ ] Update connection strings for Docker networking
- [ ] Test Docker Compose stack

---

## 🎯 Updated Docker Compose - Full Stack

```yaml
version: '3.8'

services:
  # SQL Server
  sqlserver:
	image: mcr.microsoft.com/mssql/server:2022-latest
	container_name: communityconnect-sqlserver
	environment:
	  ACCEPT_EULA: Y
	  SA_PASSWORD: YourStrong@Passw0rd123!
	  MSSQL_PID: Developer
	ports:
	  - "1433:1433"
	volumes:
	  - sqlserver_data:/var/opt/mssql
	networks:
	  - communityconnect-network
	healthcheck:
	  test: /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd123!" -Q "SELECT 1" || exit 1
	  interval: 10s
	  timeout: 3s
	  retries: 10

  # Redis Cache
  redis:
	image: redis:7-alpine
	container_name: communityconnect-redis
	ports:
	  - "6379:6379"
	networks:
	  - communityconnect-network

  # RabbitMQ
  rabbitmq:
	image: rabbitmq:3-management
	container_name: communityconnect-rabbitmq
	environment:
	  RABBITMQ_DEFAULT_USER: guest
	  RABBITMQ_DEFAULT_PASS: guest
	ports:
	  - "5672:5672"
	  - "15672:15672"
	networks:
	  - communityconnect-network

  # MongoDB (for notifications)
  mongodb:
	image: mongo:6
	container_name: communityconnect-mongodb
	environment:
	  MONGO_INITDB_ROOT_USERNAME: admin
	  MONGO_INITDB_ROOT_PASSWORD: password123
	ports:
	  - "27017:27017"
	volumes:
	  - mongodb_data:/data/db
	networks:
	  - communityconnect-network

  # Auth Service
  auth-service:
	build:
	  context: ./src/Services/Auth/CommunityConnect.Auth.API
	  dockerfile: Dockerfile
	container_name: auth-service
	environment:
	  - ASPNETCORE_ENVIRONMENT=Development
	  - ConnectionStrings__AuthDb=Server=sqlserver,1433;Database=AuthDB;User Id=sa;Password=YourStrong@Passw0rd123!;TrustServerCertificate=True
	ports:
	  - "5001:80"
	depends_on:
	  - sqlserver
	networks:
	  - communityconnect-network

  # Add other services similarly...

volumes:
  sqlserver_data:
  mongodb_data:

networks:
  communityconnect-network:
	driver: bridge
```

---

## 🔐 SQL Server Authentication Notes

### SA Account (System Administrator)
- Default admin account for SQL Server
- Password must be strong (uppercase, lowercase, numbers, special chars)
- Example: `YourStrong@Passw0rd123!`

### Windows Authentication (Local Development)
```json
"Server=localhost;Database=AuthDB;Integrated Security=true;TrustServerCertificate=True"
```

### SQL Authentication (Production)
```json
"Server=yourserver.database.windows.net;Database=AuthDB;User ID=appuser;Password=SecureP@ssw0rd;Encrypt=True"
```

---

## 📚 Updated Learning Resources

### SQL Server Specific
- [SQL Server Documentation](https://docs.microsoft.com/en-us/sql/sql-server/)
- [Entity Framework Core with SQL Server](https://docs.microsoft.com/en-us/ef/core/providers/sql-server/)
- [Azure SQL Database](https://docs.microsoft.com/en-us/azure/azure-sql/)

### Tools
- **SQL Server Management Studio (SSMS)**: Full-featured GUI
- **Azure Data Studio**: Cross-platform, modern UI
- **SQL Server Profiler**: Performance monitoring
- **Database Migration Assistant**: For migrations

---

## 🎉 Summary

### What Changed:
✅ Database server: PostgreSQL → SQL Server  
✅ NuGet package: Npgsql → Microsoft.EntityFrameworkCore.SqlServer  
✅ Connection strings updated  
✅ Some SQL syntax (UUID → UNIQUEIDENTIFIER, SERIAL → IDENTITY)  
✅ Docker image: postgres → mssql/server  
✅ Port: 5432 → 1433  

### What Stayed the Same:
✅ All 8 databases structure  
✅ Table structures and relationships  
✅ Application architecture  
✅ Entity Framework Core usage  
✅ .NET 8 and C# code  

---

## ✅ Quick Start Commands

```bash
# 1. Install SQL Server via Docker
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
   -p 1433:1433 --name sql-server \
   -d mcr.microsoft.com/mssql/server:2022-latest

# 2. Update NuGet packages in Auth Service
cd src/Services/Auth/CommunityConnect.Auth.API
dotnet remove package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.SqlServer

# 3. Update appsettings.json connection string
# "Server=localhost,1433;Database=AuthDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True"

# 4. Run migrations
dotnet ef migrations add InitialCreate
dotnet ef database update

# 5. Run the service
dotnet run
```

---

**You're all set to use SQL Server! 🚀**

**All architecture documents remain valid - just follow this migration guide for database-specific changes.**
