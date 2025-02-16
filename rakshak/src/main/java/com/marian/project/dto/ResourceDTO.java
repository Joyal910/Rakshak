package com.marian.project.dto;

public class ResourceDTO {

    private Long resourceId;         // Resource ID
    private String name;             // Resource Name
    private String type;             // Resource Type (e.g., equipment, vehicle, etc.)
    private Integer availableQuantity; // Available Quantity of the resource

    // Default constructor
    public ResourceDTO() {}

    // Constructor for ResourceDTO
    public ResourceDTO(Long resourceId, String name, String type, Integer availableQuantity) {
        this.resourceId = resourceId;
        this.name = name;
        this.type = type;
        this.availableQuantity = availableQuantity;
    }

    // Getters and Setters
    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }
}
