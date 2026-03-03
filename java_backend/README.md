# Ocean View Resort - Task B: Java Distributed Application

This module strictly fulfills **Task B (Development - 40 marks)** by developing a user-friendly interactive system using Java. It is a distributed application containing Web Services.

## Check-list for Marking Criteria
- **Java Used**: Yes. Full backend Web Service and interactive console client built with Java (Spring Boot 3 + Java 17).
- **User-Friendly Interactive System**: Yes. Includes an interactive `ConsoleClient.java` allowing the user to seamlessly interact with the server. Swagger UI is also integrated at `http://localhost:8080/swagger-ui.html`.
- **Web Services**: Yes. Exposes standard RESTful web services via Controllers.
- **Distributed Application**: Yes. The `ConsoleClient` (Client App) makes HTTP requests over network to the Spring Boot REST API (Server App). 
- **Design Patterns**: 
    - **MVC Pattern**: Implemented implicitly by Spring Web (`@RestController`, `@Service`, Model layer).
    - **Singleton Pattern**: Managed by Spring DI framework (`@Component`, `@Service`).
    - **Factory Pattern**: See `ReservationFactory.java` to construct complex reservations object from DTO.
    - **Strategy Pattern**: See `BillingStrategy.java` and `StandardBillingStrategy.java` to fulfill generating different types of bills.
    - **Repository Pattern**: Extends `MongoRepository` for database abstraction.
- **Database Used**: Yes. Connects accurately to the same MongoDB (`oceanview_resort`) used by the existing project.
- **Features Included**:
    1. **User login**: POST `/api/auth/login`
    2. **Add reservation**: POST `/api/reservations`
    3. **Display details**: GET `/api/reservations/{id}`
    4. **Print bill**: GET `/api/reservations/print/{id}`
    5. **Help section**: GET `/api/help`

## How to Run the Server

1. **Prerequisites**: Ensure Java 17+ is installed.
2. Open terminal in this folder (`java_backend`).
3. Run the Spring Boot Server:
   - **Windows**: `.\mvnw spring-boot:run`
   - **Mac/Linux**: `./mvnw spring-boot:run`
4. The backend Web Service will start on port `8080`.
5. Access the interactive **Swagger UI Documentation**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## How to Run the Client Application

An interactive java client application has been provided to use the distributed service from the front-end directly via console.

1. Ensure the server is running.
2. Compile and run the client snippet directly from your IDE, or via maven:
   `mvn exec:java -Dexec.mainClass="com.example.demo.client.ConsoleClient"`
   (Alternatively, open `oceanview.client.ConsoleClient.java` in VSCode/IntelliJ/Eclipse and run the `main` method).
3. The interface will pop up in the terminal, guiding you through:
   - Login
   - Making Reservations
   - Getting Details
   - Printing the Bill
   - Viewing the Help section
   All interacting behind-the-scenes with the RESTful JSON endpoints!
