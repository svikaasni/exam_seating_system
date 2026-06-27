package com.college.exam.seating.system.service;

import com.college.exam.seating.system.dto.StudentAllocationDTO;
import com.college.exam.seating.system.entity.Notification;
import com.college.exam.seating.system.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private NotificationRepository notificationRepository;

    // ✅ SEND SINGLE EMAIL + SAVE
    public void sendAllocationEmail(String to, String studentName,
                                    String hall, String seat, String examTime) {

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(to);
            message.setSubject("Exam Seating Allocation");

            message.setText(
                    "Dear " + studentName + ",\n\n" +
                    "Your exam details:\n" +
                    "Hall: " + hall + "\n" +
                    "Seat: " + seat + "\n" +
                    "Exam Time: " + examTime + "\n\n" +
                    "Best of luck!"
            );

            // ✅ SEND EMAIL
            mailSender.send(message);

            // ✅ SAVE SUCCESS NOTIFICATION
            Notification notification = new Notification();
            notification.setStudentEmail(to);
            notification.setMessage("Seat allocated: Hall " + hall + ", Seat " + seat);// 🔥 you can later replace with real examId
            notification.setSent(true);
            notification.setSentTime(LocalDateTime.now());

            notificationRepository.save(notification);

        } catch (Exception e) {

            // ❌ SAVE FAILED EMAIL
            Notification notification = new Notification();
            notification.setStudentEmail(to);
            notification.setMessage("FAILED to send email");
            
            notification.setSent(false);
            notification.setSentTime(LocalDateTime.now());

            notificationRepository.save(notification);

            e.printStackTrace();
        }
    }

    // ✅ BULK EMAIL
    public void sendBulkEmails(List<StudentAllocationDTO> students) {

        for (StudentAllocationDTO s : students) {

            sendAllocationEmail(
                    s.getEmail(),
                    s.getName(),
                    s.getHall(),
                    s.getSeat(),
                    s.getExamTime()   // 🔥 FIXED HERE
            );
        }
    }
}