package com.ers.services;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ers.exceptions.ReimbursementNotFoundException;
import com.ers.models.Reimbursement;
import com.ers.repositories.ReimbursementRepository;

@Service
public class ReimbursementService {
	
	@Autowired
	private ReimbursementRepository reimbRepo;
	
	private int[] parseDate(String date) throws DateTimeException {
		int dateInfo[] = new int[3];
		String[] toConvert = date.split("-");
		if (toConvert.length != 3) throw new DateTimeException("Malformed date");
		int index = 0;
		for (String s: toConvert) {
			dateInfo[index++] = Integer.valueOf(s);
		}
		return dateInfo;
	}
	
	public Optional<Reimbursement> findById(int id) {
		Optional<Reimbursement> foundReimb = this.reimbRepo.findById(id);
		return foundReimb;
	}
	
	public Page<Reimbursement> findByStatusId(Optional<Integer> pageNum, int statusId,
			Optional<String> startDate, Optional<String> endDate, Optional<String[]> sortBy) throws DateTimeException {
		Pageable page = PageRequest.of(pageNum.orElse(0), 5, Sort.by(sortBy.orElse(new String[] {"id"})));
		if (startDate.isPresent() && endDate.isPresent()) {
			int[] startDateInfo = parseDate(startDate.get());
			int[] endDateInfo = parseDate(endDate.get());
			LocalDate from = LocalDate.of(startDateInfo[0], startDateInfo[1], startDateInfo[2]);
			LocalDate to = LocalDate.of(endDateInfo[0], endDateInfo[1], endDateInfo[2]);
			return this.reimbRepo.findByStatusIdAndDateSubmittedBetween(statusId, from, to, page);
		}
		return this.reimbRepo.findByStatusId(page, statusId);
	}
	
	public Page<Reimbursement> findByAuthorId(Optional<Integer> pageNum, int statusId,
			Optional<String> startDate, Optional<String> endDate, Optional<String[]> sortBy) throws DateTimeException {
		Pageable page = PageRequest.of(pageNum.orElse(0), 5, Sort.by(sortBy.orElse(new String[] {"id"})));
		if (startDate.isPresent() && endDate.isPresent()) {
			int[] startDateInfo = parseDate(startDate.get());
			int[] endDateInfo = parseDate(endDate.get());
			LocalDate from = LocalDate.of(startDateInfo[0], startDateInfo[1], startDateInfo[2]);
			LocalDate to = LocalDate.of(endDateInfo[0], endDateInfo[1], endDateInfo[2]);
			return this.reimbRepo.findByAuthorIdAndDateSubmittedBetween(statusId, from, to, page);
		}
		return this.reimbRepo.findByAuthorId(page, statusId);
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
