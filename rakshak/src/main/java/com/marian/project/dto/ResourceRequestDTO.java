package com.marian.project.dto;

public class ResourceRequestDTO {
    private Long requestId;
    private Long userId;  // Store the user ID
    private Long resourceId;  // Store the resource ID
    private String userName;  // Name of the user (to be populated from User entity)
    private String userEmail; // Email of the user (to be populated from User entity)
    private String resourceName;  // Name of the resource (to be populated from Resource entity)
    private int requestedQuantity;  // Quantity requested by the user
    private String status;  // Status of the resource request
    private String location; 
    private int quantityToAdd;// Location of the resource request

    // Default constructor
    public ResourceRequestDTO() {
    }

    // Constructor for creating DTO from request ID, resource name, and other details
    public ResourceRequestDTO(Long requestId, String userName, String userEmail, String resourceName, int requestedQuantity, String status, String location) {
        this.requestId = requestId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.resourceName = resourceName;
        this.requestedQuantity = requestedQuantity;
        this.status = status;
        this.location = location;
    }

    // Constructor for creating DTO with user and resource IDs
    public ResourceRequestDTO(Long userId, Long resourceId, int requestedQuantity, String location) {
        this.userId = userId;
        this.resourceId = resourceId;
        this.requestedQuantity = requestedQuantity;
        this.location = location;
    }

    // Getters and Setters
    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public int getRequestedQuantity() {
        return requestedQuantity;
    }

    public void setRequestedQuantity(int requestedQuantity) {
        this.requestedQuantity = requestedQuantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

	public int getQuantityToAdd() {
		return quantityToAdd;
	}

	public void setQuantityToAdd(int quantityToAdd) {
		this.quantityToAdd = quantityToAdd;
	}
}
