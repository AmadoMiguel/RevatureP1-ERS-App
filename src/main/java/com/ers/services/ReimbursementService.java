package com.ers.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ers.models.Reimbursement;
import com.ers.repositories.ReimbursementRepository;

@Service
public class ReimbursementService {
	
	@Autowired
	private ReimbursementRepository reimbRepo;
	
	public Page<Reimbursement> findByStatusId(Optional<Integer> pageNum, int statusId) {
		Pageable page = PageRequest.of(pageNum.orElse(0), 5);
		return this.reimbRepo.findByStatusId(page);
	}
	
	public Page<Reimbursement> findByAuthorId(Optional<Integer> pageNum, int authorId) {
		Pageable page = PageRequest.of(pageNum.orElse(0), 5);
		return this.reimbRepo.findByAuthorId(page);
	}
	
}
