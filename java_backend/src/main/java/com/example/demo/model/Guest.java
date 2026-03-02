package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "guests")
public class Guest {
    @Id
    private String id;
    private String fullName;
    private String address;
    private String contactNumber;
    private String idNumber;
    private String dateOfBirth;
    private String gender;
}
