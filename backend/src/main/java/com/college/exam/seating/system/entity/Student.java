package com.college.exam.seating.system.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "student",
    uniqueConstraints = @UniqueConstraint(columnNames = "email") // 🔥 prevents duplicates permanently
)
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    private String registerNo;
    private String name;
    private Integer year;
    private String phone;

    @Column(nullable = false, unique = true) // 🔥 important
    private String email;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    // getters & setters

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getRegisterNo() { return registerNo; }
    public void setRegisterNo(String registerNo) { this.registerNo = registerNo; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
}