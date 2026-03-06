package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "attractions")
public class Attraction {
    @Id
    private String id;
    private String name;
    private String img;
    private String desc;

    // Constructors
    public Attraction() {}

    public Attraction(String id, String name, String img, String desc) {
        this.id = id;
        this.name = name;
        this.img = img;
        this.desc = desc;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getImg() { return img; }
    public void setImg(String img) { this.img = img; }

    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }
}
