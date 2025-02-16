package com.marian.project.service;

import com.marian.project.model.Task;
import com.marian.project.model.Task.TaskStatus;
import com.marian.project.model.TaskRequest;
import com.marian.project.model.User;
import com.marian.project.repository.TaskRepository;
import com.marian.project.repository.TaskRequestRepository;
import com.marian.project.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Path;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRequestRepository taskRequestRepository;

    // Task Request Methods
    public TaskRequest createTaskRequest(TaskRequest taskRequest) {
        taskRequest.setStatus(TaskRequest.RequestStatus.PENDING);
        return taskRequestRepository.save(taskRequest);
    }

    public List<TaskRequest> getAllTaskRequests() {
        return taskRequestRepository.findAll();
    }

    public List<TaskRequest> getTaskRequestsByUser(Long userId) {
        // Assuming you have a UserRepository to fetch the User entity
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        return taskRequestRepository.findByUser(user);
    }

    public List<TaskRequest> getTaskRequestsByStatus(TaskRequest.RequestStatus status) {
        return taskRequestRepository.findByStatus(status);
    }

    @Transactional
    public Task approveTaskRequest(Integer requestId) {
        TaskRequest taskRequest = taskRequestRepository.findById(requestId)
            .orElseThrow(() -> new EntityNotFoundException("TaskRequest not found with id: " + requestId));

        // Update task request status
        taskRequest.setStatus(TaskRequest.RequestStatus.APPROVED);
        taskRequestRepository.save(taskRequest);

        // Create new task
        Task task = new Task();
        task.setTaskRequest(taskRequest);
        task.setStatus(Task.TaskStatus.PENDING);
        
        // Set default photo path (you might want to modify this based on your requirements)
        task.setPhoto("default_path.jpg");
        
        // Optional: Set deadline (e.g., 7 days from creation)
        task.setDeadline(LocalDateTime.now().plusDays(7));

        return taskRepository.save(task);
    }

    public TaskRequest rejectTaskRequest(Integer requestId) {
        TaskRequest taskRequest = taskRequestRepository.findById(requestId)
            .orElseThrow(() -> new EntityNotFoundException("TaskRequest not found with id: " + requestId));
        
        taskRequest.setStatus(TaskRequest.RequestStatus.REJECTED);
        return taskRequestRepository.save(taskRequest);
    }

    public void deleteTaskRequest(Integer requestId) {
        taskRequestRepository.deleteById(requestId);
    }

    public List<Task> getAvailableTasks() {
        return taskRepository.findAvailableTasks();
    }

    public List<Task> getTasksByVolunteer(Long volunteerId) {
        User volunteer = userRepository.findByUserId(volunteerId)
                .orElseThrow(() -> new EntityNotFoundException("Volunteer not found"));
        return taskRepository.findByVolunteer(volunteer);
    }

    @Transactional
    public Task acceptTask(Integer taskId, Long volunteerId) {
        // Validate task existence
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));
        
        // Check if task is already assigned
        if (task.getVolunteer() != null) {
            throw new IllegalStateException("Task is already assigned to another volunteer");
        }

        // Check if task is in a state that can be accepted
        if (task.getStatus() != TaskStatus.PENDING) {
            throw new IllegalStateException("Task is not in a state that can be accepted. Current status: " + task.getStatus());
        }

        // Validate volunteer
        User volunteer = userRepository.findByUserId(volunteerId)
                .orElseThrow(() -> new EntityNotFoundException("Volunteer not found with id: " + volunteerId));
        
        // Debugging: Print out the actual role and ensure correct comparison
        System.out.println("User Role: " + volunteer.getRole());
        System.out.println("User ID: " + volunteer.getUserId());
        
        // More flexible role checking
        if (volunteer.getRole() == null || 
            !volunteer.getRole().trim().equalsIgnoreCase("volunteer")) {
            throw new IllegalArgumentException("User is not authorized to accept tasks. Current role: " + volunteer.getRole());
        }

        // Assign volunteer and update task status
        task.setVolunteer(volunteer);
        task.setStatus(TaskStatus.IN_PROGRESS);
        
        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTaskStatus(Integer taskId, TaskStatus status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
        
        task.setStatus(status);
        return taskRepository.save(task);
    }

    @Transactional
    public Task addRemarks(Integer taskId, String volunteerRemarks, String adminRemarks) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        if (volunteerRemarks != null) {
            task.setVolunteerRemarks(volunteerRemarks);
        }
        if (adminRemarks != null) {
            task.setAdminRemarks(adminRemarks);
        }
        return taskRepository.save(task);
    }
    @Transactional
    public Task addVolunteerRemarks(Integer taskId, String remarks) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));
        
        if (task.getVolunteer() == null) {
            throw new IllegalStateException("Cannot add volunteer remarks - task is not assigned to a volunteer");
        }

        // Append new remarks to existing ones (if any)
        String existingRemarks = task.getVolunteerRemarks();
        LocalDateTime now = LocalDateTime.now();
        String timestampedRemarks = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) + ": " + remarks;
        
        if (existingRemarks != null && !existingRemarks.isEmpty()) {
            task.setVolunteerRemarks(existingRemarks + "\n" + timestampedRemarks);
        } else {
            task.setVolunteerRemarks(timestampedRemarks);
        }

        return taskRepository.save(task);
    }

    @Transactional
    public Task addAdminRemarks(Integer taskId, String remarks) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));

        // Append new remarks to existing ones (if any)
        String existingRemarks = task.getAdminRemarks();
        LocalDateTime now = LocalDateTime.now();
        String timestampedRemarks = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) + ": " + remarks;
        
        if (existingRemarks != null && !existingRemarks.isEmpty()) {
            task.setAdminRemarks(existingRemarks + "\n" + timestampedRemarks);
        } else {
            task.setAdminRemarks(timestampedRemarks);
        }

        return taskRepository.save(task);
    }

    public Map<String, String> getTaskRemarks(Integer taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));

        Map<String, String> remarks = new HashMap<>();
        remarks.put("volunteerRemarks", task.getVolunteerRemarks());
        remarks.put("adminRemarks", task.getAdminRemarks());

        return remarks;
    }

    // Helper method to validate remarks
    private void validateRemarks(String remarks) {
        if (remarks == null || remarks.trim().isEmpty()) {
            throw new IllegalArgumentException("Remarks cannot be empty");
        }
        if (remarks.length() > 1000) {
            throw new IllegalArgumentException("Remarks cannot exceed 1000 characters");
        }
    }


    
    }