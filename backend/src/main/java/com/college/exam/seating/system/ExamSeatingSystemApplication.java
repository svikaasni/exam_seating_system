package com.college.exam.seating.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling   // 🔥 ADD THIS LINE
public class ExamSeatingSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExamSeatingSystemApplication.class, args);
    }
}