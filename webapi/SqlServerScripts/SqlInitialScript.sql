IF NOT EXISTS (SELECT [name] FROM sys.databases WHERE [name] = 'OnlineStore')
	CREATE DATABASE [OnlineStore]
GO

USE [OnlineStore]
GO

CREATE TABLE OnlineStore.dbo.Products
(
Id INT IDENTITY(1,1),
Name NVARCHAR(MAX),
Price FLOAT,
Favorite BIT,
ImgUrl NVARCHAR(MAX),
Stock INT
)
GO

INSERT INTO OnlineStore.dbo.Products
VALUES ('Broccoli',2.5,1,'../../../assets/Images/Broccoli.jpg',194),
	   ('Carrot',1.25,0,'../../../assets/Images/Carrot.jpg',194),
	   ('Artichoke',1.8,0,'../../../assets/Images/Artichoke.jpg',175),
	   ('Cauliflower',4.5,0,'../../../assets/Images/Cauliflower.jpg',204),
	   ('Eggplant',2.3,1,'../../../assets/Images/Eggplant.jpg',121),
	   ('Garlic',0.5,1,'../../../assets/Images/Garlic.jpg',205),
	   ('Lettuce',5.5,1,'../../../assets/Images/Lettuce.jpg',167),
	   ('Pepper',1.72,0,'../../../assets/Images/Pepper.jpg',92),
	   ('Tomato',3.3,0,'../../../assets/Images/Tomato.jpg',138),
	   ('Beet',3,0,'../../../assets/Images/Beet.jpg',44),
	   ('Cucumber',1.5,1,'../../../assets/Images/Cucumber.jpg',512),
	   ('Fennel',4.5,0,'../../../assets/Images/Fennel.jpg',25),
	   ('Onion',2.5,1,'../../../assets/Images/Onion.jpg',320),
	   ('Potato',6.5,1,'../../../assets/Images/Potato.jpg',675),
	   ('Pumpkin',10,0,'../../../assets/Images/Pumpkin.jpg',15),
	   ('Squash',8.22,0,'../../../assets/Images/Squash.jpg',64),
	   ('SweetPotato',10,1,'../../../assets/Images/SweetPotato.jpg',55)
GO

CREATE TABLE dbo.Users
(Id INT IDENTITY(1,1),
Email VARCHAR(100),
Name VARCHAR(100),
IsAdmin BIT,
PasswordHash VARBINARY(128),
PasswordSalt VARBINARY(128),
RefreshToken NVARCHAR(500),
TokenCreated DATETIME2,
TokenExpires DATETIME2)
GO

CREATE TABLE dbo.CartItems
(
Id INT IDENTITY(1,1),
ClientEmail VARCHAR(100),
ProductName NVARCHAR(MAX),
Quantity INT,
PriceEach FLOAT,
PriceTotal FLOAT,
DateCreated DATETIME2 DEFAULT GETDATE()
)
GO

CREATE  PROCEDURE usp_EmptyCarts
AS
BEGIN

DECLARE @MinimumDate DATETIME2 = DATEADD(hh,-1,GETDATE())

UPDATE p
SET p.Stock = p.Stock + ISNULL(c.Quantity,0)
FROM dbo.Products p
LEFT JOIN CartItems c ON p.Name = c.ProductName
WHERE c.DateCreated < @MinimumDate

DELETE FROM CartItems
WHERE DateCreated < @MinimumDate

END
GO

USE [msdb]
GO
DECLARE @jobId BINARY(16)
EXEC  msdb.dbo.sp_add_job @job_name=N'Empty Carts', 
		@enabled=1, 
		@notify_level_eventlog=0, 
		@notify_level_email=2, 
		@notify_level_page=2, 
		@delete_level=0, 
		@category_name=N'[Uncategorized (Local)]', 
		@owner_login_name=N'sa', @job_id = @jobId OUTPUT
select @jobId
GO
EXEC msdb.dbo.sp_add_jobserver @job_name=N'Empty Carts', @server_name = @@SERVERNAME
GO
USE [msdb]
GO
EXEC msdb.dbo.sp_add_jobstep @job_name=N'Empty Carts', @step_name=N'Empty Carts', 
		@step_id=1, 
		@cmdexec_success_code=0, 
		@on_success_action=1, 
		@on_fail_action=2, 
		@retry_attempts=0, 
		@retry_interval=0, 
		@os_run_priority=0, @subsystem=N'TSQL', 
		@command=N'EXEC usp_EmptyCarts', 
		@database_name=N'OnlineStore', 
		@flags=0
GO
USE [msdb]
GO
EXEC msdb.dbo.sp_update_job @job_name=N'Empty Carts', 
		@enabled=1, 
		@start_step_id=1, 
		@notify_level_eventlog=0, 
		@notify_level_email=2, 
		@notify_level_page=2, 
		@delete_level=0, 
		@description=N'', 
		@category_name=N'[Uncategorized (Local)]', 
		@owner_login_name=N'sa', 
		@notify_email_operator_name=N'', 
		@notify_page_operator_name=N''
GO
USE [msdb]
GO
DECLARE @schedule_id int
EXEC msdb.dbo.sp_add_jobschedule @job_name=N'Empty Carts', @name=N'Hourly', 
		@enabled=1, 
		@freq_type=4, 
		@freq_interval=1, 
		@freq_subday_type=8, 
		@freq_subday_interval=1, 
		@freq_relative_interval=0, 
		@freq_recurrence_factor=1, 
		@active_start_date=20230404, 
		@active_end_date=99991231, 
		@active_start_time=0, 
		@active_end_time=235959, @schedule_id = @schedule_id OUTPUT
select @schedule_id
GO
