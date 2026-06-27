package com.college.exam.seating.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.college.exam.seating.system.entity.Student;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findByDepartment_DepartmentId(Long departmentId);
    List<Student> findByYear(Integer year);

    // 🔥 IMPORTANT for duplicate prevention
    Optional<Student> findByEmail(String email);
}