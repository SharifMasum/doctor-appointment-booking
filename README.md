# Doctor Appointment Booking Server Application

## Table of Contents
#### Overview
* Features
#### Getting Started
* Prerequisites
* Installation
#### Dependencies
#### Application Architecture
#### REST Endpoints
#### Database Structure
#### Database Schema
#### Authentication and Authorization
* Local Strategy
* JWT Strategy
* Middleware
#### Session Management
#### Swagger Integration
#### Error Handling
#### Development Log
#### Implemented Features
#### Personal Reflection
#### Self-Evaluation
#### Areas for Improvement
#### Conclusion
#### Video Demo

## Overview
The Doctor Appointment Booking System is a RESTful API built with Node.js, Express, and MongoDB, designed to manage 
appointments between doctors (workers) and patients. It includes user authentication using Passport.js, JWT for 
authorization, and session management with MongoDB. The API also integrates Swagger for API documentation.

### Features

* User Authentication (Admin and Worker)
* Session Management
* Appointment Booking
* Appointment Retrieval and Management
* API Documentation with Swagger

## Getting Started
### Prerequisites
Ensure that following have been installed on your development machine.

    • Node.js(v12 or higher)
    • npm (v6 or higher)
    • MongoDB

### Installation
1.	Clone the repository:

    Git clone https://gitlab.labranet.jamk.fi/data-modelling-and-backend/doctor-appointment
    cd doctorappointment

2.	Install dependencies:

    npm install
3.	Start MondoDB Server
4.	Set up environment variables:

The application uses the dotenv package for environment variables. Create a .env file in the root directory and add the following variables:

    MONGODB_URI =  your_URI
    SESSION_SECRET = your_secret_key
    JWT_SECRET = your_secret_key
5.	Run the application

    npm start / nodemon index.js

The server will start on ‘http://localhost:5000’

## Dependencies

* Express: Fast, unopinionated, minimalist web framework for Node.js
* Body-Parser: Middleware to parse incoming request bodies
* Connect-Mongo: MongoDB session store for Connect and Express
* Cors: Middleware for enabling CORS
* Dotenv: Module to load environment variables from a .env file
* Express-Session: Session middleware for Express
* Jsonwebtoken: JSON Web Token implementation
* Mongoose: MongoDB object modeling tool
* Nodemon: Tool that helps develop Node.js applications by automatically restarting the node application when file changes are detected
* Passport: Middleware for authentication
* Swagger-jsdoc: Swagger 2.0 and OpenAPI 3.0 JSDoc annotations for Node.js
* Swagger-ui-express: Middleware to serve auto-generated swagger-ui generated API docs

## Application Architecture

* Index.js: Main entry point of the application. Configures middleware, routes, and starts the server.
* Auth.js: Handles user authentication, including registration and login.
* Route.js: Manages appointment booking and retrieval.
* Db.js: Sets up the MongoDB connection and defines the models for Admin, Worker, Appointment, and AppointmentAvailability.
* Openapi.json: Contains the OpenAPI specification for the application's API documentation.

## REST Endpoints
Home

* GET / - Welcome endpoint

Admin Routes

* POST /registeradmin - Register a new admin
* GET /getadmins - Retrieve all admins
* GET /getadmin/:username - Retrieve a specific admin by username Worker Routes
* POST /registerworker - Register a new worker
* GET /getworkers - Retrieve all workers
* GET /getworker/:username - Retrieve a specific worker by username

Authentication

* POST /login - Login for both admin and worker
* POST /logout - Logout the user
* GET /session - Get the current session data

Appointment Management

* POST /bookappointment - Book an appointment (Worker)
* POST /bookappointment/admin - Book an appointment (Admin)
* GET /getappointments - Retrieve all appointments (Worker)
* GET /getappointments/admin - Retrieve all appointments (Admin)
* GET /getappointments/:category/:value - Retrieve appointments by category (Worker)
* GET /getappointments/admin/:category/:value - Retrieve appointments by category (Admin)
* PUT /updateappointment/:id - Update an appointment
* DELETE /deleteappointment/:id - Delete an appointment

Database Structure

* Admin: Stores admin user data.
* Worker: Stores worker user data.
* Appointment: Stores appointment details.
* AppointmentAvailability: Stores availability information for appointment slots.

## Database Schema
#### db.js
Defines the MongoDB schemas and models using Mongoose.

* Admin Schema: Fields: name, username, password, email.
* Worker Schema: Fields: name, username, password, email.
* Appointment Schema: Fields: username, clientname, age, mobile, service, appointment-date, slotnumber.
* AppointmentAvailability Schema: Fields: appointmentdate, slotnumber, appointmentsavailable.

## Authentication and Authorization

### Local Strategy

Admin and Worker login using passport-local strategy.

Defined in auth.js:
* Admin login: Uses admin strategy.
* Worker login: Uses worker strategy.

### JWT Strategy

* Uses passport-jwt for token-based authentication.
* Tokens are issued upon successful login and stored in the session.

### Middleware

* Authentication middleware ensures protected routes can only be accessed by authenticated users.

## Session Management
### Configuration

Sessions are managed using express-session and stored in MongoDB using connect-mongo.

Defined in index.js:

    app.use(session({
      secret: process.env.SESSION_SECRET, //secret key for session
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        client: db.getClient(),
        dbName: 'testdb',
        collectionName: "sessions",
        stringify: false,
        autoRemove: "interval",
        autoRemoveInterval: 1
      })
    }));

## Swagger Integration
### Configuration
API documentation is provided via Swagger UI.

Swagger setup in index.js:

    const swaggerUi = require('swagger-ui-express');
    const swaggerJson = require('./openapi.json');
    
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
    app.get('/swagger-json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerJson);
    });

#### Accessing Documentation
* Visit ‘http://localhost:5000/api-docs’ to view the interactive Swagger documentation.
* The raw OpenAPI JSON is available at ‘http://localhost:5000/swagger-json’.

## Error Handling

Errors are handled using standard Express error handling middleware.

Specific error messages are provided for authentication failures, database constraints, and internal server errors.

Example of error handling in routes:

    router.post("/registeradmin", async (req, res) => {
      try {
        const user = new Admin(req.body);
        await user.save();
        res.status(200).json({ message: "User registered successfully" });
      } catch (err) {
        if (err.code === 11000) {
          res.status(409).json({ message: "Username or Email already exists" });
        } else {
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    });

## Implemented Features

* User Registration and Authentication: Users can register as admins or workers and log in to the system.
* Session Management: Sessions are maintained using express-session and stored in MongoDB.
* Appointment Booking: Both admins and workers can book appointments.
* Appointment Management: Users can retrieve, update, and delete appointments.
* API Documentation: The application includes API documentation generated using Swagger.

## Development Log

Initially, I decided to create an e-commerce full-stack application and agreed with Pasi Manninen and started working on 
that. But during the time or research I was also worried that I might not be able to complete it. In that case I will 
fall back to default assignment, and weather client app for Application Framework and doctor’s appointment server for 
ata Modeling and Backend Course (That was also agreed with Pasi). I worked for around 50 hours on this 
https://github.com/SharifMasum/e-commerce-frontend. Then finally I gave up on e-commerce and decided to make doctor 
appointment booking server..

### 15/03/2024: Research
#### Task/Feature: Research and Study
#### Time Spent: 8 hours
* Researching through different types of appointment booking systems
* Researching authentication methods and session management options
* Researching available frameworks and libraries
* Tutorial followed: 

https://saniaalikhan224.medium.com/mastering-time-a-backend-guide-to-appointment-systems-c442de1b37c9

https://www.geeksforgeeks.org/hospital-appointment-system-using-express/

https://www.youtube.com/watch?v=oY24fxdTKi8&list=PLuHGmgpyHfRw0wBGN8knxsJsMi74r34zw

### 18/03/2024: Environment Setup
#### Task/Feature: Project setup and initial configuration
#### Time Spent: 4 hours.
* Setting up the project with Node.js and Express
* Installing necessary dependencies
* Initial project structure setup

### 24/03/2024: Database Models and Session Management
#### Task/Feature: Creating database models and setting up session management.
#### Time Spent: 6 hours.
* Defining models for Admin, Worker, Appointment, and AppointmentAvailability
* Configuring MongoDB connection
* Setting up session management with express-session and connect-mongo

### 25/03/2024: User Registration and Authentication
#### Task/Feature: Implementing user registration (admin, worker) and authentication (login/logout)
#### Time Spent: 6 hours
* Creating user registration endpoints
* Implementing login and logout functionality
* Setting up Passport for authentication

### 29/03/2024: Appointment Booking and Retrieval
#### Task/Feature: Implementing appointment booking and retrieval
#### Time Spent: 6 hours
* Creating endpoints for booking appointments (admin and worker)
* Implementing retrieval of appointments by category and value
* Testing booking and retrieval functionality

### 07/04/2024: Appointment Management
#### Task/Feature: Implementing appointment updating and deletion.
#### Time Spent: 6 hours.
* Creating endpoints for updating and deleting appointments
* Testing update and delete functionality
* Ensuring proper validation and error handling

### 14/03/2024: Testing and Bug Fixes
#### Task/Feature: Final testing and bug fixes
#### Time Spent: 6 hours
* Comprehensive testing of all functionalities
* Fixing identified bugs
* Ensuring robustness and reliability of the application

### 15/04/2024: API Documentation
#### Task/Feature: API documentation with Swagger
#### Time Spent: 5 hours.
* Adding Swagger-jsdoc annotations to routes
* Generating Swagger documentation
* Testing and verifying.

### 19/04/2024: Final Touches and Documentation
#### Task/Feature: Final touches and writing documentation.
#### Time Spent: 6 hours.
* Refining API functionality
* Writing project documentation

### 25/05/2024: Finalization
#### Task/Feature: Finalizing documentation.
#### Time Spent: 5 hours.
* Ensuring all endpoints are correctly documented.
* Finishing documentation
* Preparing for project submission

### Total Hours
#### Total Time Spent: 60 hours.

## Personal Reflection
Working on the doctor appointment booking server project was a valuable experience that allowed me to improve my 
abilities in designing RESTful services, managing user access, creating JWT authentication, and documenting APIs with 
Swagger. Throughout this project, I conducted thorough research, wrote meticulous code, and conducted iterative 
testing to guarantee that the application functioned as intended.

### Easy Parts
#### Understanding the Requirements:
Grasping the core and extra requirements was straightforward. The need for CRUD operations on workers, clients, and 
services, along with the authentication mechanism, was clearly defined and well within my skill set.

#### Implementing Basic CRUD Operations:
Creating, reading, updating, and deleting records for workers and services was relatively simple. Leveraging RESTful 
principles and using Express.js for the backend made this process efficient.

### Hard Parts
#### Authentication and Authorization:
Implementing JWT for authentication and ensuring secure access control was challenging. It is crucial to handle the 
setup of token generation, validation, and secure storage with great care to avoid any potential security risks.

### Greatest Learning Experience
The greatest learning experience came from implementing JWT for authentication. Understanding the nuances of secure 
token management, refreshing tokens, and protecting routes provided valuable insights into building secure applications.

## Self-Evaluation

Based on my performance and the outcomes of the project, I would give myself a grade of **4/5**. Here is why:
Core features of the application are successfully implemented, a clean and organized codebase is maintained, multiple 
extra requirements have been fulfilled.

### Core Requirements
1. A new Worker, Client, and Service can be created, modified, and deleted :

   * Worker: Implemented endpoints for registering new workers, modifying worker information, and deleting workers.
   * Client: Although the project brief didn't specify "Client," workers book appointments on behalf of clients. Modifying and deleting client related data are not explicitly required based on the initial requirements.
   * Service: Services (appointments) can be created, modified, and deleted.

2. Worker can create a new reservation with client and service information:

   * Implemented: Workers can create new appointments (reservations) with the necessary client and service (appointment details) information.

3. Worker can see a list of only their own made reservations:

   * Implemented: Workers have endpoints to retrieve only the reservations they have created.

4. Worker can edit/delete only their own made reservations:

   * Implemented: Workers can only update or delete the reservations they have created.

### Extra Requirements
1. Reservation can contain multiple services in the same reservation:

   * Partially Implemented: While appointments are treated as individual services, the ability to handle multiple services within a single reservation has not been explicitly implemented. However, workers can make multiple separate reservations if needed.
2. Admin can see all the worker data (name, phone, email, etc.):

   * Implemented: Admins can retrieve the complete list of workers along with their detailed information.

3. Admin can see the list of all reservations:
	
   * Implemented: Admins have access to view all the reservations made by any worker.

4. Admin can modify all available reservations:

   * Implemented: Admins can update or delete any reservation, regardless of the worker who created it.

5. Use JWT or similar for the access token implementation:

   * Implemented: JWT (JSON Web Token) is used for user authentication and access control.

### Justification
* Core Functionality: Fully met all core requirements, ensuring the essential features work seamlessly.
* Extra Functionality: Almost entirely met the extra requirements, with a minor gap in handling multiple services in a single reservation.
* Effort and Learning: Successfully tackled challenging areas such as authentication, session management, and robust API design.
* Documentation and Presentation: Provided comprehensive documentation and clear presentation of the application's functionality.

Considering the thorough implementation, dedication to meeting requirements, and overall quality of the work, a grade of **4/5** reflects the effort and achievement accurately.

## Areas for Improvement
While the project met most of the core and extra requirements effectively, there are several areas where improvements can be made to enhance the overall quality and functionality of the application:

#### Error Handling: 
Improved error handling and user feedback mechanisms could be implemented. For instance, displaying more informative error messages and providing clear guidance for users when they encounter issues.
#### Unit and Integration Testing: 
While the application works as intended, comprehensive unit and integration tests could be implemented to ensure robustness.
#### Backend Optimization: 
Reviewing and optimizing database queries to improve performance, especially for complex queries involving multiple services in a single reservation.
#### Notification System: 
Adding a notification system (e.g., email or SMS alerts) for reservations, cancellations, or updates would improve user engagement and communication.

## Conclusion
Overall, this project has been a substantial learning journey, and I am proud of the work accomplished. It has strengthened my confidence in building applications and has provided me a solid foundation for future projects.

## Video Demo
The link for video demo: https://youtu.be/XBDpqtHUkYo