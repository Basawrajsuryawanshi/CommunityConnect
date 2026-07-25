# CommunityConnect - SQL Server Database Schemas

## 🗄️ Complete SQL Server Database Design

**Database Server**: Microsoft SQL Server 2022  
**Total Databases**: 8 (7 SQL Server + 1 MongoDB)

---

## 🎯 Quick Setup Script

```sql
-- Run this to create all databases at once
USE master;
GO

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

-- Verify databases created
SELECT name FROM sys.databases WHERE name IN 
	('AuthDB', 'UserDB', 'EventDB', 'DiscussionDB', 'AnnouncementDB', 'MediaDB', 'AnalyticsDB');
GO
```

---

## 1. AuthDB - Authentication Database

```sql
USE AuthDB;
GO

-- ============================================
-- Table: Users
-- Purpose: Store user authentication credentials
-- ============================================
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

-- Indexes for Users
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_EmailVerificationToken ON Users(EmailVerificationToken) WHERE EmailVerificationToken IS NOT NULL;
CREATE INDEX IX_Users_PasswordResetToken ON Users(PasswordResetToken) WHERE PasswordResetToken IS NOT NULL;
CREATE INDEX IX_Users_IsActive ON Users(IsActive) WHERE IsActive = 1;
GO

-- ============================================
-- Table: RefreshTokens
-- Purpose: Manage JWT refresh tokens
-- ============================================
CREATE TABLE RefreshTokens (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	UserId UNIQUEIDENTIFIER NOT NULL,
	Token NVARCHAR(500) NOT NULL,
	ExpiresAt DATETIME2 NOT NULL,
	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
	RevokedAt DATETIME2 NULL,
	ReplacedByToken NVARCHAR(500) NULL,
	IsRevoked BIT DEFAULT 0,
	CreatedByIp NVARCHAR(50) NULL,
	RevokedByIp NVARCHAR(50) NULL,

	CONSTRAINT FK_RefreshTokens_Users FOREIGN KEY (UserId) 
		REFERENCES Users(Id) ON DELETE CASCADE,
	CONSTRAINT UQ_RefreshTokens_Token UNIQUE (Token)
);

-- Indexes for RefreshTokens
CREATE INDEX IX_RefreshTokens_UserId ON RefreshTokens(UserId);
CREATE INDEX IX_RefreshTokens_Token ON RefreshTokens(Token);
CREATE INDEX IX_RefreshTokens_ExpiresAt ON RefreshTokens(ExpiresAt);
CREATE INDEX IX_RefreshTokens_IsRevoked ON RefreshTokens(IsRevoked) WHERE IsRevoked = 0;
GO

-- ============================================
-- Table: OAuthProviders
-- Purpose: Store OAuth provider information (Google, Facebook, etc.)
-- ============================================
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
	CONSTRAINT UQ_OAuthProviders_Provider_ProviderUserId UNIQUE (Provider, ProviderUserId)
);

-- Indexes for OAuthProviders
CREATE INDEX IX_OAuthProviders_UserId ON OAuthProviders(UserId);
CREATE INDEX IX_OAuthProviders_Provider_ProviderUserId ON OAuthProviders(Provider, ProviderUserId);
GO

-- ============================================
-- Table: LoginAttempts
-- Purpose: Track login attempts for security
-- ============================================
CREATE TABLE LoginAttempts (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	Email NVARCHAR(255) NOT NULL,
	IpAddress NVARCHAR(50) NOT NULL,
	Success BIT NOT NULL,
	FailureReason NVARCHAR(255) NULL,
	AttemptedAt DATETIME2 DEFAULT GETUTCDATE(),
	UserAgent NVARCHAR(MAX) NULL
);

-- Indexes for LoginAttempts
CREATE INDEX IX_LoginAttempts_Email ON LoginAttempts(Email);
CREATE INDEX IX_LoginAttempts_IpAddress ON LoginAttempts(IpAddress);
CREATE INDEX IX_LoginAttempts_AttemptedAt ON LoginAttempts(AttemptedAt DESC);
CREATE INDEX IX_LoginAttempts_Success ON LoginAttempts(Success);
GO
```

---

## 2. UserDB - User Management Database

```sql
USE UserDB;
GO

-- ============================================
-- Table: UserProfiles
-- Purpose: Store user profile information
-- ============================================
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

-- Indexes for UserProfiles
CREATE INDEX IX_UserProfiles_JNV ON UserProfiles(JNV);
CREATE INDEX IX_UserProfiles_Batch ON UserProfiles(Batch);
CREATE INDEX IX_UserProfiles_DisplayName ON UserProfiles(DisplayName);
CREATE INDEX IX_UserProfiles_City ON UserProfiles(City);
CREATE INDEX IX_UserProfiles_IsPublic ON UserProfiles(IsPublic) WHERE IsPublic = 1;
GO

-- ============================================
-- Table: Roles
-- Purpose: Define system roles
-- ============================================
CREATE TABLE Roles (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	Name NVARCHAR(50) NOT NULL UNIQUE,
	Description NVARCHAR(MAX) NULL,
	CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Seed roles
INSERT INTO Roles (Name, Description) VALUES
('Admin', 'System administrator with full access'),
('Moderator', 'Content moderator with moderation permissions'),
('EventOrganizer', 'Can create and manage events'),
('Member', 'Regular community member');
GO

-- ============================================
-- Table: UserRoleAssignments
-- Purpose: Assign roles to users
-- ============================================
CREATE TABLE UserRoleAssignments (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	UserId UNIQUEIDENTIFIER NOT NULL,
	RoleId INT NOT NULL,
	AssignedAt DATETIME2 DEFAULT GETUTCDATE(),
	AssignedBy UNIQUEIDENTIFIER NULL,
	ExpiresAt DATETIME2 NULL,

	CONSTRAINT FK_UserRoleAssignments_Users FOREIGN KEY (UserId) 
		REFERENCES UserProfiles(Id) ON DELETE CASCADE,
	CONSTRAINT FK_UserRoleAssignments_Roles FOREIGN KEY (RoleId) 
		REFERENCES Roles(Id) ON DELETE CASCADE,
	CONSTRAINT UQ_UserRoleAssignments_User_Role UNIQUE (UserId, RoleId)
);

-- Indexes
CREATE INDEX IX_UserRoleAssignments_UserId ON UserRoleAssignments(UserId);
CREATE INDEX IX_UserRoleAssignments_RoleId ON UserRoleAssignments(RoleId);
GO

-- ============================================
-- Table: UserPreferences
-- Purpose: Store user preferences
-- ============================================
CREATE TABLE UserPreferences (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	UserId UNIQUEIDENTIFIER NOT NULL UNIQUE,
	EmailNotifications BIT DEFAULT 1,
	PushNotifications BIT DEFAULT 1,
	SmsNotifications BIT DEFAULT 0,
	EventReminders BIT DEFAULT 1,
	AnnouncementAlerts BIT DEFAULT 1,
	DiscussionUpdates BIT DEFAULT 1,
	Theme NVARCHAR(20) DEFAULT 'light',
	Language NVARCHAR(10) DEFAULT 'en',
	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
	UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

	CONSTRAINT FK_UserPreferences_Users FOREIGN KEY (UserId) 
		REFERENCES UserProfiles(Id) ON DELETE CASCADE
);
GO

-- ============================================
-- Table: UserConnections
-- Purpose: Manage user connections/friendships
-- ============================================
CREATE TABLE UserConnections (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	UserId UNIQUEIDENTIFIER NOT NULL,
	ConnectedUserId UNIQUEIDENTIFIER NOT NULL,
	Status NVARCHAR(20) NOT NULL DEFAULT 'Pending',
	RequestedAt DATETIME2 DEFAULT GETUTCDATE(),
	AcceptedAt DATETIME2 NULL,

	CONSTRAINT FK_UserConnections_User FOREIGN KEY (UserId) 
		REFERENCES UserProfiles(Id) ON DELETE NO ACTION,
	CONSTRAINT FK_UserConnections_ConnectedUser FOREIGN KEY (ConnectedUserId) 
		REFERENCES UserProfiles(Id) ON DELETE NO ACTION,
	CONSTRAINT CHK_UserConnections_NotSelf CHECK (UserId != ConnectedUserId),
	CONSTRAINT UQ_UserConnections_User_ConnectedUser UNIQUE (UserId, ConnectedUserId)
);

-- Indexes
CREATE INDEX IX_UserConnections_UserId ON UserConnections(UserId);
CREATE INDEX IX_UserConnections_ConnectedUserId ON UserConnections(ConnectedUserId);
CREATE INDEX IX_UserConnections_Status ON UserConnections(Status);
GO
```

---

## 3. EventDB - Events Management Database

```sql
USE EventDB;
GO

-- ============================================
-- Table: EventCategories
-- Purpose: Categorize events
-- ============================================
CREATE TABLE EventCategories (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	Name NVARCHAR(100) NOT NULL UNIQUE,
	Slug NVARCHAR(100) NOT NULL UNIQUE,
	Description NVARCHAR(MAX) NULL,
	Icon NVARCHAR(50) NULL,
	Color NVARCHAR(20) NULL,
	IsActive BIT DEFAULT 1,
	CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Seed categories
INSERT INTO EventCategories (Name, Slug, Icon, Color) VALUES
('Workshop', 'workshop', 'wrench', '#3B82F6'),
('Trekking', 'trekking', 'mountain', '#10B981'),
('Networking', 'networking', 'users', '#8B5CF6'),
('Sports', 'sports', 'activity', '#EF4444'),
('Cultural', 'cultural', 'music', '#F59E0B'),
('Social', 'social', 'coffee', '#EC4899');
GO

-- ============================================
-- Table: Events
-- Purpose: Store event information
-- ============================================
CREATE TABLE Events (
	Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
	Title NVARCHAR(255) NOT NULL,
	Description NVARCHAR(MAX) NOT NULL,
	CategoryId INT NOT NULL,
	EventType NVARCHAR(20) NOT NULL DEFAULT 'General',

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
	Tags NVARCHAR(MAX) NULL,

	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
	UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
	PublishedAt DATETIME2 NULL,
	CancelledAt DATETIME2 NULL,

	CONSTRAINT FK_Events_Category FOREIGN KEY (CategoryId) 
		REFERENCES EventCategories(Id),
	CONSTRAINT CHK_Events_Dates CHECK (EndDate >= StartDate),
	CONSTRAINT CHK_Events_Price CHECK (Price IS NULL OR Price >= 0)
);

-- Indexes
CREATE INDEX IX_Events_CategoryId ON Events(CategoryId);
CREATE INDEX IX_Events_StartDate ON Events(StartDate DESC);
CREATE INDEX IX_Events_EndDate ON Events(EndDate);
CREATE INDEX IX_Events_Status ON Events(Status);
CREATE INDEX IX_Events_CreatedBy ON Events(CreatedBy);
CREATE INDEX IX_Events_IsFeatured ON Events(IsFeatured) WHERE IsFeatured = 1;
CREATE INDEX IX_Events_IsPublic ON Events(IsPublic) WHERE IsPublic = 1;
GO

-- ============================================
-- Table: TrekkingDetails
-- Purpose: Store trekking-specific details
-- ============================================
CREATE TABLE TrekkingDetails (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	EventId UNIQUEIDENTIFIER NOT NULL UNIQUE,
	Difficulty NVARCHAR(20) NOT NULL,
	Duration INT NOT NULL,
	DistanceKm DECIMAL(6, 2) NULL,
	MaxAltitude INT NULL,

	-- Trek specific
	BaseLocation NVARCHAR(255) NULL,
	TrekRoute NVARCHAR(MAX) NULL,

	-- Requirements
	MinAge INT DEFAULT 18,
	MaxAge INT NULL,
	FitnessLevel NVARCHAR(20) NULL,
	RequiredEquipment NVARCHAR(MAX) NULL,
	ProvidedEquipment NVARCHAR(MAX) NULL,

	-- Itinerary (stored as JSON)
	ItineraryJson NVARCHAR(MAX) NULL,

	-- Safety
	GuideProvided BIT DEFAULT 1,
	MedicalSupportAvailable BIT DEFAULT 1,
	InsuranceIncluded BIT DEFAULT 0,

	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
	UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

	CONSTRAINT FK_TrekkingDetails_Event FOREIGN KEY (EventId) 
		REFERENCES Events(Id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IX_TrekkingDetails_EventId ON TrekkingDetails(EventId);
CREATE INDEX IX_TrekkingDetails_Difficulty ON TrekkingDetails(Difficulty);
GO

-- ============================================
-- Table: EventRSVPs
-- Purpose: Manage event registrations
-- ============================================
CREATE TABLE EventRSVPs (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	EventId UNIQUEIDENTIFIER NOT NULL,
	UserId UNIQUEIDENTIFIER NOT NULL,
	Status NVARCHAR(20) NOT NULL DEFAULT 'Going',

	-- Booking details
	BookingReference NVARCHAR(50) NULL UNIQUE,
	PaymentStatus NVARCHAR(20) NULL,
	AmountPaid DECIMAL(10, 2) NULL,
	TransactionId NVARCHAR(100) NULL,

	-- Attendance
	CheckedIn BIT DEFAULT 0,
	CheckedInAt DATETIME2 NULL,

	-- Notes
	SpecialRequirements NVARCHAR(MAX) NULL,
	DietaryRestrictions NVARCHAR(MAX) NULL,
	EmergencyContact NVARCHAR(255) NULL,

	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
	UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
	CancelledAt DATETIME2 NULL,

	CONSTRAINT FK_EventRSVPs_Event FOREIGN KEY (EventId) 
		REFERENCES Events(Id) ON DELETE CASCADE,
	CONSTRAINT UQ_EventRSVPs_Event_User UNIQUE (EventId, UserId)
);

-- Indexes
CREATE INDEX IX_EventRSVPs_EventId ON EventRSVPs(EventId);
CREATE INDEX IX_EventRSVPs_UserId ON EventRSVPs(UserId);
CREATE INDEX IX_EventRSVPs_Status ON EventRSVPs(Status);
CREATE INDEX IX_EventRSVPs_BookingReference ON EventRSVPs(BookingReference);
GO

-- ============================================
-- Table: EventReviews
-- Purpose: Store event reviews and ratings
-- ============================================
CREATE TABLE EventReviews (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	EventId UNIQUEIDENTIFIER NOT NULL,
	UserId UNIQUEIDENTIFIER NOT NULL,
	Rating INT NOT NULL,
	ReviewText NVARCHAR(MAX) NULL,
	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
	UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

	CONSTRAINT FK_EventReviews_Event FOREIGN KEY (EventId) 
		REFERENCES Events(Id) ON DELETE CASCADE,
	CONSTRAINT CHK_EventReviews_Rating CHECK (Rating >= 1 AND Rating <= 5),
	CONSTRAINT UQ_EventReviews_Event_User UNIQUE (EventId, UserId)
);

-- Indexes
CREATE INDEX IX_EventReviews_EventId ON EventReviews(EventId);
CREATE INDEX IX_EventReviews_UserId ON EventReviews(UserId);
CREATE INDEX IX_EventReviews_Rating ON EventReviews(Rating);
GO
```

---

## 4. DiscussionDB - Forums Database

```sql
USE DiscussionDB;
GO

-- ============================================
-- Table: DiscussionCategories
-- Purpose: Categorize discussion threads
-- ============================================
CREATE TABLE DiscussionCategories (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	Name NVARCHAR(100) NOT NULL UNIQUE,
	Slug NVARCHAR(100) NOT NULL UNIQUE,
	Description NVARCHAR(MAX) NULL,
	Icon NVARCHAR(50) NULL,
	Color NVARCHAR(20) NULL,
	IsActive BIT DEFAULT 1,
	DisplayOrder INT DEFAULT 0,
	CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);
GO

-- ============================================
-- Table: Discussions
-- Purpose: Discussion threads
-- ============================================
CREATE TABLE Discussions (
	Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
	Title NVARCHAR(255) NOT NULL,
	Content NVARCHAR(MAX) NOT NULL,
	CategoryId INT NULL,

	-- Author
	AuthorId UNIQUEIDENTIFIER NOT NULL,

	-- Status
	Status NVARCHAR(20) DEFAULT 'Active',
	IsPinned BIT DEFAULT 0,
	IsLocked BIT DEFAULT 0,

	-- Counts
	ViewCount INT DEFAULT 0,
	CommentCount INT DEFAULT 0,
	ReactionCount INT DEFAULT 0,

	-- Tags (stored as JSON)
	Tags NVARCHAR(MAX) NULL,

	-- Moderation
	IsModerated BIT DEFAULT 0,
	ModeratedBy UNIQUEIDENTIFIER NULL,
	ModeratedAt DATETIME2 NULL,
	ModerationReason NVARCHAR(MAX) NULL,

	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
	UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
	LastActivityAt DATETIME2 DEFAULT GETUTCDATE(),

	CONSTRAINT FK_Discussions_Category FOREIGN KEY (CategoryId) 
		REFERENCES DiscussionCategories(Id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IX_Discussions_AuthorId ON Discussions(AuthorId);
CREATE INDEX IX_Discussions_CategoryId ON Discussions(CategoryId);
CREATE INDEX IX_Discussions_Status ON Discussions(Status);
CREATE INDEX IX_Discussions_CreatedAt ON Discussions(CreatedAt DESC);
CREATE INDEX IX_Discussions_LastActivityAt ON Discussions(LastActivityAt DESC);
CREATE INDEX IX_Discussions_IsPinned ON Discussions(IsPinned) WHERE IsPinned = 1;
GO

-- ============================================
-- Table: Comments
-- Purpose: Comments on discussions
-- ============================================
CREATE TABLE Comments (
	Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
	DiscussionId UNIQUEIDENTIFIER NOT NULL,
	ParentCommentId UNIQUEIDENTIFIER NULL,

	Content NVARCHAR(MAX) NOT NULL,
	AuthorId UNIQUEIDENTIFIER NOT NULL,

	-- Reactions
	LikeCount INT DEFAULT 0,

	-- Moderation
	IsDeleted BIT DEFAULT 0,
	DeletedBy UNIQUEIDENTIFIER NULL,
	DeletedAt DATETIME2 NULL,

	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
	UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

	CONSTRAINT FK_Comments_Discussion FOREIGN KEY (DiscussionId) 
		REFERENCES Discussions(Id) ON DELETE CASCADE,
	CONSTRAINT FK_Comments_ParentComment FOREIGN KEY (ParentCommentId) 
		REFERENCES Comments(Id) ON DELETE NO ACTION
);

-- Indexes
CREATE INDEX IX_Comments_DiscussionId ON Comments(DiscussionId);
CREATE INDEX IX_Comments_ParentCommentId ON Comments(ParentCommentId);
CREATE INDEX IX_Comments_AuthorId ON Comments(AuthorId);
CREATE INDEX IX_Comments_IsDeleted ON Comments(IsDeleted) WHERE IsDeleted = 0;
GO

-- ============================================
-- Table: Reactions
-- Purpose: Reactions to discussions and comments
-- ============================================
CREATE TABLE Reactions (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	TargetType NVARCHAR(20) NOT NULL,
	TargetId UNIQUEIDENTIFIER NOT NULL,
	UserId UNIQUEIDENTIFIER NOT NULL,
	ReactionType NVARCHAR(20) NOT NULL,
	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

	CONSTRAINT UQ_Reactions_Target_User UNIQUE (TargetType, TargetId, UserId)
);

-- Indexes
CREATE INDEX IX_Reactions_Target ON Reactions(TargetType, TargetId);
CREATE INDEX IX_Reactions_UserId ON Reactions(UserId);
GO
```

---

## 5. AnnouncementDB - Announcements Database

```sql
USE AnnouncementDB;
GO

-- ============================================
-- Table: AnnouncementCategories
-- ============================================
CREATE TABLE AnnouncementCategories (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	Name NVARCHAR(100) NOT NULL UNIQUE,
	Slug NVARCHAR(100) NOT NULL UNIQUE,
	Icon NVARCHAR(50) NULL,
	Color NVARCHAR(20) NULL,
	CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);
GO

-- ============================================
-- Table: Announcements
-- ============================================
CREATE TABLE Announcements (
	Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
	Title NVARCHAR(255) NOT NULL,
	Content NVARCHAR(MAX) NOT NULL,
	CategoryId INT NULL,

	-- Priority
	Priority NVARCHAR(20) NOT NULL DEFAULT 'Normal',

	-- Author
	AuthorId UNIQUEIDENTIFIER NOT NULL,

	-- Visibility
	IsPublished BIT DEFAULT 0,
	PublishedAt DATETIME2 NULL,

	-- Scheduling
	ScheduledFor DATETIME2 NULL,
	ExpiresAt DATETIME2 NULL,

	-- Target Audience (stored as JSON)
	TargetRoles NVARCHAR(MAX) NULL,
	TargetBatches NVARCHAR(MAX) NULL,
	TargetJNVs NVARCHAR(MAX) NULL,

	-- Media
	BannerUrl NVARCHAR(500) NULL,
	AttachmentUrls NVARCHAR(MAX) NULL,

	-- Stats
	ViewCount INT DEFAULT 0,

	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
	UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

	CONSTRAINT FK_Announcements_Category FOREIGN KEY (CategoryId) 
		REFERENCES AnnouncementCategories(Id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IX_Announcements_AuthorId ON Announcements(AuthorId);
CREATE INDEX IX_Announcements_CategoryId ON Announcements(CategoryId);
CREATE INDEX IX_Announcements_Priority ON Announcements(Priority);
CREATE INDEX IX_Announcements_PublishedAt ON Announcements(PublishedAt DESC);
CREATE INDEX IX_Announcements_ExpiresAt ON Announcements(ExpiresAt);
GO

-- ============================================
-- Table: AnnouncementReads
-- ============================================
CREATE TABLE AnnouncementReads (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	AnnouncementId UNIQUEIDENTIFIER NOT NULL,
	UserId UNIQUEIDENTIFIER NOT NULL,
	ReadAt DATETIME2 DEFAULT GETUTCDATE(),

	CONSTRAINT FK_AnnouncementReads_Announcement FOREIGN KEY (AnnouncementId) 
		REFERENCES Announcements(Id) ON DELETE CASCADE,
	CONSTRAINT UQ_AnnouncementReads_Announcement_User UNIQUE (AnnouncementId, UserId)
);

-- Indexes
CREATE INDEX IX_AnnouncementReads_AnnouncementId ON AnnouncementReads(AnnouncementId);
CREATE INDEX IX_AnnouncementReads_UserId ON AnnouncementReads(UserId);
GO
```

---

## 6. MediaDB - Media Files Database

```sql
USE MediaDB;
GO

-- ============================================
-- Table: MediaFiles
-- ============================================
CREATE TABLE MediaFiles (
	Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
	FileName NVARCHAR(255) NOT NULL,
	OriginalFileName NVARCHAR(255) NOT NULL,
	MimeType NVARCHAR(100) NOT NULL,
	FileSize BIGINT NOT NULL,

	-- Storage
	StorageProvider NVARCHAR(50) NOT NULL,
	StoragePath NVARCHAR(500) NOT NULL,
	BlobUrl NVARCHAR(1000) NOT NULL,
	CdnUrl NVARCHAR(1000) NULL,

	-- Metadata
	Width INT NULL,
	Height INT NULL,
	Duration INT NULL,

	-- Ownership
	UploadedBy UNIQUEIDENTIFIER NOT NULL,
	EntityType NVARCHAR(50) NULL,
	EntityId UNIQUEIDENTIFIER NULL,

	-- Status
	IsPublic BIT DEFAULT 0,
	IsProcessed BIT DEFAULT 0,
	ProcessingStatus NVARCHAR(50) DEFAULT 'Pending',

	CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
	UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
	DeletedAt DATETIME2 NULL
);

-- Indexes
CREATE INDEX IX_MediaFiles_UploadedBy ON MediaFiles(UploadedBy);
CREATE INDEX IX_MediaFiles_Entity ON MediaFiles(EntityType, EntityId);
CREATE INDEX IX_MediaFiles_IsPublic ON MediaFiles(IsPublic) WHERE IsPublic = 1;
GO
```

---

## 7. AnalyticsDB - Analytics Database

```sql
USE AnalyticsDB;
GO

-- ============================================
-- Table: EventMetrics
-- Purpose: Time-series event metrics
-- ============================================
CREATE TABLE EventMetrics (
	Id BIGINT IDENTITY(1,1) PRIMARY KEY,
	Time DATETIME2 NOT NULL,
	EventId UNIQUEIDENTIFIER NOT NULL,
	MetricType NVARCHAR(50) NOT NULL,
	UserId UNIQUEIDENTIFIER NULL,
	Value DECIMAL(18, 2) NULL,
	Metadata NVARCHAR(MAX) NULL
);

-- Indexes
CREATE CLUSTERED INDEX IX_EventMetrics_Time ON EventMetrics(Time);
CREATE INDEX IX_EventMetrics_EventId ON EventMetrics(EventId, Time DESC);
CREATE INDEX IX_EventMetrics_MetricType ON EventMetrics(MetricType, Time DESC);
GO

-- ============================================
-- Table: UserEngagement
-- Purpose: Track user activities
-- ============================================
CREATE TABLE UserEngagement (
	Id BIGINT IDENTITY(1,1) PRIMARY KEY,
	Time DATETIME2 NOT NULL,
	UserId UNIQUEIDENTIFIER NOT NULL,
	ActionType NVARCHAR(50) NOT NULL,
	TargetType NVARCHAR(50) NULL,
	TargetId UNIQUEIDENTIFIER NULL,
	SessionId NVARCHAR(100) NULL,
	IpAddress NVARCHAR(50) NULL,
	UserAgent NVARCHAR(MAX) NULL
);

-- Indexes
CREATE CLUSTERED INDEX IX_UserEngagement_Time ON UserEngagement(Time);
CREATE INDEX IX_UserEngagement_UserId ON UserEngagement(UserId, Time DESC);
CREATE INDEX IX_UserEngagement_ActionType ON UserEngagement(ActionType, Time DESC);
GO
```

---

## 🔍 Verification Queries

```sql
-- Check all databases
SELECT name, database_id, create_date 
FROM sys.databases 
WHERE name IN ('AuthDB', 'UserDB', 'EventDB', 'DiscussionDB', 'AnnouncementDB', 'MediaDB', 'AnalyticsDB')
ORDER BY name;

-- Check tables in each database
USE AuthDB; SELECT name FROM sys.tables;
USE UserDB; SELECT name FROM sys.tables;
USE EventDB; SELECT name FROM sys.tables;
USE DiscussionDB; SELECT name FROM sys.tables;
USE AnnouncementDB; SELECT name FROM sys.tables;
USE MediaDB; SELECT name FROM sys.tables;
USE AnalyticsDB; SELECT name FROM sys.tables;
```

---

**SQL Server schemas complete! Ready for Entity Framework migrations or direct deployment.** 🚀
