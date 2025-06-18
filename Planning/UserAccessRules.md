Roles & Features: Southern Oregon Public Safety Chaplains (SOPSC) App

1. Roles:

   This section details which roles are allowed to access certain endpoints and to what level.

   - Format:

     Guest = 1
     Member = 2
     Chaplain = 3
     Admin = 4

     - Role x:
     - Endpoint (if listed -> has access if not listed -> no access )

       - CRUD
         - Roles (if it says users -> all roles)
           - Purpose (What it does)

   - Role Access:
     - Guest 1:
       - Register (Sends system email/message to Chaplain/Admin. Once approved they will become a User)
         - CREATE
     - Member 2:
       - Login
         - CREATE
       - Communication:
         - Messages
           - CREATE
             - Members / Chaplains
               - Can send message to other Members / Chaplains
               - Can send chat requests to chat with Admins, that get approved my Chaplains in the middle.
                 - If approved they can then message the admin.
           - READ
             - Users
               - Can see any message in their inbox regardless of what role it's from.
           - UPDATE
             - Only their own messages
           - DELETE
             - All messages; Only within their own inbox
         - Call
           - CREATE
             - Members / Chaplains
             - They can request to call schedule calls with Admins. All requests are submitted to Chaplains for approval.
           - READ
             - Users
           - DELETE
             - Their own call history
         - Video Chat
           - Same rules as "Call"
         - Group Chats
           - READ
             - Can read/attend/partake in group chat messages with Users
           - DELETE
             - Can delete themselves from group chats they are in.
       - Calendar
         - READ
           - Can view calendar events viewable to them, and their role.
         - UPDATE
           - Can mark as "attending" or "declining" an event. But not actually update the event content itself.
       - Reports:
         - CREATE:
           - Can create reports they attended or were a part of.
           - Can submit "delete report requests" for reports they made. Requests go to Chaplains for approval.
         - READ:
           - Can only view reports they created.
       - Prayer Requests:
         - CREATE:
           - Can submit x number of prayer requests per day/(week?)
           - Can comment on Users prayer request
         - READ:
           - Can see posts/requests of users, as well as their comments.
         - UPDATE:
           - Can "like" or "Join in prayer" with users.
           - Can only edit the actual content of their own prayer requests
         - DELETE:
           - Can delete their own posts/requests
     - Chaplain 3:
       - Login
         - CREATE
           - Can login
       - Communication:
         - Messages
           - CREATE
             - Users
           - READ
             - Users
           - UPDATE
             - Their own messages.
           - DELETE
             - Any messages within their inbox.
         - Calls
           - CREATE
             - Users
           - READ
             - Users
           - DELETE
             - Can delete their own call history.
         - Video Call
           - Same rules as "Calls"
         - Group Chats
           - CREATE
             - Users
           - READ
             - Users
           - UPDATE
             - Can update group chat names, and add members
           - DELETE
             - Can remove group chats. (individually, or entire groups they're apart of)
       - Calendar
         - CREATE:
           - Calendar events for Members / Chaplains
         - READ:
           - View Member / Chaplain Calendar events, as well as who marked attending/not attending.
         - UPDATE:
           - Can update times, dates, and content within calendar events.
         - DELETE:
           - Can delete calandar events they created.
       - Prayer Requests
         - CREATE
           - Can create prayer requests
         - READ
           - Posts/Comments of Users
         - UPDATE
           - Their own prayer requests.
           - "Join in prayer" users.
         - DELETE
           - Their own requests.
           - Member requests.
       - Reports
         - CREATE
           - Can create reports for themselves and all Users.
           - Can create reports on behalf of other Members.
         - READ
           - Can see all reports, and hours served of each user.
         - UPDATE
           - Can update their own reports.
           - Can update reports of Members.
         - DELETE
           - Can delete their own reports.
           - Can delete reports of Members.
       - Agencies
         - CREATE:
           - Can submit "add agency requests" to Admins.
           - Can submit "agency issue reports" to Admins.
         - READ:
           - Can view full list of Agencies within their division.
           - Can view list of contact information for each agency within their division.
         - UPDATE:
           - Can update contact information of agencies within their division.
       - Admin Tools
         - CREATE
           - Create a "Promotion Request" for users whose role they belive should be upgraded. Pending Admin approval.
           - Create "User Warnings" to place on users who violated some sort of rule. Gives notification to Admins.
           - Can submit "user ban requests" to Admins for User removal.
         - READ
           - Can view join "app join requests" guests submit.
           - Can view a users "warnings" history.
         - UPDATE
           - Can approve "app join requests" submit by guests.
         - DELETE
     - Admin 4:
       - Login
         - CREATE:
         - READ:
         - UPDATE:
         - DELETE:
       - Communication:
         - Messages
           - CREATE
           - READ
           - UPDATE
           - DELETE
         - Video Call
           - CREATE
           - READ
           - UPDATE
           - DELETE
         - Phone Call
           - CREATE
           - READ
           - UPDATE
           - DELETE
       - Calendar
       - Prayer Requests
         - CREATE
         - READ
         - UPDATE
         - DELETE
       - Reports
         - CREATE
         - READ
         - UPDATE
         - DELETE
       - Agencies
       - Admin Tools
         - CREATE
         - READ
         - UPDATE
         - DELETE
     - Developer: 5
       - CRUD ALL

2. Features:
   This section lists each endpoint/data table, what they're for, and how they are used.

   - Format:

     - Table/Endpoint:
       - Purpose:
       - SQL Structure:
         - Variable:
           - Type: type Nullable: (Yes/No)
         - Table Relationships:
           - Primary Key: variable
             - ForeignKey To: ForeignTable->variable
           - Foreign Keys:
             - Variable: Table->TableVariable

   - Tables/Datasets:

     - Users:

       - Purpose: Used to store user data, as well as to navigate through the website through userId. This is the main table for the entire program.
       - SQL Structure:

         - Variables:

           - UserId:
             - Type: int Nullable: No
           - FirstName:
             - Type: nvarchar(50) Nullable: No
           - LastName:
             - Type: nvarchar(50) Nullable: No
           - Email:
             - Type: nvarchar(100) Nullable: No
           - Password:
             - Type: nvarchar(255) Nullable: No
           - DateCreated:
             - Type: datetime2(7) Nullable: No
           - LastLoginDate:
             - Type: datetime2(7) Nullable: No
           - ProfilePicturePath:
             - Type: nvarchar(255) Nullable: No
           - IsActive:
             - Type: bit Nullable: No
           - HoursServed:
             - Type: decimal(10, 2) Nullable: No
           - RoleId:
             - Type: int Nullable: No
           - IsConfirmed:
             - Type: bit Nullable: No
           - TokenId:
             - Type: int Nullable: No

         - Table Relationships:
           - Primary Key: UserId
             - ForeignKey To:
               - Media->UserId
               - Messages->SenderId
               - Messages->RecipientId
               - Notifications->UserId
               - Posts->UserId
               - Reports->UserId
               - UserTokens->UserId
           - ForeignKeys:
             - RoleId: Roles->RoleId
             - TokenId: UserTokens->TokenId

     - Communications:

       - Purpose:

         - Group chats amongst users
         - Messaging between users
         - Video chatting amongst users, and in groups
         - Voice calls amongst users, and in groups
         - Send pictures amongst users

       - Messages:

         - Purpose:
         - SQL Structure:
           - Variables:
             - MessageId:
               - Type: Nullable:
           - Table Relationships:
             - PrimaryKey:
               -ForeignKey To:
             - ForeignKeys:
               Variable: Table->Key

       - Calls: (Not implemented/created yet)

         - Purpose:
         - SQL Structure:
           - Variables:
             - MessageId:
               - Type: Nullable:
           - Table Relationships:
             - PrimaryKey:
               -ForeignKey To:
             - ForeignKeys:
               Variable: Table->Key

       - GroupChats: (Not implemented/created yet)

         - Purpose:
         - SQL Structure:
           - Variables:
             - MessageId:
               - Type: Nullable:
           - Table Relationships:
             - PrimaryKey:
               -ForeignKey To:
             - ForeignKeys:
               Variable: Table->Key

       - VideoChat: (Not implemented/created yet)

         - Purpose:
         - SQL Structure:
           - Variables:
             - MessageId:
               - Type: Nullable:
           - Table Relationships:
             - PrimaryKey:
               -ForeignKey To:
             - ForeignKeys:
               Variable: Table->Key

     - Posts or "Prayer Requests": (Not Fully Implemented Yet)

       - Purpose: Allows users to create/manage posts or "Prayer Requests". Where they can provide something they would like others to pray for/with them about. Others can "like" or
         "Join in prayer" with them giving the Prayer Request +1 "Prayers". Chaplains can also use this area to set up a group chat where people can pray over video chat/phone call
         together.
       - SQL Structure:

         - Variable:

           - Var:
             - Type: Nullable:

         - Table Relationships:
           - PrimaryKey:
             - ForeignKey To:
               - Table->Variable
           - ForeignKeys:
             - Var: Table->TablePrimaryKey

     - Reports:

       - Purpose:
         - Creating reports after a chaplain/member goes on a call to track metricks/details on how the callout went.
       - SQL Structure:

         - Variables:

           - ReportId:
             - Type: int Nullable: No
           - UserId:
             - Type: int Nullable: No
           - MainAgency:
             - Type: nvarchar(100) Nullable: No
           - SecondAgency:
             - Type: nvarchar(100) Nullable: Yes
           - OtherAgency:
             - Type: nvarchar(100) Nullable: Yes
           - TypeOfService:
             - Type: nvarchar(255) Nullable: No
           - BeginDispatchDate:
             - Type: date Nullable: No
           - EndDispatchDate:
             - Type: date Nullable: No
           - BeginDispatchTime:
             - Type: time(0) Nullable: No
           - EndDispatchTime:
             - Type: time(0) Nullable: No
           - ContactName:
             - Type: nvarchar(100) Nullable: No
           - ContactPhone:
             - Type: nvarchar(20) Nullable: Yes
           - DispatchAddress:
             - Type: nvarchar(255) Nullable: No
           - DispatchAddressLine2:
             - Type: nvarchar(255) Nullable: Yes
           - City:
             - Type: nvarchar(100) Nullable: No
           - State:
             - Type: nvarchar(50) Nullable: No
           - PostalCode:
             - Type: nvarchar(20) Nullable: No
           - Narrative:
             - Type: nvarchar(MAX) Nullable: Yes
           - HoursOfService:
             - Type: decimal(5, 2) Nullable: Yes
           - MilesDriven:
             - Type: decimal(8, 2) Nullable: No
           - DateCreated:
             - Type: datetime2(7) Nullable: No
           - DateModified:
             - Type: datetime2(7) Nullable: No
           - ReportDate:
             - Type: datetime2(7) Nullable: No
           - DivisionId:
             - Type: int Nullable: No

         - Table Relationships:
           - Primary Key: ReportId
             - ForeignKey To: Media->ReportId
           - ForeignKeys:
             - DivisionId: Divisions->DivisionId
             - UserId: Users->UserId

       - Ability to CRUD reports with the following information (based on Roles, and who filed the report):
       - Primary Agency (EX: Fire department, police department, city hall, church, etc)
       - Secondary Agency (optional)
       - Other Agency (optional)
       - Type of service (EX: Fire, Search and Rescue, Prayer, etc)
       - Begin/End Dispatch Date/Time
       - Contact(s) (person the chaplain worked with) Name/Phone
       - Dispatch Address/City/State/Postal Code (Where did the callout happen)
       - Narrative (or "what the chaplain did/what happened")
       - Hours served (base on Dispatch Date/Time)
       - Miles driven
       - Work done

   - (Still Needs Work / Backend Development Pending)

     - Calendar (Table hasn't been created yet)

       - Purpose:
       - Used to create and manage upcoming events such as prayer circles, callouts, trainings, giveaways, and group calls.

       - SQL Structure:

         - Variables:
           - EventId: int, Not Null (PK)
           - Title: nvarchar(255), Not Null
           - Description: nvarchar(MAX), Nullable
           - StartTime: datetime2(7), Not Null
           - EndTime: datetime2(7), Not Null
           - Location: nvarchar(255), Nullable
           - CreatedByUserId: int, Not Null (FK → Users)
           - VisibilityLevel: int, Not Null (Determines if event is visible to Members, Chaplains, or Admins)
         - Table Relationships:
           - Primary Key: EventId
           - Foreign Keys:
           - CreatedByUserId → Users → UserId

     - Agencies (No data in table or stored procedures yet)

       - Purpose: Used to track agencies that the SOPSC organization collaborates with for callouts, trainings, and community efforts.
       - SQL Structure:
         - Variables:
           - AgencyId: int, Not Null (PK)
           - AgencyName: nvarchar(255), Not Null
           - AgencyType: nvarchar(100), Nullable
           - ContactName: nvarchar(100), Nullable
           - ContactPhone: nvarchar(20), Nullable
           - Address: nvarchar(255), Nullable
           - City: nvarchar(100), Nullable
           - State: nvarchar(50), Nullable
           - PostalCode: nvarchar(20), Nullable
           - DivisionId: int, Nullable (FK → Divisions)
         - Table Relationships:
           - Primary Key: AgencyId
           - Foreign Keys:
           - DivisionId → Divisions → DivisionId

     - Admin Tools (Not yet implemented)

       - Purpose: Provides administrative functions such as user management, role assignment, content moderation, event scheduling, and system-wide settings.
       - SQL Structure:
         - Variables:
           - ToolId: int, Not Null (PK)
           - ToolName: nvarchar(255), Not Null
           - ToolType: nvarchar(100), Not Null (Defines category: User Management, Content Moderation, Reports, etc.)
           - CreatedByUserId: int, Not Null (FK → Users)
           - CreatedDate: datetime2(7), Not Null
         - Table Relationships:
           - Primary Key: ToolId
           - Foreign Keys:
           - CreatedByUserId → Users → UserId

     - Roles: (Needs SQL order adjustments and API modifications)

       - Purpose: The Roles table assigns permissions to users based on their level (Guest, Member, Chaplain, Admin, Developer).
       - SQL Structure:

         - Variables:
           - RoleId: int, Not Null (PK)
           - RoleName: nvarchar(50), Not Null
           - RoleDescription: nvarchar(255), Nullable
           - CreatedDate: datetime2(7), Not Null
         - Table Relationships:
           - Primary Key: RoleId
           - Foreign Keys:
             - Used in Users table to define access.

     - Notifications (Ongoing development as new features are added)
       - Purpose: The Notifications table links various content types to push alerts for users, ensuring they stay updated with reports, messages, events, and system changes.
       - Notification Examples:
         - Reports: "Reminder: Report required for [event name]"
         - Messages: "New Message from [User]"
         - Events: "Event Reminder: [Event Name] starts in 1 hour"
         - Callouts: "Urgent Callout: Assistance needed!"
         - Phone Calls: "Missed Call from [User]"
         - Prayer Requests: "New Prayer Request by [User]"
         - System Updates: "New feature update available!"
       - SQL Structure:
         - Variables:
           - NotificationId: int, Not Null (PK)
           - UserId: int, Not Null (FK → Users)
           - Type: nvarchar(100), Not Null (Defines if it's related to Reports, Messages, Events, etc.)
           - Message: nvarchar(MAX), Not Null
           - CreatedDate: datetime2(7), Not Null
           - IsRead: bit, Not Null (Tracks if user has seen the notification)
         - Table Relationships:
           - Primary Key: NotificationId
           - Foreign Keys:
             - UserId → Users → UserId
