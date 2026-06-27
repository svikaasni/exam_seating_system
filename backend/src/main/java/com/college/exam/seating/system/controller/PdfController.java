package com.college.exam.seating.system.controller;

import com.college.exam.seating.system.entity.SeatAllocation;
import com.college.exam.seating.system.entity.DashboardStats;
import com.college.exam.seating.system.repository.DashboardStatsRepository;
import com.college.exam.seating.system.service.AllocationService;
import com.college.exam.seating.system.service.PdfService;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/pdf")
@CrossOrigin(origins = "http://localhost:3000")
public class PdfController {

    private final PdfService pdfService;
    private final AllocationService allocationService;
    private final DashboardStatsRepository statsRepository;

    public PdfController(PdfService pdfService,
                         AllocationService allocationService,
                         DashboardStatsRepository statsRepository) {
        this.pdfService = pdfService;
        this.allocationService = allocationService;
        this.statsRepository = statsRepository;
    }

    private DashboardStats getStats() {
        return statsRepository.findAll()
                .stream()
                .findFirst()
                .orElseGet(() -> statsRepository.save(new DashboardStats()));
    }

    // ================= GENERATE PDF =================
    @GetMapping("/allocation")
    public ResponseEntity<InputStreamResource> generatePdf(@RequestParam String exam) {
        try {

            List<SeatAllocation> allocations = allocationService.getAllAllocations()
                    .stream()
                    .filter(a -> a.getExam() != null &&
                            exam.equalsIgnoreCase(a.getExam().getExamName()))
                    .collect(Collectors.toList());

            if (allocations.isEmpty()) {
                return ResponseEntity.status(404).body(null);
            }

            byte[] pdfData = pdfService.generateAllocationPdf(exam, allocations);

            if (pdfData == null) {
                return ResponseEntity.internalServerError().build();
            }

            // 🔥 UPDATE PDF COUNT
            DashboardStats stats = getStats();
            stats.setPdfGenerated(stats.getPdfGenerated() + 1);
            statsRepository.save(stats);

            ByteArrayInputStream inputStream = new ByteArrayInputStream(pdfData);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=" + exam.replaceAll("\\s+", "_") + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(inputStream));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}