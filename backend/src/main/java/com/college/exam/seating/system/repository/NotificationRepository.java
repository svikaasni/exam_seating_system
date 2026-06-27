package com.college.exam.seating.system.repository;

import com.college.exam.seating.system.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // ✅ Matches entity field: studentEmail
    List<Notification> findByStudentEmail(String email);
}