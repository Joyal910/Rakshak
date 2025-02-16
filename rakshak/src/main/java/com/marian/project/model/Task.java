package com.marian.project.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "task_id")
	private int taskId; // Change from Long to int


    @OneToOne
    @JoinColumn(name = "request_id", nullable = false)
    private TaskRequest taskRequest; // Links to the original task request

    @ManyToOne
    @JoinColumn(name = "volunteer_id")
    private User volunteer; // User entity with the role of "Volunteer" who accepted the task

    @Column(name = "photo", length = 255, nullable = false)
    private String photo; // Path to the photo uploaded during task execution

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.PENDING; // Default status is "Pending"

    @Column(name = "volunteer_remarks", columnDefinition = "TEXT")
    private String volunteerRemarks;

    @Column(name = "admin_remarks", columnDefinition = "TEXT")
    private String adminRemarks;

    	@Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // Task creation timestamp

    @Column(name = "deadline")
    private LocalDateTime deadline; // Deadline for task completion
    
    

    // Enum for task status
    public enum TaskStatus {
        PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(); // Automatically set createdAt
    }

    // Getters and Setters
    public int getTaskId() {
        return taskId;
    }

    public void setTaskId(int taskId) {
        this.taskId = taskId;
    }

    public TaskRequest getTaskRequest() {
        return taskRequest;
    }

    public void setTaskRequest(TaskRequest taskRequest) {
        this.taskRequest = taskRequest;
    }

    public User getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(User volunteerId) {
        this.volunteer = volunteerId;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public String getVolunteerRemarks() {
        return volunteerRemarks;
    }

    public void setVolunteerRemarks(String volunteerRemarks) {
        this.volunteerRemarks = volunteerRemarks;
    }

    public String getAdminRemarks() {
        return adminRemarks;
    }

    public void setAdminRemarks(String adminRemarks) {
        this.adminRemarks = adminRemarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    @Override
    public String toString() {
        return "Task [taskId=" + taskId + ", taskRequest=" + taskRequest +
                ", volunteer=" + volunteer + ", photo=" + photo +
                ", status=" + status + ", volunteerRemarks=" + volunteerRemarks +
                ", adminRemarks=" + adminRemarks + ", createdAt=" + createdAt +
                ", deadline=" + deadline + "]";
    }
}
