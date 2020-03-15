package com.ers.controllers;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
	
	@GetMapping("/status/{statusId}")
	public Page<Reimbursement> getReimbursementsByStatusId(
			@PathVariable int statusId,
			@RequestParam("page") Optional<Integer> pageNum) {
		
		return this.reimbService.findByStatusId(pageNum, statusId);
	}
	
	@GetMapping("/author/{authorId}")
	public Page<Reimbursement> getReimbursementsByAuthorId(
			@PathVariable int authorId,
			@RequestHeader Optional<String> jwt,
			@RequestParam("page") Optional<Integer> pageNum) {
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
						throw new HttpClientErrorException(HttpStatus.FORBIDDEN,
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
	
	
	@ExceptionHandler
	public ResponseEntity<String> errorHandler(HttpClientErrorException ex) {
		return ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage());
	}

}
