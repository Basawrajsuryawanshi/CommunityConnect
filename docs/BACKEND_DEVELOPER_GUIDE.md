# Backend Developer Implementation Guide

## 🎯 Quick Start for Backend Developers

This guide provides **step-by-step instructions** to implement the CommunityConnect backend from scratch.

---

## 📚 Prerequisites

Before starting, ensure you have:

### Required Software
- ✅ **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- ✅ **Visual Studio 2022** or **VS Code** with C# extension
- ✅ **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/)
- ✅ **Redis** - [Download](https://redis.io/download)
- ✅ **MongoDB** (optional initially) - [Download](https://www.mongodb.com/try/download/community)
- ✅ **RabbitMQ** (optional initially) - [Download](https://www.rabbitmq.com/download.html)
- ✅ **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop) (recommended)
- ✅ **Git** - [Download](https://git-scm.com/)
- ✅ **Postman** or **Insomnia** - For API testing

### Required Knowledge
- C# and .NET fundamentals
- ASP.NET Core Web API
- Entity Framework Core
- JWT Authentication
- RESTful API design
- SQL basics
- Docker basics (helpful)

---

## 🏗️ Phase 1: Project Setup (Week 1)

### Step 1: Create GitHub Repository

```bash
# Create new repository on GitHub: CommunityConnect.API
# Clone the repository
git clone https://github.com/YourUsername/CommunityConnect.API.git
cd CommunityConnect.API
```

### Step 2: Solution Structure

Create the following solution structure:

```
CommunityConnect.API/
├── src/
│   ├── Gateway/
│   │   └── CommunityConnect.Gateway/               # API Gateway (Ocelot)
│   ├── Services/
│   │   ├── Auth/
│   │   │   ├── CommunityConnect.Auth.API/          # Auth Service
│   │   │   ├── CommunityConnect.Auth.Core/         # Domain models
│   │   │   └── CommunityConnect.Auth.Infrastructure/ # Data access
│   │   ├── User/
│   │   │   ├── CommunityConnect.User.API/
│   │   │   ├── CommunityConnect.User.Core/
│   │   │   └── CommunityConnect.User.Infrastructure/
│   │   ├── Event/
│   │   │   ├── CommunityConnect.Event.API/
│   │   │   ├── CommunityConnect.Event.Core/
│   │   │   └── CommunityConnect.Event.Infrastructure/
│   │   ├── Discussion/
│   │   │   ├── CommunityConnect.Discussion.API/
│   │   │   ├── CommunityConnect.Discussion.Core/
│   │   │   └── CommunityConnect.Discussion.Infrastructure/
│   │   ├── Announcement/
│   │   │   ├── CommunityConnect.Announcement.API/
│   │   │   ├── CommunityConnect.Announcement.Core/
│   │   │   └── CommunityConnect.Announcement.Infrastructure/
│   │   ├── Notification/
│   │   │   ├── CommunityConnect.Notification.API/
│   │   │   └── CommunityConnect.Notification.Core/
│   │   ├── Analytics/
│   │   │   ├── CommunityConnect.Analytics.API/
│   │   │   └── CommunityConnect.Analytics.Core/
│   │   └── Media/
│   │       ├── CommunityConnect.Media.API/
│   │       └── CommunityConnect.Media.Core/
│   └── Shared/
│       ├── CommunityConnect.Common/                # Shared utilities
│       ├── CommunityConnect.Contracts/             # Shared DTOs/Interfaces
│       └── CommunityConnect.MessageBus/            # RabbitMQ integration
├── tests/
│   ├── CommunityConnect.Auth.Tests/
│   ├── CommunityConnect.User.Tests/
│   └── CommunityConnect.IntegrationTests/
├── docs/                                           # Documentation
├── scripts/                                        # Database scripts, migrations
├── docker/                                         # Docker compose files
├── .github/
│   └── workflows/                                  # CI/CD pipelines
├── CommunityConnect.sln                           # Solution file
├── .gitignore
└── README.md
```

### Step 3: Create Solution and Projects

Run these commands from the root directory:

```bash
# Create solution
dotnet new sln -n CommunityConnect

# Create Gateway
dotnet new webapi -n CommunityConnect.Gateway -o src/Gateway/CommunityConnect.Gateway
dotnet sln add src/Gateway/CommunityConnect.Gateway

# Create Shared Libraries
dotnet new classlib -n CommunityConnect.Common -o src/Shared/CommunityConnect.Common
dotnet new classlib -n CommunityConnect.Contracts -o src/Shared/CommunityConnect.Contracts
dotnet sln add src/Shared/CommunityConnect.Common
dotnet sln add src/Shared/CommunityConnect.Contracts

# Create Auth Service
dotnet new webapi -n CommunityConnect.Auth.API -o src/Services/Auth/CommunityConnect.Auth.API
dotnet new classlib -n CommunityConnect.Auth.Core -o src/Services/Auth/CommunityConnect.Auth.Core
dotnet new classlib -n CommunityConnect.Auth.Infrastructure -o src/Services/Auth/CommunityConnect.Auth.Infrastructure
dotnet sln add src/Services/Auth/CommunityConnect.Auth.API
dotnet sln add src/Services/Auth/CommunityConnect.Auth.Core
dotnet sln add src/Services/Auth/CommunityConnect.Auth.Infrastructure

# Create User Service
dotnet new webapi -n CommunityConnect.User.API -o src/Services/User/CommunityConnect.User.API
dotnet new classlib -n CommunityConnect.User.Core -o src/Services/User/CommunityConnect.User.Core
dotnet new classlib -n CommunityConnect.User.Infrastructure -o src/Services/User/CommunityConnect.User.Infrastructure
dotnet sln add src/Services/User/CommunityConnect.User.API
dotnet sln add src/Services/User/CommunityConnect.User.Core
dotnet sln add src/Services/User/CommunityConnect.User.Infrastructure

# Repeat for Event, Discussion, Announcement, Notification, Analytics, Media services
# (Use same pattern as above)
```

### Step 4: Install NuGet Packages

For each service, install these common packages:

```bash
# Navigate to each API project and run:

# Entity Framework Core
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL

# Authentication
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.IdentityModel.Tokens.Jwt

# Validation
dotnet add package FluentValidation
dotnet add package FluentValidation.AspNetCore

# Mapping
dotnet add package AutoMapper
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection

# Swagger
dotnet add package Swashbuckle.AspNetCore

# Logging
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File

# Health Checks
dotnet add package AspNetCore.HealthChecks.Npgsql
dotnet add package AspNetCore.HealthChecks.Redis

# CORS
dotnet add package Microsoft.AspNetCore.Cors
```

For **Gateway project**:
```bash
cd src/Gateway/CommunityConnect.Gateway
dotnet add package Ocelot
```

For **RabbitMQ** (in services that need it):
```bash
dotnet add package MassTransit
dotnet add package MassTransit.RabbitMQ
```

---

## 🗄️ Phase 2: Database Setup (Week 1)

### Step 1: Install PostgreSQL

If using Docker:
```bash
docker run --name postgres-dev -e POSTGRES_PASSWORD=YourPassword123 -p 5432:5432 -d postgres:15
```

### Step 2: Create Databases

Connect to PostgreSQL and run:
```sql
CREATE DATABASE AuthDB;
CREATE DATABASE UserDB;
CREATE DATABASE EventDB;
CREATE DATABASE DiscussionDB;
CREATE DATABASE AnnouncementDB;
CREATE DATABASE MediaDB;
```

### Step 3: Run Schema Scripts

Execute the SQL scripts from `docs/DATABASE_SCHEMAS.md` for each database.

Or use Entity Framework migrations (recommended):

```bash
# In AuthDB project
dotnet ef migrations add InitialCreate -o Data/Migrations
dotnet ef database update
```

---

## 🔐 Phase 3: Auth Service Implementation (Week 2)

### Step 1: Create Domain Models

**File**: `src/Services/Auth/CommunityConnect.Auth.Core/Entities/User.cs`

```csharp
using System;

namespace CommunityConnect.Auth.Core.Entities
{
	public class User
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		public string Email { get; set; } = string.Empty;
		public string? PasswordHash { get; set; }
		public bool EmailVerified { get; set; }
		public string? EmailVerificationToken { get; set; }
		public DateTime? EmailVerificationExpiry { get; set; }
		public string? PasswordResetToken { get; set; }
		public DateTime? PasswordResetExpiry { get; set; }
		public bool IsActive { get; set; } = true;
		public bool IsDeleted { get; set; }
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
		public DateTime? LastLoginAt { get; set; }

		// Navigation properties
		public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
		public ICollection<OAuthProvider> OAuthProviders { get; set; } = new List<OAuthProvider>();
	}

	public class RefreshToken
	{
		public int Id { get; set; }
		public Guid UserId { get; set; }
		public string Token { get; set; } = string.Empty;
		public DateTime ExpiresAt { get; set; }
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public DateTime? RevokedAt { get; set; }
		public string? ReplacedByToken { get; set; }
		public bool IsRevoked { get; set; }
		public string? CreatedByIp { get; set; }
		public string? RevokedByIp { get; set; }

		public User User { get; set; } = null!;
	}

	public class OAuthProvider
	{
		public int Id { get; set; }
		public Guid UserId { get; set; }
		public string Provider { get; set; } = string.Empty;
		public string ProviderUserId { get; set; } = string.Empty;
		public string? AccessToken { get; set; }
		public string? RefreshToken { get; set; }
		public DateTime? TokenExpiresAt { get; set; }
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

		public User User { get; set; } = null!;
	}
}
```

### Step 2: Create DbContext

**File**: `src/Services/Auth/CommunityConnect.Auth.Infrastructure/Data/AuthDbContext.cs`

```csharp
using CommunityConnect.Auth.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CommunityConnect.Auth.Infrastructure.Data
{
	public class AuthDbContext : DbContext
	{
		public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }

		public DbSet<User> Users => Set<User>();
		public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
		public DbSet<OAuthProvider> OAuthProviders => Set<OAuthProvider>();

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			// User configuration
			modelBuilder.Entity<User>(entity =>
			{
				entity.ToTable("Users");
				entity.HasKey(e => e.Id);
				entity.HasIndex(e => e.Email).IsUnique();
				entity.Property(e => e.Email).HasMaxLength(255).IsRequired();
				entity.Property(e => e.PasswordHash).HasMaxLength(500);
			});

			// RefreshToken configuration
			modelBuilder.Entity<RefreshToken>(entity =>
			{
				entity.ToTable("RefreshTokens");
				entity.HasKey(e => e.Id);
				entity.HasIndex(e => e.Token).IsUnique();
				entity.HasOne(e => e.User)
					.WithMany(u => u.RefreshTokens)
					.HasForeignKey(e => e.UserId)
					.OnDelete(DeleteBehavior.Cascade);
			});

			// OAuthProvider configuration
			modelBuilder.Entity<OAuthProvider>(entity =>
			{
				entity.ToTable("OAuthProviders");
				entity.HasKey(e => e.Id);
				entity.HasIndex(e => new { e.Provider, e.ProviderUserId }).IsUnique();
				entity.HasOne(e => e.User)
					.WithMany(u => u.OAuthProviders)
					.HasForeignKey(e => e.UserId)
					.OnDelete(DeleteBehavior.Cascade);
			});
		}
	}
}
```

### Step 3: Create DTOs

**File**: `src/Shared/CommunityConnect.Contracts/Auth/LoginRequest.cs`

```csharp
namespace CommunityConnect.Contracts.Auth
{
	public record LoginRequest(string Email, string Password);

	public record RegisterRequest(
		string Email,
		string Password,
		string FirstName,
		string LastName
	);

	public record GoogleLoginRequest(string IdToken);

	public record RefreshTokenRequest(string RefreshToken);

	public record AuthResponse(
		Guid UserId,
		string Email,
		string AccessToken,
		string RefreshToken,
		DateTime ExpiresAt
	);
}
```

### Step 4: Create Services

**File**: `src/Services/Auth/CommunityConnect.Auth.Core/Services/IAuthService.cs`

```csharp
using CommunityConnect.Contracts.Auth;

namespace CommunityConnect.Auth.Core.Services
{
	public interface IAuthService
	{
		Task<AuthResponse> RegisterAsync(RegisterRequest request);
		Task<AuthResponse> LoginAsync(LoginRequest request);
		Task<AuthResponse> GoogleLoginAsync(GoogleLoginRequest request);
		Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request);
		Task LogoutAsync(Guid userId);
		Task<bool> ValidateTokenAsync(string token);
	}
}
```

**File**: `src/Services/Auth/CommunityConnect.Auth.Core/Services/AuthService.cs`

```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using CommunityConnect.Auth.Core.Entities;
using CommunityConnect.Auth.Infrastructure.Data;
using CommunityConnect.Contracts.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CommunityConnect.Auth.Core.Services
{
	public class AuthService : IAuthService
	{
		private readonly AuthDbContext _context;
		private readonly IConfiguration _configuration;

		public AuthService(AuthDbContext context, IConfiguration configuration)
		{
			_context = context;
			_configuration = configuration;
		}

		public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
		{
			// Check if user exists
			if (await _context.Users.AnyAsync(u => u.Email == request.Email))
			{
				throw new Exception("User with this email already exists");
			}

			// Create user
			var user = new User
			{
				Email = request.Email,
				PasswordHash = HashPassword(request.Password),
				EmailVerified = false
			};

			_context.Users.Add(user);
			await _context.SaveChangesAsync();

			// Generate tokens
			var accessToken = GenerateAccessToken(user);
			var refreshToken = await GenerateRefreshTokenAsync(user.Id, "");

			return new AuthResponse(
				user.Id,
				user.Email,
				accessToken,
				refreshToken.Token,
				refreshToken.ExpiresAt
			);
		}

		public async Task<AuthResponse> LoginAsync(LoginRequest request)
		{
			var user = await _context.Users
				.FirstOrDefaultAsync(u => u.Email == request.Email);

			if (user == null || !VerifyPassword(request.Password, user.PasswordHash!))
			{
				throw new Exception("Invalid email or password");
			}

			if (!user.IsActive)
			{
				throw new Exception("Account is deactivated");
			}

			// Update last login
			user.LastLoginAt = DateTime.UtcNow;
			await _context.SaveChangesAsync();

			// Generate tokens
			var accessToken = GenerateAccessToken(user);
			var refreshToken = await GenerateRefreshTokenAsync(user.Id, "");

			return new AuthResponse(
				user.Id,
				user.Email,
				accessToken,
				refreshToken.Token,
				refreshToken.ExpiresAt
			);
		}

		public async Task<AuthResponse> GoogleLoginAsync(GoogleLoginRequest request)
		{
			// TODO: Verify Google ID token
			// For now, simplified version

			throw new NotImplementedException("Google login not implemented yet");
		}

		public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request)
		{
			var refreshToken = await _context.RefreshTokens
				.Include(rt => rt.User)
				.FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

			if (refreshToken == null || refreshToken.IsRevoked || refreshToken.ExpiresAt < DateTime.UtcNow)
			{
				throw new Exception("Invalid or expired refresh token");
			}

			// Revoke old token
			refreshToken.IsRevoked = true;
			refreshToken.RevokedAt = DateTime.UtcNow;

			// Generate new tokens
			var accessToken = GenerateAccessToken(refreshToken.User);
			var newRefreshToken = await GenerateRefreshTokenAsync(refreshToken.UserId, "");

			await _context.SaveChangesAsync();

			return new AuthResponse(
				refreshToken.User.Id,
				refreshToken.User.Email,
				accessToken,
				newRefreshToken.Token,
				newRefreshToken.ExpiresAt
			);
		}

		public async Task LogoutAsync(Guid userId)
		{
			var refreshTokens = await _context.RefreshTokens
				.Where(rt => rt.UserId == userId && !rt.IsRevoked)
				.ToListAsync();

			foreach (var token in refreshTokens)
			{
				token.IsRevoked = true;
				token.RevokedAt = DateTime.UtcNow;
			}

			await _context.SaveChangesAsync();
		}

		public Task<bool> ValidateTokenAsync(string token)
		{
			// Implement token validation logic
			throw new NotImplementedException();
		}

		private string GenerateAccessToken(User user)
		{
			var key = new SymmetricSecurityKey(
				Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!)
			);
			var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var claims = new[]
			{
				new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
				new Claim(JwtRegisteredClaimNames.Email, user.Email),
				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
			};

			var token = new JwtSecurityToken(
				issuer: _configuration["Jwt:Issuer"],
				audience: _configuration["Jwt:Audience"],
				claims: claims,
				expires: DateTime.UtcNow.AddMinutes(15),
				signingCredentials: credentials
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}

		private async Task<RefreshToken> GenerateRefreshTokenAsync(Guid userId, string ipAddress)
		{
			var refreshToken = new RefreshToken
			{
				UserId = userId,
				Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
				ExpiresAt = DateTime.UtcNow.AddDays(7),
				CreatedByIp = ipAddress
			};

			_context.RefreshTokens.Add(refreshToken);
			await _context.SaveChangesAsync();

			return refreshToken;
		}

		private string HashPassword(string password)
		{
			return BCrypt.Net.BCrypt.HashPassword(password);
		}

		private bool VerifyPassword(string password, string hash)
		{
			return BCrypt.Net.BCrypt.Verify(password, hash);
		}
	}
}
```

### Step 5: Create Controller

**File**: `src/Services/Auth/CommunityConnect.Auth.API/Controllers/AuthController.cs`

```csharp
using CommunityConnect.Auth.Core.Services;
using CommunityConnect.Contracts.Auth;
using Microsoft.AspNetCore.Mvc;

namespace CommunityConnect.Auth.API.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		private readonly IAuthService _authService;

		public AuthController(IAuthService authService)
		{
			_authService = authService;
		}

		[HttpPost("register")]
		public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
		{
			try
			{
				var response = await _authService.RegisterAsync(request);
				return Ok(response);
			}
			catch (Exception ex)
			{
				return BadRequest(new { message = ex.Message });
			}
		}

		[HttpPost("login")]
		public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
		{
			try
			{
				var response = await _authService.LoginAsync(request);
				return Ok(response);
			}
			catch (Exception ex)
			{
				return Unauthorized(new { message = ex.Message });
			}
		}

		[HttpPost("google")]
		public async Task<ActionResult<AuthResponse>> GoogleLogin([FromBody] GoogleLoginRequest request)
		{
			try
			{
				var response = await _authService.GoogleLoginAsync(request);
				return Ok(response);
			}
			catch (Exception ex)
			{
				return BadRequest(new { message = ex.Message });
			}
		}

		[HttpPost("refresh-token")]
		public async Task<ActionResult<AuthResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
		{
			try
			{
				var response = await _authService.RefreshTokenAsync(request);
				return Ok(response);
			}
			catch (Exception ex)
			{
				return Unauthorized(new { message = ex.Message });
			}
		}

		[HttpPost("logout")]
		public async Task<IActionResult> Logout([FromBody] Guid userId)
		{
			try
			{
				await _authService.LogoutAsync(userId);
				return Ok(new { message = "Logged out successfully" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { message = ex.Message });
			}
		}
	}
}
```

### Step 6: Configure Program.cs

**File**: `src/Services/Auth/CommunityConnect.Auth.API/Program.cs`

```csharp
using CommunityConnect.Auth.Core.Services;
using CommunityConnect.Auth.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<AuthDbContext>(options =>
	options.UseNpgsql(builder.Configuration.GetConnectionString("AuthDb")));

// Services
builder.Services.AddScoped<IAuthService, AuthService>();

// CORS
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAll", policy =>
	{
		policy.AllowAnyOrigin()
			  .AllowAnyMethod()
			  .AllowAnyHeader();
	});
});

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

### Step 7: Configuration

**File**: `src/Services/Auth/CommunityConnect.Auth.API/appsettings.json`

```json
{
  "ConnectionStrings": {
	"AuthDb": "Host=localhost;Port=5432;Database=AuthDB;Username=postgres;Password=YourPassword123"
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
	  "Microsoft.AspNetCore": "Warning"
	}
  }
}
```

### Step 8: Add BCrypt Package

```bash
cd src/Services/Auth/CommunityConnect.Auth.Core
dotnet add package BCrypt.Net-Next
```

---

## 🧪 Phase 4: Testing (Week 2)

### Test Auth Service

1. Run the Auth Service:
```bash
cd src/Services/Auth/CommunityConnect.Auth.API
dotnet run
```

2. Test with Postman:

**Register**:
```
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Login**:
```
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!"
}
```

---

## 📝 Next Steps

1. **Implement User Service** (similar pattern to Auth Service)
2. **Implement Event Service**
3. **Implement Discussion Service**
4. **Implement Announcement Service**
5. **Setup API Gateway with Ocelot**
6. **Add RabbitMQ for async messaging**
7. **Implement Notification Service**
8. **Add Media Service**
9. **Add Analytics Service**
10. **Write unit tests**
11. **Setup Docker Compose**
12. **Deploy to Azure/AWS**

---

## 🐳 Docker Setup (Optional but Recommended)

**File**: `docker/docker-compose.dev.yml`

```yaml
version: '3.8'

services:
  postgres:
	image: postgres:15
	environment:
	  POSTGRES_PASSWORD: YourPassword123
	ports:
	  - "5432:5432"
	volumes:
	  - postgres_data:/var/lib/postgresql/data

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

volumes:
  postgres_data:
```

Run with:
```bash
docker-compose -f docker/docker-compose.dev.yml up -d
```

---

## 📚 Additional Resources

- [Official .NET Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [JWT Authentication in ASP.NET Core](https://jwt.io/)
- [Microservices with .NET](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/)
- [Ocelot Documentation](https://ocelot.readthedocs.io/)

---

## 💡 Pro Tips

1. **Use DTOs**: Never expose entities directly in APIs
2. **Validate inputs**: Use FluentValidation for all requests
3. **Error handling**: Implement global exception handling
4. **Logging**: Log everything (use Serilog)
5. **Testing**: Write tests as you build
6. **Documentation**: Keep Swagger updated
7. **Security**: Never commit secrets, use User Secrets or Azure Key Vault
8. **Git**: Commit frequently with meaningful messages

---

## 🆘 Need Help?

If you get stuck:	
1. Check the error messages carefully
2. Review the documentation
3. Search StackOverflow
4. Ask in team chat
5. Review similar open-source projects

---

**Happy Coding! 🚀**

---

**Version**: 1.0  
**Last Updated**: 2024
