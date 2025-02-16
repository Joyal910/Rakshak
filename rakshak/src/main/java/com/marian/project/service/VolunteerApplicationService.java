package com.marian.project.service;

import com.marian.project.dto.VolunteerApplicationDTO;
import com.marian.project.model.User;
import com.marian.project.model.VolunteerApplication;
import com.marian.project.repository.UserRepository;
import com.marian.project.repository.VolunteerApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VolunteerApplicationService {

    @Autowired
    private VolunteerApplicationRepository volunteerApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    // Fetch all volunteer applications and map to DTO
    public List<VolunteerApplicationDTO> getAllApplications() {
        return volunteerApplicationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Fetch a specific volunteer application by ID and map to DTO
    public Optional<VolunteerApplicationDTO> getApplicationById(int applicationId) {
        return volunteerApplicationRepository.findById(applicationId).map(this::convertToDTO);
    }

    // Create a new volunteer application
    public VolunteerApplication saveApplication(VolunteerApplication application) {
        Optional<User> optionalUser = userRepository.findById(application.getUser().getUserId());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            application.setUser(user); // Set the valid User object before saving
            return volunteerApplicationRepository.save(application);
        }
        return null; // Handle the case where the user is not found
    }

    // Update an existing volunteer application
    public VolunteerApplication updateApplication(int applicationId, VolunteerApplication application) {
        Optional<VolunteerApplication> existingApplication = volunteerApplicationRepository.findById(applicationId);
        if (existingApplication.isPresent()) {
            application.setApplicationId(applicationId); // Preserve application ID
            return volunteerApplicationRepository.save(application);
        }
        return null; // or throw an exception
    }

    // Delete a volunteer application
    public String deleteApplication(int applicationId) {
        if (volunteerApplicationRepository.existsById(applicationId)) {
            volunteerApplicationRepository.deleteById(applicationId);
            return "Volunteer application with ID " + applicationId + " was deleted successfully.";
        } else {
            return "Volunteer application not found!";
        }
    }

    // Accept a volunteer application
    public String acceptApplication(int applicationId) {
        Optional<VolunteerApplication> optionalApplication = volunteerApplicationRepository.findById(applicationId);
        if (optionalApplication.isPresent()) {
            VolunteerApplication application = optionalApplication.get();
            application.setStatus(VolunteerApplication.ApplicationStatus.APPROVED); // Update status to Approved
            volunteerApplicationRepository.save(application);

            // Update the user's role to Volunteer
            Optional<User> optionalUser = userRepository.findById(application.getUser().getUserId());
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                user.setRole("Volunteer");
                userRepository.save(user); // Save updated user
                return "Application approved, and user role updated to Volunteer.";
            }
            return "Application approved, but user not found!";
        }
        return "Application not found!";
    }

    // Reject a volunteer application
    public String rejectApplication(int applicationId) {
        Optional<VolunteerApplication> optionalApplication = volunteerApplicationRepository.findById(applicationId);
        if (optionalApplication.isPresent()) {
            VolunteerApplication application = optionalApplication.get();
            application.setStatus(VolunteerApplication.ApplicationStatus.REJECTED); // Update status to Rejected
            volunteerApplicationRepository.save(application);
            return "Application rejected successfully.";
        }
        return "Application not found!";
    }

    // Helper method to convert VolunteerApplication to DTO
    private VolunteerApplicationDTO convertToDTO(VolunteerApplication application) {
        VolunteerApplicationDTO dto = new VolunteerApplicationDTO();
        dto.setApplicationId(application.getApplicationId());
        dto.setDescription(application.getDescription());
        dto.setStatus(application.getStatus().name());

        User user = application.getUser();
        if (user != null) {
            dto.setUsername(user.getName());
            dto.setEmail(user.getEmail());
            dto.setPhoneNumber(user.getPhoneNumber());
            dto.setLocation(user.getLocation());
        }

        return dto;
    }
}
