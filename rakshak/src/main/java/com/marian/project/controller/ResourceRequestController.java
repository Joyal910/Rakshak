package com.marian.project.controller;


import com.marian.project.dto.ResourceDTO;
import com.marian.project.dto.ResourceRequestDTO;
import com.marian.project.model.Resource;
import com.marian.project.model.ResourceRequest;
import com.marian.project.service.ResourceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resource-requests")
public class ResourceRequestController {

    @Autowired
    private ResourceRequestService resourceRequestService;

    // Endpoint to create a resource request with JSON input
    @PostMapping("/request")
    public String createResourceRequest(@RequestBody ResourceRequestDTO resourceRequestDTO) {
        return resourceRequestService.createResourceRequest(
                resourceRequestDTO.getUserId(),
                resourceRequestDTO.getResourceId(),
                resourceRequestDTO.getLocation(),
                resourceRequestDTO.getRequestedQuantity()
        );
    }

    @PutMapping("/reject/{requestId}")
    public ResponseEntity<String> rejectResourceRequest(@PathVariable Long requestId) {
        try {
            String result = resourceRequestService.rejectResourceRequest(requestId);
            return ResponseEntity.ok(result); // Return success message
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to reject resource request: " + e.getMessage());
        }
    }

    // Endpoint for admin to accept and allocate the resource request
    @PutMapping("/accept-allocate/{requestId}")
    public String acceptAndAllocateResource(@PathVariable Long requestId) {
        return resourceRequestService.acceptAndAllocateResource(requestId);
    }

    // Endpoint to get the status of a user's resource requests
    @GetMapping("/user/{userId}")
    public List<ResourceRequestDTO> getUserResourceRequests(@PathVariable Long userId) {
        return resourceRequestService.getUserResourceRequests(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Endpoint to get all resource requests (for admin view)
    @GetMapping("/admin")
    public List<ResourceRequestDTO> getAllResourceRequests() {
        return resourceRequestService.getAllResourceRequests().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
 
    // Endpoint to replenish resource quantity (admin functionality)
    @PutMapping("/replenish/{resourceId}")
    public String replenishResourceQuantity(@PathVariable Long resourceId, @RequestBody ResourceRequestDTO resourceRequestDTO) {
        return resourceRequestService.replenishResourceQuantity(resourceId, resourceRequestDTO.getQuantityToAdd());
    }

    // Method to convert ResourceRequest entity to ResourceRequestDTO
    private ResourceRequestDTO convertToDTO(ResourceRequest resourceRequest) {
        ResourceRequestDTO dto = new ResourceRequestDTO();
        dto.setRequestId(resourceRequest.getRequestId());
        dto.setUserName(resourceRequest.getUser().getName());  // assuming User entity is available
        dto.setUserEmail(resourceRequest.getUser().getEmail());  // assuming User entity is available
        dto.setResourceName(resourceRequest.getResource().getName());  // assuming Resource entity is available
        dto.setRequestedQuantity(resourceRequest.getRequestedQuantity());
        dto.setStatus(resourceRequest.getStatus());  // Correctly mapping the status
        dto.setLocation(resourceRequest.getLocation());  // Correctly mapping the location
        return dto;
    }
    
    
    // Endpoint to get all resources
    @GetMapping("/resources")
    public List<ResourceDTO> getAllResources() {
        return resourceRequestService.getAllResources();  // Get all resources from ResourceService
    }

    // Endpoint to add a new resource
    @PostMapping("/resources")
    public String addResource(@RequestBody ResourceDTO resourceDTO) {
        return resourceRequestService.addResource(resourceDTO);  // Add resource using ResourceService
    }

    // Endpoint to delete a resource
    @DeleteMapping("/resources/{resourceId}")
    public String deleteResource(@PathVariable Long resourceId) {
        return resourceRequestService.deleteResource(resourceId);  // Delete resource using ResourceService
    }

    // Helper method to convert ResourceRequest to ResourceRequestDTO
    private ResourceDTO convertToDTO(Resource resource) {
        return new ResourceDTO(
                resource.getResourceId(),
                resource.getName(),
                resource.getType(),
                resource.getAvailableQuantity()
        );
       
    }
}