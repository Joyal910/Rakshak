package com.marian.project.service;

import com.marian.project.model.ResourceRequest;
import com.marian.project.model.User;
import com.marian.project.dto.ResourceDTO;
import com.marian.project.model.Resource;
import com.marian.project.repository.ResourceRequestRepository;
import com.marian.project.repository.UserRepository;
import com.marian.project.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResourceRequestService {

    @Autowired
    private ResourceRequestRepository resourceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private NotificationService notificationService;

    // Method to create a resource request
    public String createResourceRequest(Long userId, Long resourceId, String location, int requestedQuantity) {

        // Fetch the user and resource based on IDs
        User user = userRepository.findByUserId(userId).orElse(null);
        Resource resource = resourceRepository.findById(resourceId).orElse(null);

        if (user == null || resource == null) {
            return "User or Resource not found!";
        }

        // Create a new ResourceRequest and set its properties
        ResourceRequest resourceRequest = new ResourceRequest();
        resourceRequest.setUser(user);
        resourceRequest.setResource(resource);
        resourceRequest.setLocation(location);  // Set location from the frontend
        resourceRequest.setStatus("PENDING");
        resourceRequest.setRequestDate(LocalDateTime.now());
        resourceRequest.setRequestedQuantity(requestedQuantity);  // Set the requested quantity

        // Save the request to the database
        resourceRequestRepository.save(resourceRequest);

      

        return "Resource Request created successfully!";
    }

    // Method to accept and allocate the resource request in one go
    public String acceptAndAllocateResource(Long requestId) {

        // Fetch the resource request based on ID
        ResourceRequest resourceRequest = resourceRequestRepository.findById(requestId).orElse(null);

        if (resourceRequest == null) {
            return "Request not found!";
        }

        // Check if the resource is available in the required quantity
        Resource resource = resourceRequest.getResource();
        int requestedQuantity = resourceRequest.getRequestedQuantity();  // Corrected this line
        if (resource.getAvailableQuantity() < requestedQuantity) {
            return "Insufficient resource quantity available for allocation!";
        }

        // Accept the request (change status to ACCEPTED)
        resourceRequest.setStatus("ACCEPTED");
        resourceRequestRepository.save(resourceRequest);

        // Allocate the resource by updating its available quantity
        resource.setAvailableQuantity(resource.getAvailableQuantity() - requestedQuantity);  // Corrected this line
        resourceRepository.save(resource);

        // Update the resource request status to ALLOCATED
        resourceRequest.setStatus("ALLOCATED");
        resourceRequestRepository.save(resourceRequest);

        // Notify the user that their resource request has been accepted and allocated
       

        return "Resource request accepted and allocated!";
    }

    public String rejectResourceRequest(Long requestId) {
        // Fetch the resource request based on ID
        ResourceRequest resourceRequest = resourceRequestRepository.findById(requestId).orElse(null);

        if (resourceRequest == null) {
            return "Resource request not found!";
        }

        // Update the status to "REJECTED"
        resourceRequest.setStatus("REJECTED");
        resourceRequestRepository.save(resourceRequest);

        // Notify the user about the rejection (optional)
       
        return "Resource request rejected successfully!";
    }
    
    // Method to get all resource requests made by a user
    public List<ResourceRequest> getUserResourceRequests(Long userId) {
        List<ResourceRequest> requests = resourceRequestRepository.findByUser_UserId(userId);
        
        // Return an empty list if no requests are found
        if (requests.isEmpty()) {
            return Collections.emptyList();  // You can also return null if you prefer
        }
        
        return requests;
    }

    // Method to get all resource requests (for admin view)
    public List<ResourceRequest> getAllResourceRequests() {
        return resourceRequestRepository.findAll(); // Fetch all resource requests for admin
    }

    // Method to replenish the resource quantity (admin functionality)
    public String replenishResourceQuantity(Long resourceId, int quantityToAdd) {

        // Fetch the resource based on the ID
        Resource resource = resourceRepository.findById(resourceId).orElse(null);

        if (resource == null) {
            return "Resource not found!";
        }

        // Replenish the resource quantity
        resource.setAvailableQuantity(resource.getAvailableQuantity() + quantityToAdd);  // Corrected this line

        // Save the updated resource
        resourceRepository.save(resource);

        return "Resource quantity replenished successfully!";
    }
    
    public List<ResourceDTO> getAllResources() {
        return resourceRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Method to add a new resource
    public String addResource(ResourceDTO resourceDTO) {
        Resource resource = new Resource();
        resource.setName(resourceDTO.getName());
        resource.setType(resourceDTO.getType());
        resource.setAvailableQuantity(resourceDTO.getAvailableQuantity());
        resourceRepository.save(resource);  // Save the new resource to the database
        return "Resource added successfully!";  // Return success message
    }

    // Method to delete a resource
    public String deleteResource(Long resourceId) {
        Optional<Resource> resource = resourceRepository.findById(resourceId);
        if (resource.isPresent()) {
            resourceRepository.delete(resource.get());
            return "Resource deleted successfully!";
        } else {
            return "Resource not found!";
        }
    }

    // Helper method to convert Resource to ResourceDTO
    private ResourceDTO convertToDTO(Resource resource) {
        return new ResourceDTO(
                resource.getResourceId(),
                resource.getName(),
                resource.getType(),
                resource.getAvailableQuantity()
        );
    }
}
