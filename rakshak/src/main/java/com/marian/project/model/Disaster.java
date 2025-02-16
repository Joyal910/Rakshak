package com.marian.project.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "disasters")
public class Disaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long disasterId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "location", nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "disaster_type", nullable = false)
    private DisasterType disasterType;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity", nullable = false)
    private Severity severity;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "reported_at", nullable = false, updatable = false)
    private LocalDateTime reportedAt;

    public Disaster() {
    }

    public Disaster(Long disasterId, String name, String description, String location, DisasterType disasterType, Severity severity, Status status, LocalDateTime reportedAt) {
        this.disasterId = disasterId;
        this.name = name;
        this.description = description;
        this.location = location;
        this.disasterType = disasterType;
        this.severity = severity;
        this.status = status;
        this.reportedAt = reportedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.reportedAt = LocalDateTime.now();
    }

    // Enums
    public enum DisasterType {
        FLOOD, EARTHQUAKE, FIRE, CYCLONE, OTHER
    }

    public enum Severity {
        LOW, MEDIUM, HIGH
    }

    public enum Status {
        ACTIVE, INACTIVE, RESOLVED
    }

    // Getters and Setters
    public Long getDisasterId() {
        return disasterId;
    }

    public void setDisasterId(Long disasterId) {
        this.disasterId = disasterId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public DisasterType getDisasterType() {
        return disasterType;
    }

    public void setDisasterType(DisasterType disasterType) {
        this.disasterType = disasterType;
    }

    public Severity getSeverity() {
        return severity;
    }

    public void setSeverity(Severity severity) {
        this.severity = severity;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getReportedAt() {
        return reportedAt;
    }

    public void setReportedAt(LocalDateTime reportedAt) {
        this.reportedAt = reportedAt;
    }

    @Override
    public String toString() {
        return "Disaster [disasterId=" + disasterId + ", name=" + name + ", description=" + description 
            + ", location=" + location + ", disasterType=" + disasterType + ", severity=" + severity 
            + ", status=" + status + ", reportedAt=" + reportedAt + "]";
    }
}
