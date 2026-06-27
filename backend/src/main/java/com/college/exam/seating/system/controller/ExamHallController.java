package com.college.exam.seating.system.controller;

import com.college.exam.seating.system.entity.ExamHall;
import com.college.exam.seating.system.service.ExamHallService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exam-halls")
@CrossOrigin(origins = "http://localhost:3000")
public class ExamHallController {

    private final ExamHallService examHallService;

    public ExamHallController(ExamHallService examHallService) {
        this.examHallService = examHallService;
    }

    @PostMapping
    public ExamHall createExamHall(@RequestBody ExamHall examHall) {
        return examHallService.saveExamHall(examHall);
    }

    @GetMapping
    public List<ExamHall> getAllExamHalls() {
        return examHallService.getAllExamHalls();
    }

    @GetMapping("/{id}")
    public ExamHall getExamHallById(@PathVariable Long id) {
        return examHallService.getExamHallById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteExamHall(@PathVariable Long id) {
        examHallService.deleteExamHall(id);
        return "Exam Hall deleted successfully";
    }
}