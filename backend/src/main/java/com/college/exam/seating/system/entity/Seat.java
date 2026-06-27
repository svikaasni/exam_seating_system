package com.college.exam.seating.system.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Getter
@Setter
@Table(
    name = "seat",
    uniqueConstraints = {
        // 🔥 Prevent duplicate seats in same hall
        @UniqueConstraint(columnNames = {"seat_number", "exam_hall_id"})
    }
)
public class Seat implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 Seat number (e.g., A1, B2)
    @Column(name = "seat_number", nullable = false)
    private String seatNumber;

    // 🔹 Linked exam hall
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exam_hall_id", nullable = false)
    private ExamHall examHall;

    @Override
    public String toString() {
        return "Seat{" +
                "id=" + id +
                ", seatNumber='" + seatNumber + '\'' +
                '}';
    }
}