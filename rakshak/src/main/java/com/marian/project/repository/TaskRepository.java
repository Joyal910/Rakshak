// TaskRepository.java
package com.marian.project.repository;

import com.marian.project.model.Task;
import com.marian.project.model.Task.TaskStatus;
import com.marian.project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    // Find tasks by volunteer
    List<Task> findByVolunteer(User volunteer);
    
    // Find tasks by status
    List<Task> findByStatus(TaskStatus status);
    
    List<Task> findByVolunteerAndStatus(User volunteer, Task.TaskStatus status);
    
    // Find task by request ID
    Optional<Task> findByTaskRequest_RequestId(Integer requestId);
    
    // Update task status
    @Modifying
    @Query("UPDATE Task t SET t.status = :status WHERE t.taskId = :taskId")
    void updateTaskStatus(Integer taskId, TaskStatus status);
    
    // Check if a task request is already assigned
    boolean existsByTaskRequest_RequestId(Integer requestId);
    
    // Get available tasks for volunteers
    @Query("SELECT t FROM Task t WHERE t.status = 'PENDING' AND t.volunteer IS NULL")
    List<Task> findAvailableTasks();
}