package com.college.exam.seating.system.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "seat_allocation",
    uniqueConstraints = {

        @UniqueConstraint(columnNames = {"student_id", "exam_id"}),

        @UniqueConstraint(columnNames = {"exam_hall_id", "seat_number", "exam_id"})
    }
)
public class SeatAllocation implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 Student
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // 🔹 Exam Hall
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exam_hall_id", nullable = false)
    private ExamHall examHall;

    // 🔹 Numeric seat (for internal logic)
    @Column(name = "seat_number", nullable = false)
    private int seatNumber;

    // 🔥 NEW: FORMATTED SEAT (A1-01, A1-02)
    @Column(name = "seat_code", nullable = false, length = 20)
    private String seatCode;

    // 🔹 Exam
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    // 🔹 Course code
    private String courseCode;

    // 🔹 Exam datetime
    @Column(name = "exam_time")
    private LocalDateTime examTime;

    // ================= GETTERS & SETTERS =================

    public Long getId() {
        return id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public ExamHall getExamHall() {
        return examHall;
    }

    public void setExamHall(ExamHall examHall) {
        this.examHall = examHall;
    }

    public int getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(int seatNumber) {
        this.seatNumber = seatNumber;
    }

    // 🔥 NEW GETTER/SETTER
    public String getSeatCode() {
        return seatCode;
    }

    public void setSeatCode(String seatCode) {
        this.seatCode = seatCode;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public LocalDateTime getExamTime() {
        return examTime;
    }

    public void setExamTime(LocalDateTime examTime) {
        this.examTime = examTime;
    }
}