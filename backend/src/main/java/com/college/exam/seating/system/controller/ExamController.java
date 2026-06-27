package com.college.exam.seating.system.controller;

import com.college.exam.seating.system.entity.Exam;
import com.college.exam.seating.system.repository.ExamRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/exam")
@CrossOrigin(origins = "http://localhost:3000")
public class ExamController {

    private final ExamRepository examRepository;

    public ExamController(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    // ✅ CREATE EXAM
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public String addExam(@RequestBody Exam exam) {

        if (exam.getCourseCode() == null || exam.getCourseCode().isEmpty()) {
            throw new RuntimeException("Course Code required ❌");
        }

        if (exam.getExamName() == null || exam.getExamName().isEmpty()) {
            throw new RuntimeException("Exam Name required ❌");
        }

        if (exam.getExamDateTime() == null) {
            throw new RuntimeException("Exam Date Time required ❌");
        }

        examRepository.save(exam);

        return "Exam created successfully ✅";
    }

    // ✅ GET ALL EXAMS
    @GetMapping("/all")
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public Exam getExam(@PathVariable Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found ❌"));
    }

    // ✅ DELETE EXAM
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteExam(@PathVariable Long id) {
        examRepository.deleteById(id);
        return "Exam deleted ✅";
    }
}