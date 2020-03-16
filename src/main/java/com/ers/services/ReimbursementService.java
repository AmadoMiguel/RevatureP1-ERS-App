package com.ers.services;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ers.exceptions.ReimbursementNotFoundException;
import com.ers.models.Reimbursement;
import com.ers.repositories.ReimbursementRepository;

@Service
public class ReimbursementService {
	
	@Autowired
	private ReimbursementRepository reimbRepo;
	
	public Optional<Reimbursement> findById(int id) {
		Optional<Reimbursement> foundReimb = this.reimbRepo.findById(id);
		return foundReimb;
	}
	
	public Page<Reimbursement> findByStatusId(Optional<Integer> pageNum, int statusId) {
		Pageable page = PageRequest.of(pageNum.orElse(0), 5);
		return this.reimbRepo.findByStatusId(page, statusId);
	}
	
	private int[] parseDate(String date) throws Exception {
		int dateInfo[] = new int[3];
		String[] toConvert = date.split("-");
		if (toConvert.length != 3) throw new Exception("Malformed date");
		int index = 0;
		for (String s: toConvert) {
			dateInfo[index++] = Integer.valueOf(s);
		}
		return dateInfo;
	}
	
	public Page<Reimbursement> findByStatusIdAndDateSubmitted(Optional<Integer> pageNum,
			int statusId, String startDate, String endDate) throws Exception {
		Pageable page = PageRequest.of(pageNum.orElse(0), 5);
		int[] startDateInfo = parseDate(startDate);
		int[] endDateInfo = parseDate(endDate);
		LocalDate from = LocalDate.of(startDateInfo[0], startDateInfo[1], startDateInfo[2]);
		LocalDate to = LocalDate.of(endDateInfo[0], endDateInfo[1], endDateInfo[2]);
		return this.reimbRepo.findByStatusIdAndDateSubmittedBetween(statusId, from, to, page);
	}
	
	public Page<Reimbursement> findByAuthorId(Optional<Integer> pageNum, int authorId) {
		Pageable page = PageRequest.of(pageNum.orElse(0), 5);
		return this.reimbRepo.findByAuthorId(page, authorId);
	}
	
	public void saveReimbursement(Reimbursement reimb) {
		this.reimbRepo.save(reimb);
	}
	
	public void updateReimbursement(Reimbursement reimb) throws ReimbursementNotFoundException {
		Optional<Reimbursement> currReimb = this.reimbRepo.findById(reimb.getId());
		if (currReimb.isPresent()) {
			Reimbursement updateReimbursement = currReimb.get();
//			Update fields related to reimbursement resolution
			if (reimb.getDateResolved() != null) {
				updateReimbursement.setDateResolved(reimb.getDateResolved());
			}
			if (reimb.getResolver() != null) {
				updateReimbursement.setResolver(reimb.getResolver());
			}
			if (reimb.getStatus() != null) {
				updateReimbursement.setStatus(reimb.getStatus());
			}
			this.reimbRepo.save(updateReimbursement);
		}
		else
			throw new ReimbursementNotFoundException("Didn't find reimbursement");
	}
	
}
