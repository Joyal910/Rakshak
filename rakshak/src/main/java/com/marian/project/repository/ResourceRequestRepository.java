package com.marian.project.repository;

import com.marian.project.model.ResourceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRequestRepository extends JpaRepository<ResourceRequest, Long> {

    // Find all resource requests by user ID
	List<ResourceRequest> findByUser_UserId(Long userId);

    // Find all resource requests (for admin use)
    List<ResourceRequest> findAll();

	
}
