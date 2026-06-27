package com.college.exam.seating.system.service;

import com.college.exam.seating.system.entity.Seat;
import com.college.exam.seating.system.entity.ExamHall;
import com.college.exam.seating.system.repository.SeatRepository;
import com.college.exam.seating.system.repository.ExamHallRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final ExamHallRepository examHallRepository;

    public SeatService(SeatRepository seatRepository,
                       ExamHallRepository examHallRepository) {
        this.seatRepository = seatRepository;
        this.examHallRepository = examHallRepository;
    }

    public Seat addSeat(Long hallId, Seat seat) {

        ExamHall hall = examHallRepository.findById(hallId)
                .orElseThrow(() -> new RuntimeException("Hall not found"));

        if (seatRepository.existsBySeatNumberAndExamHall_HallId(
                seat.getSeatNumber(), hallId)) {
            throw new RuntimeException("Seat already exists ❌");
        }

        seat.setExamHall(hall);

        return seatRepository.save(seat);
    }

    public List<Seat> getSeatsByHall(Long hallId) {
        return seatRepository.findByExamHall_HallId(hallId);
    }

    public void deleteSeat(Long id) {
        seatRepository.deleteById(id);
    }
}