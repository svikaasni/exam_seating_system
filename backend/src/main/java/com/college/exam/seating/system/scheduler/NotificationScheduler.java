package com.college.exam.seating.system.scheduler;

import com.college.exam.seating.system.entity.SeatAllocation;
import com.college.exam.seating.system.service.AllocationService;
import com.college.exam.seating.system.service.NotificationService;
import com.college.exam.seating.system.service.WhatsAppService;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class NotificationScheduler {

    private final AllocationService allocationService;
    private final NotificationService notificationService;
    private final WhatsAppService whatsAppService;

    private final Set<String> notifiedStudents = new HashSet<>();

    public NotificationScheduler(AllocationService allocationService,
                                 NotificationService notificationService,
                                 WhatsAppService whatsAppService) {
        this.allocationService = allocationService;
        this.notificationService = notificationService;
        this.whatsAppService = whatsAppService;
    }

    @Scheduled(fixedRate = 60000)
    public void sendExamReminder() {

        List<SeatAllocation> allocations = allocationService.getAllAllocations();
        LocalDateTime now = LocalDateTime.now();

        for (SeatAllocation allocation : allocations) {

            LocalDateTime examTime = allocation.getExamTime();
            if (examTime == null) continue;

            if (examTime.isAfter(now) && examTime.isBefore(now.plusHours(1))) {

                String email = allocation.getStudent().getEmail();
                String phone = allocation.getStudent().getPhone();

                if (notifiedStudents.contains(email)) continue;

                String message = "📢 Exam Reminder\n\n" +
                        "Your exam is in 1 hour\n" +
                        "Hall: " + allocation.getExamHall().getHallName() +
                        "\nSeat: " + allocation.getSeatNumber();

                boolean sent = false;

                try {
                    if (phone != null && !phone.isEmpty()) {
                        sent = whatsAppService.sendWhatsApp(phone, message);
                    }
                } catch (Exception e) {
                    sent = false;
                }

                // ✅ SAVE RESULT
                notificationService.saveNotification(email, phone, message, sent);

                notifiedStudents.add(email);
            }
        }
    }
}