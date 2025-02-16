package com.marian.project.service;

import com.marian.project.model.Disaster;
import com.marian.project.repository.DisasterRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DisasterService {

    private final DisasterRepository disasterRepository;

    // Constructor-based dependency injection (no need for @Autowired since it's the only constructor)
    public DisasterService(DisasterRepository disasterRepository) {
        this.disasterRepository = disasterRepository;
    }

    // Create a new disaster with the reported time set automatically
    public Disaster createDisaster(Disaster disaster) {
        // Disaster will have the 'reportedAt' field automatically set due to @PrePersist in model
        return disasterRepository.save(disaster);
    }

    // Update an existing disaster
    public Disaster updateDisaster(Long disasterId, Disaster disasterDetails) {
        // Find disaster by ID and update its fields
        Optional<Disaster> existingDisaster = disasterRepository.findById(disasterId);
        if (existingDisaster.isPresent()) {
            Disaster disaster = existingDisaster.get();
            disaster.setName(disasterDetails.getName());
            disaster.setDescription(disasterDetails.getDescription());
            disaster.setLocation(disasterDetails.getLocation());
            disaster.setDisasterType(disasterDetails.getDisasterType());
            disaster.setSeverity(disasterDetails.getSeverity());
            disaster.setStatus(disasterDetails.getStatus());
            // Save and return updated disaster
            return disasterRepository.save(disaster);
        }
        return null; // Return null if disaster with given ID doesn't exist
    }

    // Delete a disaster
    public boolean deleteDisaster(Long disasterId) {
        if (disasterRepository.existsById(disasterId)) {
            disasterRepository.deleteById(disasterId);
            return true; // Return true if disaster is successfully deleted
        }
        return false; // Return false if disaster doesn't exist
    }

    // Retrieve all disasters
    public List<Disaster> getAllDisasters() {
        return disasterRepository.findAll(); // Return a list of all disasters
    }

    // Retrieve a disaster by ID
    public Disaster getDisasterById(Long disasterId) {
        return disasterRepository.findById(disasterId).orElse(null); // Return disaster if found, else null
    }

    // Get disasters by type
    public List<Disaster> getDisastersByType(Disaster.DisasterType disasterType) {
        return disasterRepository.findByDisasterType(disasterType); // Find and return disasters by type
    }

    // Get disasters by severity
    public List<Disaster> getDisastersBySeverity(Disaster.Severity severity) {
        return disasterRepository.findBySeverity(severity); // Find and return disasters by severity
    }

    // Get disasters by status
    public List<Disaster> getDisastersByStatus(Disaster.Status status) {
        return disasterRepository.findByStatus(status); // Find and return disasters by status
    }
}
