package com.college.exam.seating.system.controller;

import com.college.exam.seating.system.entity.Student;
import com.college.exam.seating.system.entity.Department;
import com.college.exam.seating.system.entity.SeatAllocation;
import com.college.exam.seating.system.repository.StudentRepository;
import com.college.exam.seating.system.repository.SeatAllocationRepository;
import com.college.exam.seating.system.repository.DepartmentRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/student")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    private final StudentRepository studentRepository;
    private final SeatAllocationRepository allocationRepository;
    private final DepartmentRepository departmentRepository;

    public StudentController(StudentRepository studentRepository,
                             SeatAllocationRepository allocationRepository,
                             DepartmentRepository departmentRepository) {
        this.studentRepository = studentRepository;
        this.allocationRepository = allocationRepository;
        this.departmentRepository = departmentRepository;
    }

    // ✅ GET ALL
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // ✅ ADD SINGLE (duplicate safe)
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public String addStudent(@RequestBody Student student) {

        if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
            return "Student already exists (duplicate email skipped)";
        }

        studentRepository.save(student);
        return "Student added successfully!";
    }

    // ✅ UPLOAD (🔥 FULLY FIXED)
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public String uploadStudents(@RequestBody List<Student> students) {

        if (students == null || students.isEmpty()) {
            return "No data found ❌";
        }

        List<Student> validStudents = new ArrayList<>();
        Set<String> seenEmails = new HashSet<>();

        int skipped = 0;

        for (Student s : students) {

            if (s.getEmail() == null || s.getEmail().trim().isEmpty()) {
                skipped++;
                continue;
            }

            String email = s.getEmail().trim().toLowerCase();

            // ❌ Duplicate inside SAME Excel
            if (seenEmails.contains(email)) {
                skipped++;
                continue;
            }

            // ❌ Duplicate in DATABASE
            if (studentRepository.findByEmail(email).isPresent()) {
                skipped++;
                continue;
            }

            seenEmails.add(email);

            // ✅ Department validation
            if (s.getDepartment() == null ||
                s.getDepartment().getDepartmentName() == null) {

                throw new RuntimeException("Department missing for student: " + s.getName());
            }

            String deptName = s.getDepartment().getDepartmentName().trim();

            Department dept = departmentRepository
                    .findByDepartmentNameIgnoreCase(deptName)
                    .orElseThrow(() ->
                            new RuntimeException("Department NOT FOUND: " + deptName));

            s.setDepartment(dept);

            validStudents.add(s);
        }

        studentRepository.saveAll(validStudents);

        return "✅ Uploaded: " + validStudents.size() +
               " | ❌ Skipped duplicates: " + skipped;
    }

    // ✅ STUDENT VIEW ALLOCATION
    @GetMapping("/my-allocation")
    @PreAuthorize("hasRole('STUDENT')")
    public List<SeatAllocation> getMyAllocation(Authentication auth) {
        String email = auth.getName();
        return allocationRepository.findByStudent_Email(email);
    }
}