package com.college.exam.seating.system.dto;

public class StudentAllocationDTO {

    private String name;
    private String email;
    private String hall;        // Example: C1-03
    private String seat;        // Example: A1, B2
    private String examName;
    private String examTime;
    private String department;

    // ✅ Default constructor (required for JSON)
    public StudentAllocationDTO() {
    }

    // ✅ Parameterized constructor
    public StudentAllocationDTO(String name, String email, String hall,
                                String seat, String examName,
                                String examTime, String department) {
        this.name = name;
        this.email = email;
        this.hall = hall;
        this.seat = seat;
        this.examName = examName;
        this.examTime = examTime;
        this.department = department;
    }

    // ================= GETTERS =================

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getHall() {
        return hall;
    }

    public String getSeat() {
        return seat;
    }

    public String getExamName() {
        return examName;
    }

    public String getExamTime() {
        return examTime;
    }

    public String getDepartment() {
        return department;
    }

    // ================= SETTERS =================

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setHall(String hall) {
        this.hall = hall;
    }

    public void setSeat(String seat) {
        this.seat = seat;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

    public void setExamTime(String examTime) {
        this.examTime = examTime;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    // ✅ OPTIONAL (VERY USEFUL FOR DEBUGGING)
    @Override
    public String toString() {
        return "StudentAllocationDTO{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", hall='" + hall + '\'' +
                ", seat='" + seat + '\'' +
                ", examName='" + examName + '\'' +
                ", examTime='" + examTime + '\'' +
                ", department='" + department + '\'' +
                '}';
    }
}