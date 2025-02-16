package com.marian.project.repository;

import com.marian.project.model.Notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByActiveTrue();

    @Query("SELECT n FROM Notification n WHERE n.active = true AND " +
           "(n.targetRole = ?1 OR n.targetRole = 'All') AND " +
           "n.scheduledFor <= ?2 ORDER BY n.scheduledFor DESC")
    List<Notification> findActiveNotificationsForRole(String role, LocalDateTime now);
}