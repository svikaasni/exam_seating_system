package com.college.exam.seating.system.service;

import com.college.exam.seating.system.entity.ExamHall;
import com.college.exam.seating.system.repository.ExamHallRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamHallService {

    private final ExamHallRepository examHallRepository;

    public ExamHallService(ExamHallRepository examHallRepository) {
        this.examHallRepository = examHallRepository;
    }

    public ExamHall saveExamHall(ExamHall examHall) {
        return examHallRepository.save(examHall);
    }

    public List<ExamHall> getAllExamHalls() {
        return examHallRepository.findAll();
    }

    public ExamHall getExamHallById(Long id) {
        return examHallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam Hall not found"));
    }

    public void deleteExamHall(Long id) {
        examHallRepository.deleteById(id);
    }
}