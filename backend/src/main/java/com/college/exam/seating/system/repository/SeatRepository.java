package com.college.exam.seating.system.repository;

import com.college.exam.seating.system.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    // ✅ FIXED
    boolean existsBySeatNumberAndExamHall_HallId(String seatNumber, Long hallId);

    // ✅ FIXED
    List<Seat> findByExamHall_HallId(Long hallId);
}