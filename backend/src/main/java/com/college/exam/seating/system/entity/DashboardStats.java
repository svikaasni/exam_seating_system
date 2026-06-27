package com.college.exam.seating.system.entity;

import jakarta.persistence.*;

@Entity
public class DashboardStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long allocationsRun = 0L;
    private Long emailsSent = 0L;
    private Long pdfGenerated = 0L;

    // GETTERS & SETTERS

    public Long getId() {
        return id;
    }

    public Long getAllocationsRun() {
        return allocationsRun;
    }

    public void setAllocationsRun(Long allocationsRun) {
        this.allocationsRun = allocationsRun;
    }

    public Long getEmailsSent() {
        return emailsSent;
    }

    public void setEmailsSent(Long emailsSent) {
        this.emailsSent = emailsSent;
    }

    public Long getPdfGenerated() {
        return pdfGenerated;
    }

    public void setPdfGenerated(Long pdfGenerated) {
        this.pdfGenerated = pdfGenerated;
    }
}