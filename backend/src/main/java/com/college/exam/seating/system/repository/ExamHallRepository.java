package com.college.exam.seating.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.college.exam.seating.system.entity.ExamHall;

public interface ExamHallRepository extends JpaRepository<ExamHall, Long> {

}