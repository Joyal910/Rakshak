package com.marian.project.repository;

import com.marian.project.model.TaskRequest;
import com.marian.project.model.TaskRequest.RequestStatus;
import com.marian.project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRequestRepository extends JpaRepository<TaskRequest, Integer> {
    // Find task requests by user
    List<TaskRequest> findByUser(User user);

    // Find task requests by status
    List<TaskRequest> findByStatus(TaskRequest.RequestStatus status);
    // Update task request status
    @Modifying
    @Query("UPDATE TaskRequest tr SET tr.status = :status WHERE tr.requestId = :requestId")
    void updateTaskRequestStatus(Integer requestId, RequestStatus status);

	
}