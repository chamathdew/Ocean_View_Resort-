package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class DemoApplication {

	public static void main(String[] args) {
		org.springframework.context.ConfigurableApplicationContext context = SpringApplication.run(DemoApplication.class, args);
		
		System.out.println("\n" + "=".repeat(60));
		System.out.println("🚀 OCEAN VIEW RESORT BACKEND IS LIVE!");
		System.out.println("✅ Status: Running Successfully");
		System.out.println("🔗 Backend URL: http://localhost:8080");
		System.out.println("🔗 API Docs:    http://localhost:8080/swagger-ui.html");
		System.out.println("=".repeat(60) + "\n");
	}

}
