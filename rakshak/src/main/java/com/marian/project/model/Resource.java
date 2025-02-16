package com.marian.project.model;
	import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

	@Entity
	public class Resource {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long resourceId;

	    private String name;  // Name of the resource
	    private String type;  // Type of resource (e.g., equipment, vehicle, etc.)
	    private Integer availableQuantity;  // Available quantity of the resource

	    @OneToMany(mappedBy = "resource")
	    private List<ResourceRequest> resourceRequests;

	    public Resource() {
	        // Default constructor
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


	    public List<ResourceRequest> getResourceRequests() {
	        return resourceRequests;
	    }

	    public void setResourceRequests(List<ResourceRequest> resourceRequests) {
	        this.resourceRequests = resourceRequests;
	    }

		public Integer getAvailableQuantity() {
			return availableQuantity;
		}

		public void setAvailableQuantity(Integer availableQuantity) {
			this.availableQuantity = availableQuantity;
		}
	}


