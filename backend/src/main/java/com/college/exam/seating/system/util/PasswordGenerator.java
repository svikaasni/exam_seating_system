package com.college.exam.seating.system.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String adminPass = encoder.encode("admin123");
        String staffPass = encoder.encode("staff123");
        String studentPass = encoder.encode("student123");

        System.out.println("Admin Password: " + adminPass);
        System.out.println("Staff Password: " + staffPass);
        System.out.println("Student Password: " + studentPass);
    }
}