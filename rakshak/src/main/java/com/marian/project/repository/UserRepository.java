package com.marian.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marian.project.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
	
	// Custom query method to find a user by email
	Optional<User> findByEmail(String email);

    // Correct method to find a user by userId
    Optional<User> findByUserId(Long userId); // Assuming 'userId' is the correct field in User entity
}
