package com.ers.repositories;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ers.models.Reimbursement;

@Repository
public interface ReimbursementRepository extends JpaRepository<Reimbursement, Integer> {
	Page<Reimbursement> findByStatusId(Pageable reimbPageable, int statusId);
	Page<Reimbursement> findByAuthorId(Pageable reimbPageable, int authorId);
	
//	Support filtering reimbursements within certain dates
	
	Page<Reimbursement> findByStatusIdAndDateSubmittedBetween(int statusId, LocalDate dateSubmittedStart, 
			LocalDate dateSubmittedEnd, Pageable reimbPageable);
	Page<Reimbursement> findByAuthorIdAndDateSubmittedBetween(int authorId, LocalDate dateSubmittedStart, 
			LocalDate dateSubmittedEnd, Pageable reimbPageable);
}
