package com.college.exam.seating.system.service;

import com.college.exam.seating.system.entity.Notification;
import com.college.exam.seating.system.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // ✅ SAVE WITH STATUS
    public void saveNotification(String email, String phone, String message, boolean status) {

        Notification n = new Notification();
        n.setStudentEmail(email);
        n.setPhone(phone);
        n.setMessage(message);
        n.setSent(status);
        n.setStatus(status ? "SUCCESS" : "FAILED"); // 🔥 IMPORTANT
        n.setSentTime(LocalDateTime.now());
System.out.println("Saved: " + email + " | " + status);
        notificationRepository.save(n);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public List<Notification> getByEmail(String email) {
        return notificationRepository.findByStudentEmail(email);
    }
    
}