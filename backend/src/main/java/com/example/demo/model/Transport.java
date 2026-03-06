package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "transports")
public class Transport {
    @Id
    private String id;
    private String name;
    private String image;
    private String price;
    private String location;

    // Constructors
    public Transport() {}

    public Transport(String id, String name, String image, String price, String location) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.price = price;
        this.location = location;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
