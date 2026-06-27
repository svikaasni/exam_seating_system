package com.college.exam.seating.system.repository;

import org.springframework.transaction.annotation.Transactional;
import com.college.exam.seating.system.entity.SeatAllocation;
import com.college.exam.seating.system.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatAllocationRepository extends JpaRepository<SeatAllocation, Long> {

    // ✅ Correct (Student → email)
    List<SeatAllocation> findByStudent_Email(String email);

    List<SeatAllocation> findByExam_ExamName(String examName);

    @Transactional
    void deleteByExam(Exam exam);

    boolean existsByStudent_StudentIdAndExam_ExamId(Long studentId, Long examId);

    boolean existsByExamHall_HallIdAndSeatNumberAndExam_ExamId(
            Long hallId, int seatNumber, Long examId);
}