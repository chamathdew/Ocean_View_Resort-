# Ocean View Resort Management System

This is my final assignment project for the resort management system. The system has two main parts: a web frontend for guests to book rooms and a Java backend/desktop app for the management to control everything.

## Features

- Guest web portal using React
- Java Desktop App for managing bookings, rooms, and guests
- Spring Boot API connecting the frontend and database
- Used MongoDB for the database

## Technologies Used

- Frontend: React, Vite, HTML/CSS
- Backend: Java, Spring Boot
- Database: MongoDB Atlas
- Tools: VS Code, IntelliJ/Eclipse, Postman

## How to run

1. **Frontend:**
   Go to the `frontend` folder and run `npm install`, then `npm run dev`.

2. **Backend:**
   Open the `backend` folder in your IDE, download maven dependencies and run the Spring Boot main class. Or you can use the `run_gui.bat` file if maven is already set up.

## Project Structure

- `frontend/` - Contains all React code for the guest UI
- `backend/` - Contains the Java Spring Boot code and Swing UI components

---

_Note: Make sure MongoDB connection URI is set in application.properties before running the backend._
