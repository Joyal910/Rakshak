package com.marian.project.repository;

import com.marian.project.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    // Find a resource by its ID
    Optional<Resource> findById(Long resourceId);

    // You can add other methods for custom queries if needed
}
