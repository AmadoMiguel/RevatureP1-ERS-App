package com.ers.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ers.models.Reimbursement;

@Repository
public interface ReimbursementRepository extends JpaRepository<Reimbursement, Integer> {
	Page<Reimbursement> findByStatusId(Pageable reimbPageable, int statusId);
	Page<Reimbursement> findByAuthorId(Pageable reimbPageable, int authorId);
}
