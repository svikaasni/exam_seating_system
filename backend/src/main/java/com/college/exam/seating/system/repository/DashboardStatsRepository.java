package com.college.exam.seating.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.college.exam.seating.system.entity.DashboardStats;

public interface DashboardStatsRepository extends JpaRepository<DashboardStats, Long> {
}