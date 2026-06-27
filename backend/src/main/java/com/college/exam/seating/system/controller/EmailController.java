package com.college.exam.seating.system.controller;

import com.college.exam.seating.system.dto.StudentAllocationDTO;
import com.college.exam.seating.system.service.EmailService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/email")
@CrossOrigin
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    // ✅ 1. Send email to ONE student (your existing feature)
    @PostMapping("/send")
    public String sendMail(
            @RequestParam String to,
            @RequestParam String name,
            @RequestParam String hall,
            @RequestParam String seat,
            @RequestParam String time) {

        emailService.sendAllocationEmail(to, name, hall, seat, time);

        return "Personalized email sent successfully!";
    }

    // ✅ 2. Send emails to MULTIPLE students (NEW)
    @GetMapping("/send-all")
    public String sendAllEmails(@RequestBody List<StudentAllocationDTO> students) {

        emailService.sendBulkEmails(students);

        return "Bulk emails sent successfully!";
    }

    // ✅ 3. Simple test API (optional for debugging)
    @GetMapping("/test")
    public String testEmail() {

        emailService.sendAllocationEmail(
                "test@gmail.com",
                "Test Student",
                "A Block",
                "101",
                "10:00 AM"
        );

        return "Test email sent!";
    }
}