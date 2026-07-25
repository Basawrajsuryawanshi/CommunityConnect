# CommunityConnect - Database Schemas

## 📊 Database Overview

**Total Databases**: 8  
**Primary DBMS**: PostgreSQL 15+  
**Alternative**: MongoDB (for Notifications), TimescaleDB (for Analytics)

---

## 1. AuthDB (PostgreSQL)

### Purpose
Store authentication-related data, credentials, and tokens.

### Tables

#### 1.1 Users
```sql
CREATE TABLE Users (
	Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	Email VARCHAR(255) UNIQUE NOT NULL,
	PasswordHash VARCHAR(500) NULL, -- NULL for OAuth users
	EmailVerified BOOLEAN DEFAULT FALSE,
	EmailVerificationToken VARCHAR(500) NULL,
	EmailVerificationExpiry TIMESTAMP NULL,
	PasswordResetToken VARCHAR(500) NULL,
	PasswordResetExpiry TIMESTAMP NULL,
	IsActive BOOLEAN DEFAULT TRUE,
	IsDeleted BOOLEAN DEFAULT FALSE,
	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	LastLoginAt TIMESTAMP NULL,

	CONSTRAINT chk_email CHECK (Email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON Users(Email);
CREATE INDEX idx_users_email_verification_token ON Users(EmailVerificationToken);
CREATE INDEX idx_users_password_reset_token ON Users(PasswordResetToken);
```

#### 1.2 RefreshTokens
```sql
CREATE TABLE RefreshTokens (
	Id SERIAL PRIMARY KEY,
	UserId UUID NOT NULL,
	Token VARCHAR(500) UNIQUE NOT NULL,
	ExpiresAt TIMESTAMP NOT NULL,
	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	RevokedAt TIMESTAMP NULL,
	ReplacedByToken VARCHAR(500) NULL,
	IsRevoked BOOLEAN DEFAULT FALSE,
	CreatedByIp VARCHAR(50) NULL,
	RevokedByIp VARCHAR(50) NULL,

	CONSTRAINT fk_refreshtokens_users FOREIGN KEY (UserId) 
		REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE INDEX idx_refreshtokens_user ON RefreshTokens(UserId);
CREATE INDEX idx_refreshtokens_token ON RefreshTokens(Token);
```

#### 1.3 OAuthProviders
```sql
CREATE TABLE OAuthProviders (
	Id SERIAL PRIMARY KEY,
	UserId UUID NOT NULL,
	Provider VARCHAR(50) NOT NULL, -- 'Google', 'Facebook', etc.
	ProviderUserId VARCHAR(255) NOT NULL,
	AccessToken TEXT NULL,
	RefreshToken TEXT NULL,
	TokenExpiresAt TIMESTAMP NULL,
	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_oauthproviders_users FOREIGN KEY (UserId) 
		REFERENCES Users(Id) ON DELETE CASCADE,
	CONSTRAINT uq_provider_user UNIQUE (Provider, ProviderUserId)
);

CREATE INDEX idx_oauthproviders_user ON OAuthProviders(UserId);
CREATE INDEX idx_oauthproviders_provider_userid ON OAuthProviders(Provider, ProviderUserId);
```

#### 1.4 LoginAttempts
```sql
CREATE TABLE LoginAttempts (
	Id SERIAL PRIMARY KEY,
	Email VARCHAR(255) NOT NULL,
	IpAddress VARCHAR(50) NOT NULL,
	Success BOOLEAN NOT NULL,
	FailureReason VARCHAR(255) NULL,
	AttemptedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UserAgent TEXT NULL
);

CREATE INDEX idx_loginattempts_email ON LoginAttempts(Email);
CREATE INDEX idx_loginattempts_ip ON LoginAttempts(IpAddress);
CREATE INDEX idx_loginattempts_date ON LoginAttempts(AttemptedAt);
```

---

## 2. UserDB (PostgreSQL)

### Purpose
Store user profile information, preferences, and member data.

### Tables

#### 2.1 UserProfiles
```sql
CREATE TABLE UserProfiles (
	Id UUID PRIMARY KEY, -- Same as AuthDB Users.Id
	FirstName VARCHAR(100) NOT NULL,
	LastName VARCHAR(100) NOT NULL,
	DisplayName VARCHAR(200) NULL,
	AvatarUrl VARCHAR(500) NULL,
	Bio TEXT NULL,
	DateOfBirth DATE NULL,
	Gender VARCHAR(20) NULL,
	PhoneNumber VARCHAR(20) NULL,

	-- JNV Specific
	JNV VARCHAR(200) NULL, -- Jawahar Navodaya Vidyalaya name
	Batch VARCHAR(10) NULL, -- e.g., "2015", "2020"
	StudentId VARCHAR(50) NULL,

	-- Address
	AddressLine1 VARCHAR(255) NULL,
	AddressLine2 VARCHAR(255) NULL,
	City VARCHAR(100) NULL,
	State VARCHAR(100) NULL,
	Country VARCHAR(100) NULL,
	PostalCode VARCHAR(20) NULL,

	-- Social
	LinkedInUrl VARCHAR(500) NULL,
	TwitterHandle VARCHAR(100) NULL,
	GitHubUsername VARCHAR(100) NULL,

	IsProfileComplete BOOLEAN DEFAULT FALSE,
	IsPublic BOOLEAN DEFAULT TRUE,
	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_userprofiles_jnv ON UserProfiles(JNV);
CREATE INDEX idx_userprofiles_batch ON UserProfiles(Batch);
CREATE INDEX idx_userprofiles_displayname ON UserProfiles(DisplayName);
```

#### 2.2 UserRoles
```sql
CREATE TABLE Roles (
	Id SERIAL PRIMARY KEY,
	Name VARCHAR(50) UNIQUE NOT NULL, -- 'Admin', 'Moderator', 'Member', 'EventOrganizer'
	Description TEXT NULL,
	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE UserRoleAssignments (
	Id SERIAL PRIMARY KEY,
	UserId UUID NOT NULL,
	RoleId INT NOT NULL,
	AssignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	AssignedBy UUID NULL,
	ExpiresAt TIMESTAMP NULL,

	CONSTRAINT fk_userroles_users FOREIGN KEY (UserId) 
		REFERENCES UserProfiles(Id) ON DELETE CASCADE,
	CONSTRAINT fk_userroles_roles FOREIGN KEY (RoleId) 
		REFERENCES Roles(Id) ON DELETE CASCADE,
	CONSTRAINT uq_user_role UNIQUE (UserId, RoleId)
);

CREATE INDEX idx_userroles_user ON UserRoleAssignments(UserId);
```

#### 2.3 UserPreferences
```sql
CREATE TABLE UserPreferences (
	Id SERIAL PRIMARY KEY,
	UserId UUID UNIQUE NOT NULL,
	EmailNotifications BOOLEAN DEFAULT TRUE,
	PushNotifications BOOLEAN DEFAULT TRUE,
	SmsNotifications BOOLEAN DEFAULT FALSE,
	EventReminders BOOLEAN DEFAULT TRUE,
	AnnouncementAlerts BOOLEAN DEFAULT TRUE,
	DiscussionUpdates BOOLEAN DEFAULT TRUE,
	Theme VARCHAR(20) DEFAULT 'light', -- 'light', 'dark'
	Language VARCHAR(10) DEFAULT 'en',
	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_userpreferences_users FOREIGN KEY (UserId) 
		REFERENCES UserProfiles(Id) ON DELETE CASCADE
);
```

#### 2.4 UserConnections
```sql
CREATE TABLE UserConnections (
	Id SERIAL PRIMARY KEY,
	UserId UUID NOT NULL,
	ConnectedUserId UUID NOT NULL,
	Status VARCHAR(20) NOT NULL, -- 'Pending', 'Accepted', 'Blocked'
	RequestedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	AcceptedAt TIMESTAMP NULL,

	CONSTRAINT fk_connections_user FOREIGN KEY (UserId) 
		REFERENCES UserProfiles(Id) ON DELETE CASCADE,
	CONSTRAINT fk_connections_connected FOREIGN KEY (ConnectedUserId) 
		REFERENCES UserProfiles(Id) ON DELETE CASCADE,
	CONSTRAINT chk_not_self_connection CHECK (UserId != ConnectedUserId),
	CONSTRAINT uq_user_connection UNIQUE (UserId, ConnectedUserId)
);

CREATE INDEX idx_userconnections_user ON UserConnections(UserId);
CREATE INDEX idx_userconnections_status ON UserConnections(Status);
```

---

## 3. EventDB (PostgreSQL)

### Purpose
Store all event-related data including general events and trekking expeditions.

### Tables

#### 3.1 EventCategories
```sql
CREATE TABLE EventCategories (
	Id SERIAL PRIMARY KEY,
	Name VARCHAR(100) UNIQUE NOT NULL,
	Slug VARCHAR(100) UNIQUE NOT NULL,
	Description TEXT NULL,
	Icon VARCHAR(50) NULL,
	Color VARCHAR(20) NULL,
	IsActive BOOLEAN DEFAULT TRUE,
	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data
INSERT INTO EventCategories (Name, Slug, Icon, Color) VALUES
	('Workshop', 'workshop', 'wrench', '#3B82F6'),
	('Trekking', 'trekking', 'mountain', '#10B981'),
	('Networking', 'networking', 'users', '#8B5CF6'),
	('Sports', 'sports', 'activity', '#EF4444'),
	('Cultural', 'cultural', 'music', '#F59E0B'),
	('Social', 'social', 'coffee', '#EC4899');
```

#### 3.2 Events
```sql
CREATE TABLE Events (
	Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	Title VARCHAR(255) NOT NULL,
	Description TEXT NOT NULL,
	CategoryId INT NOT NULL,
	EventType VARCHAR(20) NOT NULL, -- 'General', 'Trekking'

	-- Date & Time
	StartDate TIMESTAMP NOT NULL,
	EndDate TIMESTAMP NOT NULL,
	RegistrationDeadline TIMESTAMP NULL,

	-- Location
	LocationName VARCHAR(255) NULL,
	LocationAddress TEXT NULL,
	Latitude DECIMAL(10, 8) NULL,
	Longitude DECIMAL(11, 8) NULL,
	IsOnline BOOLEAN DEFAULT FALSE,
	OnlineMeetingUrl VARCHAR(500) NULL,

	-- Capacity
	MaxAttendees INT NULL,
	CurrentAttendees INT DEFAULT 0,
	WaitlistEnabled BOOLEAN DEFAULT FALSE,

	-- Pricing
	IsFree BOOLEAN DEFAULT TRUE,
	Price DECIMAL(10, 2) NULL,
	Currency VARCHAR(10) DEFAULT 'INR',

	-- Status
	Status VARCHAR(20) NOT NULL DEFAULT 'Draft', -- 'Draft', 'Published', 'Cancelled', 'Completed'

	-- Media
	BannerImageUrl VARCHAR(500) NULL,
	ThumbnailUrl VARCHAR(500) NULL,

	-- Metadata
	CreatedBy UUID NOT NULL,
	OrganizerId UUID NOT NULL,
	IsPublic BOOLEAN DEFAULT TRUE,
	IsFeatured BOOLEAN DEFAULT FALSE,
	Tags TEXT[], -- PostgreSQL array for tags

	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PublishedAt TIMESTAMP NULL,
	CancelledAt TIMESTAMP NULL,

	CONSTRAINT fk_events_category FOREIGN KEY (CategoryId) 
		REFERENCES EventCategories(Id),
	CONSTRAINT chk_dates CHECK (EndDate >= StartDate),
	CONSTRAINT chk_price CHECK (Price IS NULL OR Price >= 0)
);

CREATE INDEX idx_events_category ON Events(CategoryId);
CREATE INDEX idx_events_start_date ON Events(StartDate);
CREATE INDEX idx_events_status ON Events(Status);
CREATE INDEX idx_events_created_by ON Events(CreatedBy);
CREATE INDEX idx_events_tags ON Events USING GIN(Tags);
```

#### 3.3 TrekkingDetails
```sql
CREATE TABLE TrekkingDetails (
	Id SERIAL PRIMARY KEY,
	EventId UUID UNIQUE NOT NULL,
	Difficulty VARCHAR(20) NOT NULL, -- 'Easy', 'Moderate', 'Hard', 'Expert'
	Duration INT NOT NULL, -- Duration in days
	DistanceKm DECIMAL(6, 2) NULL,
	MaxAltitude INT NULL, -- in meters

	-- Trek specific
	BaseLocation VARCHAR(255) NULL,
	TrekRoute TEXT NULL,

	-- Requirements
	MinAge INT DEFAULT 18,
	MaxAge INT NULL,
	FitnessLevel VARCHAR(20) NULL, -- 'Beginner', 'Intermediate', 'Advanced'
	RequiredEquipment TEXT[] NULL,
	ProvidedEquipment TEXT[] NULL,

	-- Itinerary
	ItineraryJson JSONB NULL, -- Store day-wise itinerary

	-- Safety
	GuideProvided BOOLEAN DEFAULT TRUE,
	MedicalSupportAvailable BOOLEAN DEFAULT TRUE,
	InsuranceIncluded BOOLEAN DEFAULT FALSE,

	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_trekking_event FOREIGN KEY (EventId) 
		REFERENCES Events(Id) ON DELETE CASCADE
);

CREATE INDEX idx_trekking_difficulty ON TrekkingDetails(Difficulty);
```

#### 3.4 EventRSVPs
```sql
CREATE TABLE EventRSVPs (
	Id SERIAL PRIMARY KEY,
	EventId UUID NOT NULL,
	UserId UUID NOT NULL,
	Status VARCHAR(20) NOT NULL, -- 'Going', 'Interested', 'NotGoing', 'Waitlist'

	-- Booking details
	BookingReference VARCHAR(50) UNIQUE NULL,
	PaymentStatus VARCHAR(20) NULL, -- 'Pending', 'Completed', 'Failed', 'Refunded'
	AmountPaid DECIMAL(10, 2) NULL,
	TransactionId VARCHAR(100) NULL,

	-- Attendance
	CheckedIn BOOLEAN DEFAULT FALSE,
	CheckedInAt TIMESTAMP NULL,

	-- Notes
	SpecialRequirements TEXT NULL,
	DietaryRestrictions TEXT NULL,
	EmergencyContact VARCHAR(255) NULL,

	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CancelledAt TIMESTAMP NULL,

	CONSTRAINT fk_rsvps_event FOREIGN KEY (EventId) 
		REFERENCES Events(Id) ON DELETE CASCADE,
	CONSTRAINT uq_event_user UNIQUE (EventId, UserId)
);

CREATE INDEX idx_rsvps_event ON EventRSVPs(EventId);
CREATE INDEX idx_rsvps_user ON EventRSVPs(UserId);
CREATE INDEX idx_rsvps_status ON EventRSVPs(Status);
```

#### 3.5 EventReviews
```sql
CREATE TABLE EventReviews (
	Id SERIAL PRIMARY KEY,
	EventId UUID NOT NULL,
	UserId UUID NOT NULL,
	Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
	ReviewText TEXT NULL,
	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_reviews_event FOREIGN KEY (EventId) 
		REFERENCES Events(Id) ON DELETE CASCADE,
	CONSTRAINT uq_event_user_review UNIQUE (EventId, UserId)
);

CREATE INDEX idx_reviews_event ON EventReviews(EventId);
CREATE INDEX idx_reviews_rating ON EventReviews(Rating);
```

---

## 4. DiscussionDB (PostgreSQL)

### Purpose
Store discussion forums, threads, comments, and reactions.

### Tables

#### 4.1 DiscussionCategories
```sql
CREATE TABLE DiscussionCategories (
	Id SERIAL PRIMARY KEY,
	Name VARCHAR(100) UNIQUE NOT NULL,
	Slug VARCHAR(100) UNIQUE NOT NULL,
	Description TEXT NULL,
	Icon VARCHAR(50) NULL,
	Color VARCHAR(20) NULL,
	IsActive BOOLEAN DEFAULT TRUE,
	DisplayOrder INT DEFAULT 0,
	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.2 Discussions
```sql
CREATE TABLE Discussions (
	Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	Title VARCHAR(255) NOT NULL,
	Content TEXT NOT NULL,
	CategoryId INT NULL,

	-- Author
	AuthorId UUID NOT NULL,

	-- Status
	Status VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Closed', 'Pinned', 'Archived'
	IsPinned BOOLEAN DEFAULT FALSE,
	IsLocked BOOLEAN DEFAULT FALSE,

	-- Counts
	ViewCount INT DEFAULT 0,
	CommentCount INT DEFAULT 0,
	ReactionCount INT DEFAULT 0,

	-- Tags
	Tags TEXT[],

	-- Moderation
	IsModerated BOOLEAN DEFAULT FALSE,
	ModeratedBy UUID NULL,
	ModeratedAt TIMESTAMP NULL,
	ModerationReason TEXT NULL,

	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	LastActivityAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_discussions_category FOREIGN KEY (CategoryId) 
		REFERENCES DiscussionCategories(Id) ON DELETE SET NULL
);

CREATE INDEX idx_discussions_author ON Discussions(AuthorId);
CREATE INDEX idx_discussions_category ON Discussions(CategoryId);
CREATE INDEX idx_discussions_status ON Discussions(Status);
CREATE INDEX idx_discussions_created ON Discussions(CreatedAt DESC);
CREATE INDEX idx_discussions_tags ON Discussions USING GIN(Tags);
```

#### 4.3 Comments
```sql
CREATE TABLE Comments (
	Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	DiscussionId UUID NOT NULL,
	ParentCommentId UUID NULL, -- For nested replies

	Content TEXT NOT NULL,
	AuthorId UUID NOT NULL,

	-- Reactions
	LikeCount INT DEFAULT 0,

	-- Moderation
	IsDeleted BOOLEAN DEFAULT FALSE,
	DeletedBy UUID NULL,
	DeletedAt TIMESTAMP NULL,

	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_comments_discussion FOREIGN KEY (DiscussionId) 
		REFERENCES Discussions(Id) ON DELETE CASCADE,
	CONSTRAINT fk_comments_parent FOREIGN KEY (ParentCommentId) 
		REFERENCES Comments(Id) ON DELETE CASCADE
);

CREATE INDEX idx_comments_discussion ON Comments(DiscussionId);
CREATE INDEX idx_comments_parent ON Comments(ParentCommentId);
CREATE INDEX idx_comments_author ON Comments(AuthorId);
```

#### 4.4 Reactions
```sql
CREATE TABLE Reactions (
	Id SERIAL PRIMARY KEY,
	TargetType VARCHAR(20) NOT NULL, -- 'Discussion', 'Comment'
	TargetId UUID NOT NULL,
	UserId UUID NOT NULL,
	ReactionType VARCHAR(20) NOT NULL, -- 'Like', 'Love', 'Helpful', 'Insightful'
	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT uq_user_reaction UNIQUE (TargetType, TargetId, UserId)
);

CREATE INDEX idx_reactions_target ON Reactions(TargetType, TargetId);
CREATE INDEX idx_reactions_user ON Reactions(UserId);
```

---

## 5. AnnouncementDB (PostgreSQL)

### Purpose
Store community announcements and notices.

### Tables

#### 5.1 AnnouncementCategories
```sql
CREATE TABLE AnnouncementCategories (
	Id SERIAL PRIMARY KEY,
	Name VARCHAR(100) UNIQUE NOT NULL,
	Slug VARCHAR(100) UNIQUE NOT NULL,
	Icon VARCHAR(50) NULL,
	Color VARCHAR(20) NULL,
	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5.2 Announcements
```sql
CREATE TABLE Announcements (
	Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	Title VARCHAR(255) NOT NULL,
	Content TEXT NOT NULL,
	CategoryId INT NULL,

	-- Priority
	Priority VARCHAR(20) NOT NULL DEFAULT 'Normal', -- 'Low', 'Normal', 'High', 'Critical'

	-- Author
	AuthorId UUID NOT NULL,

	-- Visibility
	IsPublished BOOLEAN DEFAULT FALSE,
	PublishedAt TIMESTAMP NULL,

	-- Scheduling
	ScheduledFor TIMESTAMP NULL,
	ExpiresAt TIMESTAMP NULL,

	-- Target Audience
	TargetRoles TEXT[] NULL, -- Null means all users
	TargetBatches TEXT[] NULL,
	TargetJNVs TEXT[] NULL,

	-- Media
	BannerUrl VARCHAR(500) NULL,
	AttachmentUrls TEXT[],

	-- Stats
	ViewCount INT DEFAULT 0,

	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_announcements_category FOREIGN KEY (CategoryId) 
		REFERENCES AnnouncementCategories(Id) ON DELETE SET NULL
);

CREATE INDEX idx_announcements_author ON Announcements(AuthorId);
CREATE INDEX idx_announcements_priority ON Announcements(Priority);
CREATE INDEX idx_announcements_published ON Announcements(PublishedAt DESC);
```

#### 5.3 AnnouncementReads
```sql
CREATE TABLE AnnouncementReads (
	Id SERIAL PRIMARY KEY,
	AnnouncementId UUID NOT NULL,
	UserId UUID NOT NULL,
	ReadAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_reads_announcement FOREIGN KEY (AnnouncementId) 
		REFERENCES Announcements(Id) ON DELETE CASCADE,
	CONSTRAINT uq_user_announcement UNIQUE (AnnouncementId, UserId)
);

CREATE INDEX idx_reads_announcement ON AnnouncementReads(AnnouncementId);
CREATE INDEX idx_reads_user ON AnnouncementReads(UserId);
```

---

## 6. NotificationDB (MongoDB)

### Purpose
Store notification history and preferences (NoSQL for flexibility).

### Collections

#### 6.1 Notifications
```javascript
{
  "_id": ObjectId,
  "userId": "uuid",
  "type": "Email|Push|InApp|SMS",
  "category": "Event|Announcement|Discussion|System",
  "title": "Notification title",
  "message": "Notification content",
  "data": {
	// Additional context data
	"eventId": "uuid",
	"url": "/events/123"
  },
  "status": "Pending|Sent|Failed|Read",
  "readAt": ISODate,
  "sentAt": ISODate,
  "failureReason": "Error message if failed",
  "priority": "Low|Normal|High",
  "createdAt": ISODate,
  "expiresAt": ISODate
}

// Indexes
db.notifications.createIndex({ "userId": 1, "createdAt": -1 })
db.notifications.createIndex({ "status": 1 })
db.notifications.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 })
```

#### 6.2 NotificationTemplates
```javascript
{
  "_id": ObjectId,
  "name": "EventReminder",
  "type": "Email|Push|SMS",
  "subject": "{{eventName}} is starting soon!",
  "body": "HTML or text template with {{placeholders}}",
  "isActive": true,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

---

## 7. AnalyticsDB (TimescaleDB)

### Purpose
Store time-series data for analytics and reporting.

### Tables (Hypertables)

#### 7.1 EventMetrics
```sql
CREATE TABLE EventMetrics (
	Time TIMESTAMPTZ NOT NULL,
	EventId UUID NOT NULL,
	MetricType VARCHAR(50) NOT NULL, -- 'View', 'RSVP', 'CheckIn'
	UserId UUID NULL,
	Value NUMERIC NULL,
	Metadata JSONB NULL
);

SELECT create_hypertable('EventMetrics', 'Time');
CREATE INDEX idx_eventmetrics_event ON EventMetrics(EventId, Time DESC);
```

#### 7.2 UserEngagement
```sql
CREATE TABLE UserEngagement (
	Time TIMESTAMPTZ NOT NULL,
	UserId UUID NOT NULL,
	ActionType VARCHAR(50) NOT NULL, -- 'Login', 'ProfileView', 'PostCreated'
	TargetType VARCHAR(50) NULL,
	TargetId UUID NULL,
	SessionId VARCHAR(100) NULL,
	IpAddress VARCHAR(50) NULL,
	UserAgent TEXT NULL
);

SELECT create_hypertable('UserEngagement', 'Time');
CREATE INDEX idx_engagement_user ON UserEngagement(UserId, Time DESC);
```

---

## 8. MediaDB (PostgreSQL + Blob Storage)

### Purpose
Store file metadata (actual files in Azure Blob/S3).

### Tables

#### 8.1 MediaFiles
```sql
CREATE TABLE MediaFiles (
	Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	FileName VARCHAR(255) NOT NULL,
	OriginalFileName VARCHAR(255) NOT NULL,
	MimeType VARCHAR(100) NOT NULL,
	FileSize BIGINT NOT NULL, -- in bytes

	-- Storage
	StorageProvider VARCHAR(50) NOT NULL, -- 'Azure', 'AWS', 'Local'
	StoragePath VARCHAR(500) NOT NULL,
	BlobUrl VARCHAR(1000) NOT NULL,
	CdnUrl VARCHAR(1000) NULL,

	-- Metadata
	Width INT NULL, -- for images
	Height INT NULL,
	Duration INT NULL, -- for videos (seconds)

	-- Ownership
	UploadedBy UUID NOT NULL,
	EntityType VARCHAR(50) NULL, -- 'Event', 'User', 'Announcement'
	EntityId UUID NULL,

	-- Status
	IsPublic BOOLEAN DEFAULT FALSE,
	IsProcessed BOOLEAN DEFAULT FALSE,
	ProcessingStatus VARCHAR(50) DEFAULT 'Pending',

	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	DeletedAt TIMESTAMP NULL
);

CREATE INDEX idx_media_uploader ON MediaFiles(UploadedBy);
CREATE INDEX idx_media_entity ON MediaFiles(EntityType, EntityId);
```

---

## 🔄 Database Relationships Summary

### Cross-Database References
Since we're using microservices with separate databases, foreign keys across databases are not possible. Instead:

1. **Store User IDs as strings (UUID)** in all databases
2. **Use API calls** between services to fetch related data
3. **Implement eventual consistency** for critical data
4. **Use message queue** for data synchronization

### Example Flow
```
Event created → Event Service
	  ↓
Event Service publishes "EventCreated" message
	  ↓
Notification Service receives message
	  ↓
Notification Service calls User Service to get user emails
	  ↓
Sends notifications
```

---

## 🛠️ Database Setup Scripts

See `database-setup/` folder for:
- `01-setup-authdb.sql`
- `02-setup-userdb.sql`
- `03-setup-eventdb.sql`
- `04-setup-discussiondb.sql`
- `05-setup-announcementdb.sql`
- `06-setup-mediadb.sql`
- `07-setup-analyticsdb.sql`

---

**Version**: 1.0  
**Last Updated**: 2024
