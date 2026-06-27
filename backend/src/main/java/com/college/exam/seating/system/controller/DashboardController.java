package com.college.exam.seating.system.controller;

import com.college.exam.seating.system.entity.DashboardStats;
import com.college.exam.seating.system.repository.DashboardStatsRepository;
import com.college.exam.seating.system.repository.StudentRepository;
import com.college.exam.seating.system.repository.SeatAllocationRepository;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    private final StudentRepository studentRepository;
    private final SeatAllocationRepository allocationRepository;
    private final DashboardStatsRepository statsRepository;

    public DashboardController(StudentRepository studentRepository,
                               SeatAllocationRepository allocationRepository,
                               DashboardStatsRepository statsRepository) {
        this.studentRepository = studentRepository;
        this.allocationRepository = allocationRepository;
        this.statsRepository = statsRepository;
    }

    private DashboardStats getStats() {
        return statsRepository.findAll()
                .stream()
                .findFirst()
                .orElseGet(() -> statsRepository.save(new DashboardStats()));
    }

    @GetMapping("/stats")
    public Map<String, Long> getStatsData() {

        DashboardStats stats = getStats();

        Map<String, Long> map = new HashMap<>();

        map.put("students", studentRepository.count());
        map.put("allocations", stats.getAllocationsRun());
        map.put("emails", stats.getEmailsSent());
        map.put("pdf", stats.getPdfGenerated());

        return map;
    }
}