package com.marian.project.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "task_requests")
public class TaskRequest {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "request_id")
	private int requestId; // Change from Long to int

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // User who created the task request

    @Column(name = "request_title", nullable = false, length = 255)
    private String requestTitle; // Title of the task request

    @Column(name = "request_description", nullable = false, length = 1000)
    private String requestDescription; // Description of the task request

    @Column(name = "location", nullable = false, length = 255)
    private String location; // Location for the task

    @Column(name = "photo", length = 255)
    private String photo; // Path to the uploaded photo (optional)

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING; // Default status is "Pending"

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // Timestamp when the request was created

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // Timestamp when the request was last updated

    // Enum for request status
    public enum RequestStatus {
        PENDING, APPROVED, REJECTED
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(); // Automatically set createdAt
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now(); // Automatically set updatedAt
    }

    // Getters and Setters
    public int getRequestId() {
        return requestId;
    }

    public void setRequestId(int requestId) {
        this.requestId = requestId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRequestTitle() {
        return requestTitle;
    }

    public void setRequestTitle(String requestTitle) {
        this.requestTitle = requestTitle;
    }

    public String getRequestDescription() {
        return requestDescription;
    }

    public void setRequestDescription(String requestDescription) {
        this.requestDescription = requestDescription;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    @Override
    public String toString() {
        return "TaskRequest [requestId=" + requestId + ", user=" + user +
                ", requestTitle=" + requestTitle + ", requestDescription=" + requestDescription +
                ", location=" + location + ", photo=" + photo +
                ", status=" + status + ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt + "]";
    }
}
