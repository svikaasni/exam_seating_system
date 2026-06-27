package com.college.exam.seating.system.service;

import com.college.exam.seating.system.entity.*;
import com.college.exam.seating.system.repository.*;
import com.college.exam.seating.system.dto.StudentAllocationDTO;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class AllocationService {

    private final StudentRepository studentRepository;
    private final ExamHallRepository examHallRepository;
    private final SeatAllocationRepository seatAllocationRepository;
    private final EmailService emailService;
    private final WhatsAppService whatsAppService;
    private final NotificationService notificationService;

    private static final int COLUMNS = 6;

    @Autowired
    public AllocationService(StudentRepository studentRepository,
                             ExamHallRepository examHallRepository,
                             SeatAllocationRepository seatAllocationRepository,
                             EmailService emailService,
                             WhatsAppService whatsAppService,
                             NotificationService notificationService) {

        this.studentRepository = studentRepository;
        this.examHallRepository = examHallRepository;
        this.seatAllocationRepository = seatAllocationRepository;
        this.emailService = emailService;
        this.whatsAppService = whatsAppService;
        this.notificationService = notificationService;
    }

    // ======================================================
    // ✅ AI SCORING FUNCTION
    // ======================================================
    private int calculateScore(Student s) {

        int score = 0;

        // 🔥 Example AI logic (customizable)
        if (s.getDepartment() != null) score += 10;

        if (s.getName() != null) {
            score += s.getName().length(); // variation
        }

        // Random factor (AI-like behavior)
        score += new Random().nextInt(50);

        return score;
    }

    // ======================================================
    // ✅ ALLOCATION (FAST + AI + EMAIL AFTER)
    // ======================================================
   @Transactional
public List<StudentAllocationDTO> allocateSeats(Exam savedExam) {

    List<Student> students = studentRepository.findAll();
    List<ExamHall> halls = examHallRepository.findAll();

    if (students.isEmpty()) throw new RuntimeException("No students ❌");
    if (halls.isEmpty()) throw new RuntimeException("No halls ❌");

    Map<String, Student> uniqueMap = new LinkedHashMap<>();
    for (Student s : students) {
        if (s.getEmail() != null) {
            uniqueMap.putIfAbsent(s.getEmail(), s);
        }
    }

    List<Student> uniqueStudents = new ArrayList<>(uniqueMap.values());

    uniqueStudents.sort((a, b) ->
            Integer.compare(calculateScore(b), calculateScore(a))
    );

    Map<String, Queue<Student>> deptMap = new LinkedHashMap<>();

    for (Student s : uniqueStudents) {
        String dept = (s.getDepartment() != null)
                ? s.getDepartment().getDepartmentName()
                : "N/A";

        deptMap.putIfAbsent(dept, new LinkedList<>());
        deptMap.get(dept).add(s);
    }

    List<String> departments = new ArrayList<>(deptMap.keySet());

    seatAllocationRepository.deleteAllInBatch();

    List<StudentAllocationDTO> result = new ArrayList<>();
    List<SeatAllocation> batch = new ArrayList<>();

    DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    String examTimeFormatted = savedExam.getExamDateTime() != null
            ? savedExam.getExamDateTime().format(formatter)
            : "N/A";

    for (ExamHall hall : halls) {

        String hallDisplay = hall.getHallName() + "-01";
        int seatCounter = 1;

        for (int i = 0; i < hall.getCapacity(); i++) {

            int deptIndex = i % departments.size();
            String deptName = departments.get(deptIndex);

            Student selected = null;

            if (!deptMap.get(deptName).isEmpty()) {
                selected = deptMap.get(deptName).poll();
            } else {
                for (String d : departments) {
                    if (!deptMap.get(d).isEmpty()) {
                        selected = deptMap.get(d).poll();
                        deptName = d;
                        break;
                    }
                }
            }

            if (selected == null) break;

            int row = (seatCounter - 1) / COLUMNS;
            int col = (seatCounter - 1) % COLUMNS;
            String seatDisplay = (char) ('A' + col) + "" + (row + 1);

            SeatAllocation alloc = new SeatAllocation();
            alloc.setStudent(selected);
            alloc.setExamHall(hall);
            alloc.setSeatNumber(seatCounter);
            alloc.setSeatCode(seatDisplay);
            alloc.setExam(savedExam);
            alloc.setCourseCode(savedExam.getCourseCode());
            alloc.setExamTime(savedExam.getExamDateTime());

            batch.add(alloc);

            result.add(new StudentAllocationDTO(
                    selected.getName(),
                    selected.getEmail(),
                    hallDisplay,
                    seatDisplay,
                    savedExam.getExamName(),
                    examTimeFormatted,
                    deptName
            ));

            seatCounter++;
        }
    }

    seatAllocationRepository.saveAll(batch);

    return result;
}
    // ======================================================
    // ✅ WHATSAPP (MANUAL TRIGGER)
    // ======================================================
    public void sendBulkWhatsApp(List<StudentAllocationDTO> list) {

        for (StudentAllocationDTO dto : list) {

            boolean sent = false;
            String phone = null;

            String message = "📢 Exam Seating\n\n" +
                    "Name: " + dto.getName() + "\n" +
                    "Hall: " + dto.getHall() + "\n" +
                    "Seat: " + dto.getSeat();

            try {
                Optional<Student> optionalStudent =
                        studentRepository.findByEmail(dto.getEmail());

                if (optionalStudent.isPresent()) {
                    phone = optionalStudent.get().getPhone();

                    if (phone != null && !phone.isEmpty()) {
                        sent = whatsAppService.sendWhatsApp(phone, message);
                    }
                }

            } catch (Exception e) {
                sent = false;
            }

            notificationService.saveNotification(
                    dto.getEmail(),
                    phone,
                    message,
                    sent
            );
        }
    }

    // ======================================================
    // ✅ GET ALL
    // ======================================================
    public List<StudentAllocationDTO> getAllAllocationsDTO() {

        List<SeatAllocation> list = seatAllocationRepository.findAll();
        List<StudentAllocationDTO> result = new ArrayList<>();

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        for (SeatAllocation a : list) {

            String hallDisplay = a.getExamHall().getHallName() + "-01";

            int row = (a.getSeatNumber() - 1) / COLUMNS;
            int col = (a.getSeatNumber() - 1) % COLUMNS;

            String seatDisplay = (char) ('A' + col) + "" + (row + 1);

            String time = a.getExamTime() != null
                    ? a.getExamTime().format(formatter)
                    : "N/A";

            result.add(new StudentAllocationDTO(
                    a.getStudent().getName(),
                    a.getStudent().getEmail(),
                    hallDisplay,
                    seatDisplay,
                    a.getExam().getExamName(),
                    time,
                    a.getStudent().getDepartment().getDepartmentName()
            ));
        }

        return result;
    }

    // ======================================================
    // ✅ GET BY EMAIL
    // ======================================================
    public List<StudentAllocationDTO> getAllocationByEmail(String email) {

        List<SeatAllocation> list =
                seatAllocationRepository.findByStudent_Email(email);

        List<StudentAllocationDTO> result = new ArrayList<>();

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        for (SeatAllocation a : list) {

            String hallDisplay = a.getExamHall().getHallName() + "-01";

            int row = (a.getSeatNumber() - 1) / COLUMNS;
            int col = (a.getSeatNumber() - 1) % COLUMNS;

            String seatDisplay = (char) ('A' + col) + "" + (row + 1);

            String time = a.getExamTime() != null
                    ? a.getExamTime().format(formatter)
                    : "N/A";

            result.add(new StudentAllocationDTO(
                    a.getStudent().getName(),
                    a.getStudent().getEmail(),
                    hallDisplay,
                    seatDisplay,
                    a.getExam().getExamName(),
                    time,
                    a.getStudent().getDepartment().getDepartmentName()
            ));
        }

        return result;
    }
    // ======================================================
// ✅ BULK EMAIL (MANUAL TRIGGER)
// ======================================================
public void sendBulkEmail(List<StudentAllocationDTO> list) {
    emailService.sendBulkEmails(list);
}

    // ======================================================
    // ✅ RAW DATA
    // ======================================================
    public List<SeatAllocation> getAllAllocations() {
        return seatAllocationRepository.findAll();
    }
}