package com.marian.project.controller;

import com.marian.project.dto.VolunteerApplicationDTO;
import com.marian.project.model.VolunteerApplication;
import com.marian.project.service.VolunteerApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/volunteer-applications")
public class VolunteerApplicationController {

    @Autowired
    private VolunteerApplicationService volunteerApplicationService;

    // Fetch all volunteer applications
    @GetMapping
    public List<VolunteerApplicationDTO> getAllApplications() {
        return volunteerApplicationService.getAllApplications();
    }

    // Fetch a specific volunteer application by ID
    @GetMapping("/{applicationId}")
    public Optional<VolunteerApplicationDTO> getApplicationById(@PathVariable int applicationId) {
        return volunteerApplicationService.getApplicationById(applicationId);
    }

    // Create a new volunteer application
    @PostMapping
    public VolunteerApplication createApplication(@RequestBody VolunteerApplication application) {
        return volunteerApplicationService.saveApplication(application);
    }

    // Update a volunteer application
    @PutMapping("/{applicationId}")
    public VolunteerApplication updateApplication(
            @PathVariable int applicationId,
            @RequestBody VolunteerApplication application) {
        return volunteerApplicationService.updateApplication(applicationId, application);
    }

    // Delete a volunteer application
    @DeleteMapping("/{applicationId}")
    public String deleteApplication(@PathVariable int applicationId) {
        return volunteerApplicationService.deleteApplication(applicationId);
    }

    // Accept a volunteer application
    @PutMapping("/{applicationId}/accept")
    public String acceptApplication(@PathVariable int applicationId) {
        return volunteerApplicationService.acceptApplication(applicationId);
    }

    // Reject a volunteer application
    @PutMapping("/{applicationId}/reject")
    public String rejectApplication(@PathVariable int applicationId) {
        return volunteerApplicationService.rejectApplication(applicationId);
    }
}
