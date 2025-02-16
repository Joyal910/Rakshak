package com.marian.project.controller;

import com.marian.project.model.Disaster;
import com.marian.project.service.DisasterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disasters")
public class DisasterController {

    private final DisasterService disasterService;

    // Constructor injection of DisasterService
    public DisasterController(DisasterService disasterService) {
        this.disasterService = disasterService;
    }

    // Create a new disaster
    @PostMapping
    public ResponseEntity<Disaster> createDisaster(@RequestBody Disaster disaster) {
        Disaster createdDisaster = disasterService.createDisaster(disaster);
        return new ResponseEntity<>(createdDisaster, HttpStatus.CREATED);
    }

    // Get all disasters
    @GetMapping
    public ResponseEntity<List<Disaster>> getAllDisasters() {
        List<Disaster> disasters = disasterService.getAllDisasters();
        return new ResponseEntity<>(disasters, HttpStatus.OK);
    }

    // Get a single disaster by ID
    @GetMapping("/{id}")
    public ResponseEntity<Disaster> getDisasterById(@PathVariable Long id) {
        Disaster disaster = disasterService.getDisasterById(id);
        if (disaster != null) {
            return new ResponseEntity<>(disaster, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Update an existing disaster by ID
    @PutMapping("/{id}")
    public ResponseEntity<Disaster> updateDisaster(@PathVariable Long id, @RequestBody Disaster disasterDetails) {
        Disaster updatedDisaster = disasterService.updateDisaster(id, disasterDetails);
        if (updatedDisaster != null) {
            return new ResponseEntity<>(updatedDisaster, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete a disaster by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDisaster(@PathVariable Long id) {
        boolean isDeleted = disasterService.deleteDisaster(id);
        if (isDeleted) {
            return new ResponseEntity<>("Disaster deleted successfully", HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>("Disaster not found", HttpStatus.NOT_FOUND);
    }

    // Get disasters by type
    @GetMapping("/type/{disasterType}")
    public ResponseEntity<List<Disaster>> getDisastersByType(@PathVariable Disaster.DisasterType disasterType) {
        List<Disaster> disasters = disasterService.getDisastersByType(disasterType);
        return new ResponseEntity<>(disasters, HttpStatus.OK);
    }

    // Get disasters by severity
    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<Disaster>> getDisastersBySeverity(@PathVariable Disaster.Severity severity) {
        List<Disaster> disasters = disasterService.getDisastersBySeverity(severity);
        return new ResponseEntity<>(disasters, HttpStatus.OK);
    }

    // Get disasters by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Disaster>> getDisastersByStatus(@PathVariable Disaster.Status status) {
        List<Disaster> disasters = disasterService.getDisastersByStatus(status);
        return new ResponseEntity<>(disasters, HttpStatus.OK);
    }
}
