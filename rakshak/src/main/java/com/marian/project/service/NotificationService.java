package com.marian.project.service;

import com.marian.project.model.Notification;
import com.marian.project.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // Create a new notification
    public Notification createNotification(Notification notification) {
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    // Fetch notifications for a specific role
    public List<Notification> getNotificationsForUser(String role) {
        return notificationRepository.findActiveNotificationsForRole(role, LocalDateTime.now());
    }

    // Update an existing notification
    public Notification updateNotification(Long id, Notification updatedNotification) {
        Notification existingNotification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        existingNotification.setTitle(updatedNotification.getTitle());
        existingNotification.setMessage(updatedNotification.getMessage());
        existingNotification.setType(updatedNotification.getType());
        existingNotification.setTargetRole(updatedNotification.getTargetRole());
        existingNotification.setScheduledFor(updatedNotification.getScheduledFor());

        return notificationRepository.save(existingNotification);
    }

    // Delete a notification (soft delete)
    public void deleteNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setActive(false);
        notificationRepository.save(notification);
    }
}