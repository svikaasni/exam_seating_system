package com.college.exam.seating.system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "exam_hall")
public class ExamHall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hallId;

    // Example: "Hall 1"
    private String hallName;

    // ✅ MAIN FIELD → "C1-03"
    private String hallCode;

    // Total seats
    private int capacity;

    // ================= GETTERS =================
    public Long getHallId() {
        return hallId;
    }

    public String getHallName() {
        return hallName;
    }

    public String getHallCode() {
        return hallCode;
    }

    public int getCapacity() {
        return capacity;
    }

    // ================= SETTERS =================
    public void setHallName(String hallName) {
        this.hallName = hallName;
    }

    public void setHallCode(String hallCode) {
        this.hallCode = hallCode;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    // ✅ HELPER METHOD (VERY IMPORTANT)
    public String getDisplayHall() {
        return (hallCode != null && !hallCode.isEmpty())
                ? hallCode
                : hallName;
    }
}