package com.college.exam.seating.system.controller;

import com.college.exam.seating.system.service.AllocationService;
import com.college.exam.seating.system.dto.StudentAllocationDTO;
import com.college.exam.seating.system.entity.Exam;
import com.college.exam.seating.system.repository.ExamRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/allocation")
@CrossOrigin(origins = "http://localhost:3000")
public class AllocationController {

    private final AllocationService allocationService;
    private final ExamRepository examRepository;

    public AllocationController(AllocationService allocationService,
                                ExamRepository examRepository) {
        this.allocationService = allocationService;
        this.examRepository = examRepository;
    }

    // ================= RUN ALLOCATION =================
    @PostMapping("/run")
    @PreAuthorize("hasRole('ADMIN')")
    public List<StudentAllocationDTO> runAllocation(@RequestBody Exam request) {

        if (request == null || request.getExamName() == null) {
            throw new RuntimeException("Exam data missing ❌");
        }

        Exam exam = new Exam();
        exam.setExamName(request.getExamName());
        exam.setCourseCode(request.getCourseCode());
        exam.setExamDateTime(
                request.getExamDateTime() != null
                        ? request.getExamDateTime()
                        : LocalDateTime.now()
        );

        Exam savedExam = examRepository.save(exam);

        // ✅ STEP 1: Allocate
        List<StudentAllocationDTO> list =
                allocationService.allocateSeats(savedExam);

        // ✅ STEP 2: Send Emails (Bulk)
        allocationService.sendBulkEmail(list);

        return list;
    }

    // ================= WHATSAPP =================
    @PostMapping("/send-whatsapp")
    public String sendWhatsApp() {
        List<StudentAllocationDTO> list =
                allocationService.getAllAllocationsDTO();
        allocationService.sendBulkWhatsApp(list);
        return "WhatsApp Sent ✅";
    }

    // ================= GET ALL =================
    @GetMapping("/list")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<StudentAllocationDTO> getAllAllocations() {
        return allocationService.getAllAllocationsDTO();
    }

    // ================= MY =================
    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public List<StudentAllocationDTO> getMyAllocation(Authentication auth) {
        return allocationService.getAllocationByEmail(auth.getName());
    }
}