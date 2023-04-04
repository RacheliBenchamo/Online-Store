# The Vegetable House

The Vegetable House is a small online store that allows customers to purchase products and enables admins to manage the store's inventory. The project consists of an Angular frontend and an ASP.NET backend.

Features
The following features are available in the project:

Login and registration for both customers and admins
Product page with filtering functionality
Admin dashboard for managing inventory
Technologies
The following technologies are used in the project:

Angular Frontend
Angular services
Routing
Subscription
HTTP requests
ASP.NET Backend
SQL Server database
Controllers
JWT

Getting Started
To get started with the project, follow these steps:

Clone the repository to your local machine
Install the necessary dependencies for both the frontend and backend
Create a SQL Server database and update the connection string in the backend's appsettings.json file
Before running the application, make sure to execute the SQL script under the server project in 
SqlServerScripts directory in the SQL Server in order to create the required tables.
Build and run the project
Once the project is up and running, customers and admins can register and login to their accounts.
Customers can browse products and add them to their cart, while admins can view and manage the store's inventory.
To register someone as an admin, you need to change the value of the IS_ADMIN constant in the UserController class in the C# backend code.

By default, the value of IS_ADMIN is set to false, which means that newly registered users will not have admin privileges.
To change this, you can set the value of IS_ADMIN to true, which will allow newly registered users to have admin privileges.
