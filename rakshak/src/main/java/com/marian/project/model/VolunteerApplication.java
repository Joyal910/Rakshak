package com.marian.project.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "volunteer_applications")
public class VolunteerApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private int applicationId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // The user applying to be a volunteer

    @Column(name = "application_date", nullable = false)
    private LocalDateTime applicationDate; // Date the application was submitted

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.PENDING; // Default status is "Pending"

    @Column(name = "description", length = 500, nullable = true)
    private String description; // Description or additional details provided by the user

    // Enum for application status
    public enum ApplicationStatus {
        PENDING, APPROVED, REJECTED
    }

    @PrePersist
    protected void onCreate() {
        this.applicationDate = LocalDateTime.now(); // Set the application date to the current time
    }

    // Getters and Setters
    public int getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(int applicationId) {
        this.applicationId = applicationId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDateTime applicationDate) {
        this.applicationDate = applicationDate;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "VolunteerApplication [applicationId=" + applicationId + ", user=" + user +
                ", applicationDate=" + applicationDate + ", status=" + status +
                ", description=" + description + "]";
    }
}
