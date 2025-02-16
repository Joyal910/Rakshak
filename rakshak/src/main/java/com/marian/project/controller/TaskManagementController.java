package com.marian.project.controller;

import com.marian.project.model.Task;
import com.marian.project.model.Task.TaskStatus;
import com.marian.project.model.TaskRequest;
import com.marian.project.model.TaskRequest.RequestStatus;
import com.marian.project.model.User;
import com.marian.project.repository.UserRepository;
import com.marian.project.service.TaskService;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
public class TaskManagementController {
    @Autowired
    private TaskService taskService;
    private UserRepository userRepository;

    // Task Request Endpoints
    @PostMapping("/api/task-requests")
    public ResponseEntity<TaskRequest> createTaskRequest(@RequestBody TaskRequest taskRequest) {
        TaskRequest createdRequest = taskService.createTaskRequest(taskRequest);
        return ResponseEntity.ok(createdRequest);
    }

    @GetMapping("/api/task-requests")
    public ResponseEntity<List<TaskRequest>> getAllTaskRequests() {
        List<TaskRequest> taskRequests = taskService.getAllTaskRequests();
        return ResponseEntity.ok(taskRequests);
    }

    @GetMapping("/api/task-requests/user/{userId}")
    public ResponseEntity<List<TaskRequest>> getTaskRequestsByUser(@PathVariable Long userId) {
        List<TaskRequest> taskRequests = taskService.getTaskRequestsByUser(userId);
        return ResponseEntity.ok(taskRequests);
    }


    @GetMapping("/api/task-requests/status/{status}")
    public ResponseEntity<List<TaskRequest>> getTaskRequestsByStatus(@PathVariable RequestStatus status) {
        List<TaskRequest> taskRequests = taskService.getTaskRequestsByStatus(status);
        return ResponseEntity.ok(taskRequests);
    }

    @PostMapping("/api/task-requests/{requestId}/approve")
    public ResponseEntity<Task> approveTaskRequest(@PathVariable Integer requestId) {
        Task createdTask = taskService.approveTaskRequest(requestId);
        return ResponseEntity.ok(createdTask);
    }

    @PostMapping("/api/task-requests/{requestId}/reject")
    public ResponseEntity<TaskRequest> rejectTaskRequest(@PathVariable Integer requestId) {
        TaskRequest rejectedRequest = taskService.rejectTaskRequest(requestId);
        return ResponseEntity.ok(rejectedRequest);
    }

    @DeleteMapping("/api/task-requests/{requestId}")
    public ResponseEntity<Void> deleteTaskRequest(@PathVariable Integer requestId) {
        taskService.deleteTaskRequest(requestId);
        return ResponseEntity.noContent().build();
    }

 // Task Endpoints
    @GetMapping("/api/tasks/available")
    public ResponseEntity<List<Task>> getAvailableTasks() {
        List<Task> tasks = taskService.getAvailableTasks();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/api/tasks/volunteer/{volunteerId}")
    public ResponseEntity<List<Task>> getVolunteerTasks(@PathVariable Long volunteerId) {
        List<Task> tasks = taskService.getTasksByVolunteer(volunteerId);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/api/tasks/{taskId}/accept")
    public ResponseEntity<Task> acceptTask(@PathVariable Integer taskId, @RequestParam Long volunteerId) {
        Task acceptedTask = taskService.acceptTask(taskId, volunteerId);
        return ResponseEntity.ok(acceptedTask);
    }

    @PutMapping("/api/tasks/{taskId}/status")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable Integer taskId,
            @RequestParam TaskStatus status) {
        Task updatedTask = taskService.updateTaskStatus(taskId, status);
        return ResponseEntity.ok(updatedTask);
    }

    @PostMapping("/api/tasks/{taskId}/volunteer-remarks")
    public ResponseEntity<Task> addVolunteerRemarks(
            @PathVariable Integer taskId,
            @RequestBody String remarks) {
        Task updatedTask = taskService.addVolunteerRemarks(taskId, remarks);
        return ResponseEntity.ok(updatedTask);
    }

    @PostMapping("/api/tasks/{taskId}/admin-remarks")
    public ResponseEntity<Task> addAdminRemarks(
            @PathVariable Integer taskId,
            @RequestBody String remarks) {
        Task updatedTask = taskService.addAdminRemarks(taskId, remarks);
        return ResponseEntity.ok(updatedTask);
    }

    @GetMapping("/api/tasks/{taskId}/remarks")
    public ResponseEntity<Map<String, String>> getTaskRemarks(@PathVariable Integer taskId) {
        Map<String, String> remarks = taskService.getTaskRemarks(taskId);
        return ResponseEntity.ok(remarks);
    }

    
    

}