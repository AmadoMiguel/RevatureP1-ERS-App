package com.ers.controllers;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import com.ers.models.Reimbursement;
import com.ers.models.UserInfo;
import com.ers.services.ReimbursementService;
import com.ers.services.UserService;
import com.ers.util.JWTUtil;

@RestController
@RequestMapping("/ers/reimbursements")
public class ReimbursementController {
	
	private ReimbursementService reimbService;
	private UserService userService;
	
	@Autowired
	public ReimbursementController(ReimbursementService reimbService, UserService userService) {
		this.reimbService = reimbService;
		this.userService = userService;
	}
	
	@Autowired
	private JWTUtil jwtUtil;
	
//	TODO: Add request parameters in both get statements in order to be able
//	to search reimbursements within a date range
	
	@GetMapping("/status/{statusId}")
	public Page<Reimbursement> getReimbursementsByStatusId(
			@PathVariable int statusId,
			@RequestParam("page") Optional<Integer> pageNum,
			@RequestParam("startDate") Optional<LocalDate> from,
			@RequestParam("endDate") Optional<LocalDate> to) {
		
		return this.reimbService.findByStatusId(pageNum, statusId);
	}
	
	@GetMapping("/author/{authorId}")
	public Page<Reimbursement> getReimbursementsByAuthorId(
			@PathVariable int authorId,
			@RequestHeader("Authorization") Optional<String> jwt,
			@RequestParam("page") Optional<Integer> pageNum,
			@RequestParam("startDate") Optional<LocalDate> from,
			@RequestParam("endDate") Optional<LocalDate> to) {
		if (jwt.isPresent()) {
			String jwtContent = jwt.get();
			String username = this.jwtUtil.extractUsername(jwtContent);
			Optional<UserInfo> currUser = this.userService.findUserByUsername(username);
			if (currUser.isPresent()) {
//				1st possible access: Current user is requesting her/his reimbursements
//				information
				if (currUser.get().getId() == authorId) {
					return this.reimbService.findByAuthorId(pageNum, authorId);
				} else {
//					2nd possible access: Current user has finance role
					ArrayList<String> roles = this.jwtUtil.extractRoles(jwtContent);
					if (roles.get(0).equals("finance")) {
						return  this.reimbService.findByAuthorId(pageNum, authorId);
					} else {
						throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED,
								"Unauthorized.");
					}
				}
			} else {
				throw new HttpClientErrorException(HttpStatus.NOT_FOUND,
						"Username not found.");
			}
		} else {
			throw new HttpClientErrorException(HttpStatus.BAD_REQUEST,
					"Please login first.");
		}
	}
	
	@SuppressWarnings("unlikely-arg-type")
	@PostMapping("/create")
	public HttpEntity<String> createReimbursement(
			@RequestBody Reimbursement reimbursement,
			@RequestHeader("Authorization") Optional<String> jwt) {
		if (jwt.isPresent()) {
			String username = this.jwtUtil.extractUsername(jwt.get());
			Optional<UserInfo> currUser = this.userService.findUserByUsername(username);
			if (currUser.isPresent()) {
//				Reimbursement author should match current user
				if (currUser.get().getUsername().equals(reimbursement.getAuthor().getUsername()))
						this.reimbService.saveReimbursement(reimbursement);
				else
					throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED,
							"Cannot complete without proper authorization");
				return new HttpEntity<String>(HttpStatus.ACCEPTED.toString());
			} else {
				throw new HttpClientErrorException(HttpStatus.NOT_FOUND,
						"Username not found");
			}
		} else {
			throw new HttpClientErrorException(HttpStatus.BAD_REQUEST,
					"Authorization header not present");
		}
	}
	
	@PatchMapping
	public HttpEntity<String> updateReimbursement(@RequestBody Reimbursement reimb) {
		Optional<Reimbursement> foundReimb = this.reimbService.findById(reimb.getId());
		if (foundReimb.isPresent()) {
			this.reimbService.saveReimbursement(foundReimb.get());
			return new HttpEntity<String>(HttpStatus.ACCEPTED.toString());
		}
		throw new HttpClientErrorException(HttpStatus.NOT_FOUND, "Reimbursement not found");
	}
	
	@ExceptionHandler
	public ResponseEntity<String> errorHandler(HttpClientErrorException ex) {
		return ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage());
	}

}
