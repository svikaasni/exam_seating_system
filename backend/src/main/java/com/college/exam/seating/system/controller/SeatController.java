package com.college.exam.seating.system.controller;

import com.college.exam.seating.system.entity.Seat;
import com.college.exam.seating.system.service.SeatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seats")
@CrossOrigin(origins = "http://localhost:3000")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @PostMapping("/hall/{hallId}")
    public Seat addSeat(@PathVariable Long hallId,
                        @RequestBody Seat seat) {
        return seatService.addSeat(hallId, seat);
    }

    @GetMapping("/hall/{hallId}")
    public List<Seat> getSeatsByHall(@PathVariable Long hallId) {
        return seatService.getSeatsByHall(hallId);
    }

    @DeleteMapping("/{id}")
    public String deleteSeat(@PathVariable Long id) {
        seatService.deleteSeat(id);
        return "Seat deleted successfully";
    }
}