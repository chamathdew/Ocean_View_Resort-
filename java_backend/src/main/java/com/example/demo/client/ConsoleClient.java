package com.example.demo.client;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Scanner;

public class ConsoleClient {
    private static final String BASE_URL = "http://localhost:8080/api";
    private static final HttpClient client = HttpClient.newHttpClient();
    private static final Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        System.out.println("=========================================");
        System.out.println("     Ocean View Resort - Java Client     ");
        System.out.println("=========================================");

        while (true) {
            System.out.println("\nSelect an option:");
            System.out.println("1. User Login");
            System.out.println("2. Add Reservation");
            System.out.println("3. Display Details");
            System.out.println("4. Print Bill");
            System.out.println("5. Help Section");
            System.out.println("6. Exit");
            System.out.print("Enter choice: ");

            String choice = scanner.nextLine();
            try {
                switch (choice) {
                    case "1": login(); break;
                    case "2": addReservation(); break;
                    case "3": displayDetails(); break;
                    case "4": printBill(); break;
                    case "5": helpSection(); break;
                    case "6": System.out.println("Exiting..."); return;
                    default: System.out.println("Invalid choice. Try again.");
                }
            } catch (Exception e) {
                System.out.println("Error communicating with server: " + e.getMessage());
            }
        }
    }

    private static void login() throws Exception {
        System.out.print("Email: ");
        String email = scanner.nextLine();
        System.out.print("Password: ");
        String password = scanner.nextLine();

        String json = String.format("{\"email\":\"%s\", \"password\":\"%s\"}", email, password);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/auth/login"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("SERVER RESPONSE [" + response.statusCode() + "]: " + response.body());
    }

    private static void addReservation() throws Exception {
        System.out.print("Guest ID: ");
        String guestId = scanner.nextLine();
        System.out.print("Room ID: ");
        String roomId = scanner.nextLine();
        System.out.print("Check-In Date (YYYY-MM-DD): ");
        String checkIn = scanner.nextLine();
        System.out.print("Check-Out Date (YYYY-MM-DD): ");
        String checkOut = scanner.nextLine();

        String json = String.format("{\"guestId\":\"%s\", \"roomId\":\"%s\", \"checkIn\":\"%sT14:00:00.000Z\", \"checkOut\":\"%sT12:00:00.000Z\"}", guestId, roomId, checkIn, checkOut);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/reservations"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("SERVER RESPONSE [" + response.statusCode() + "]: " + response.body());
    }

    private static void displayDetails() throws Exception {
        System.out.print("Enter Reservation ID: ");
        String id = scanner.nextLine();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/reservations/" + id))
                .GET()
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("SERVER RESPONSE [" + response.statusCode() + "]:\n" + response.body());
    }

    private static void printBill() throws Exception {
        System.out.print("Enter Reservation ID: ");
        String id = scanner.nextLine();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/reservations/print/" + id))
                .GET()
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("SERVER RESPONSE [" + response.statusCode() + "]:\n" + response.body());
    }

    private static void helpSection() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/help"))
                .GET()
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}
