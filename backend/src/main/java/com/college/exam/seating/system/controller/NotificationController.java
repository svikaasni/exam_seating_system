package com.college.exam.seating.system.controller;

import com.college.exam.seating.system.entity.Notification;
import com.college.exam.seating.system.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin("*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // ✅ GET ALL NOTIFICATIONS
    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    // ✅ GET NOTIFICATIONS BY EMAIL
    @GetMapping("/email/{email}")
    public List<Notification> getByEmail(@PathVariable String email) {
        return notificationService.getByEmail(email);
    }
}