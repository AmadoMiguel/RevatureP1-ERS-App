package com.ers.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import com.ers.exceptions.EmailInUseException;
import com.ers.exceptions.UserNotFoundException;
import com.ers.exceptions.UsernameInUseException;
import com.ers.models.UserCredentials;
import com.ers.models.UserInfo;
import com.ers.services.UserService;
import com.ers.util.JWTUtil;

@RestController
@RequestMapping("/ers/users")
public class UserController {
	
	private UserService userService;
	
	@Autowired
	public UserController(UserService userService) {
		this.userService = userService;
	}
	
	@Autowired
	private JWTUtil jwtUtil;
	
//	Send paginated users. Page parameter is optional.
	@GetMapping("/info")
	public Page<UserInfo> requestAllUsers(@RequestParam Optional<Integer> page) {
		return this.userService.getAllUsers(page);
	}
	
	@GetMapping("/info/{id}")
	public UserInfo requestUserInformation(@PathVariable int id) {
		UserInfo foundUser;
		try {
			foundUser = this.userService.getUserById(id);
			return foundUser;
		} catch (UserNotFoundException e) {
			throw new HttpClientErrorException(HttpStatus.NOT_FOUND,
					e.getMessage());
		}
	}
	
	@PostMapping("/login")
	public ResponseEntity<UserDetails> loginUser(@RequestBody UserCredentials userCredentials) {
		UserDetails userInfo = this.userService
				.loadUserByUsername(userCredentials.getUsername());
		if (userInfo == null) {
			throw new HttpClientErrorException(HttpStatus.NOT_FOUND,
					"Username not found.");
		}
		
//		final String jwt = jwtUtil.generateToken(userInfo);
		return ResponseEntity.ok(userInfo);
	}
	
	@PostMapping("/register")
	public HttpEntity<String> registerNewUser(@RequestBody UserInfo newUser) {
		try {
			this.userService.registerUser(newUser);
		} catch (EmailInUseException e) {
			throw new HttpClientErrorException(HttpStatus.BAD_REQUEST,
					e.getMessage());
		} catch (UsernameInUseException e) {
			throw new HttpClientErrorException(HttpStatus.BAD_REQUEST,
					e.getMessage());
		}
		return new HttpEntity<String>(HttpStatus.CREATED.toString());
	}
	
	@PutMapping("/update")
	public HttpEntity<String> updateUserInfo(@RequestBody UserInfo updatedUser) {
		try {
			this.userService.updateUser(updatedUser);
		} catch (UserNotFoundException e) {
			throw new HttpClientErrorException(HttpStatus.NOT_FOUND,
					e.getMessage());
		} catch (EmailInUseException e) {
			throw new HttpClientErrorException(HttpStatus.BAD_REQUEST,
					e.getMessage());
		} catch (UsernameInUseException e) {
			 throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, 
					 e.getMessage());
		}
		return new HttpEntity<String>(HttpStatus.ACCEPTED.toString());
	}
	
	@DeleteMapping("/{id}")
	public HttpEntity<String> removeUser(@PathVariable int id) {
		try {
			this.userService.deleteUser(id);
			return new HttpEntity<String>(HttpStatus.NO_CONTENT.toString());
		} catch(UserNotFoundException e) {
			throw new HttpClientErrorException(HttpStatus.NOT_FOUND,
					e.getMessage());
		}
	}
	
	@ExceptionHandler
	public ResponseEntity<String> errorHandler(HttpClientErrorException ex) {
		return ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage());
	}
}
