package com.marian.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marian.project.model.Disaster;
import com.marian.project.model.Disaster.DisasterType;
import com.marian.project.model.Disaster.Severity;
import com.marian.project.model.Disaster.Status;

@Repository
public interface DisasterRepository extends JpaRepository<Disaster, Long> {

	List<Disaster> findAll();
	List<Disaster> findByDisasterType(DisasterType disasterType);
	List<Disaster> findBySeverity(Severity severity);
	List<Disaster> findByStatus(Status status);

}
