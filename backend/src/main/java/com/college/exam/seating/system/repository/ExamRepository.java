package com.college.exam.seating.system.repository;

import com.college.exam.seating.system.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {

    // ✅ RETURN LIST (FIX FOR DUPLICATES)
    List<Exam> findByExamName(String examName);
}