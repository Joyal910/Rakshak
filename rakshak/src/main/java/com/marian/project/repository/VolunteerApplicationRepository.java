package com.marian.project.repository;

import com.marian.project.model.VolunteerApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VolunteerApplicationRepository extends JpaRepository<VolunteerApplication, Integer> {

    // Find applications by status (e.g., PENDING, APPROVED, REJECTED)
    List<VolunteerApplication> findByStatus(String status);

    // Find applications by user ID
    List<VolunteerApplication> findByUser_UserId(int userId);
}
