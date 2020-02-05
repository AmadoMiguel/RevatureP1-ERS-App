package com.ers.controllers;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import com.ers.exceptions.EmailInUseException;
import com.ers.exceptions.UserNotFoundException;
import com.ers.exceptions.UsernameInUseException;
import com.ers.models.ClientInfo;
import com.ers.models.PassEncoder;
import com.ers.models.UserCredentials;
import com.ers.models.UserInfo;
import com.ers.models.UserPasswords;
import com.ers.services.UserService;
import com.ers.util.JWTUtil;

import io.jsonwebtoken.Claims;

@RestController
@RequestMapping("/ers/users")
public class UserController {
	
	private UserService userService;
	
	@Autowired
	public UserController(UserService userService) {
		this.userService = userService;
	}
	
	@Autowired
	private PassEncoder passEncoder;
	
	@Autowired
	private JWTUtil jwtUtil;
	
//	Send paginated users. Page parameter is optional.
	@GetMapping("/info")
	public Page<UserInfo> requestAllUsers(
			@RequestParam Optional<Integer> page,
//			Filter options for searching users
			@RequestParam Optional<String> firstNameLike,
			@RequestParam Optional<Integer> lastNameLike,
			@RequestParam Optional<Integer> usernameLike) {
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
	public ResponseEntity<ClientInfo> loginUser(@RequestBody UserCredentials userCredentials) {
		UserDetails userInfo = this.userService
				.loadUserByUsername(userCredentials.getUsername());
		if (userInfo == null) {
			throw new HttpClientErrorException(HttpStatus.NOT_FOUND,
					"Username not found.");
		}
		if (! passEncoder.matches(userCredentials.getPassword(), userInfo.getPassword())) {
			throw new HttpClientErrorException(HttpStatus.BAD_REQUEST,
					"Incorrect Password.");
		}
		ArrayList<String> authorities = new ArrayList<String>();
		for (GrantedAuthority auth : userInfo.getAuthorities()) {
			authorities.add(auth.getAuthority());
		}
		final String jwt = jwtUtil.generateToken(userInfo);
		ClientInfo info = new ClientInfo(userInfo.getUsername(), authorities.get(0), jwt);
		return ResponseEntity.ok(info);
	}
	
	@PostMapping("/register")
	public HttpEntity<String> registerNewUser(@RequestBody UserInfo newUser) {
		try {
//			Hash password before storing user
			newUser.setPassword(passEncoder.encode(newUser.getPassword()));
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
	
//	Only current user can change its own password. But has to provide previous password
//	before updating it.
	@PatchMapping("/update/password")
	public HttpEntity<String> changePassword(@RequestBody UserPasswords passwords,
			@RequestHeader("Authorization") String jwt) {
		String username = this.jwtUtil.extractUsername(jwt);
		Optional<UserInfo> currentUser = this.userService.findUserByUsername(username);
		if (currentUser.isPresent()) {
//			Check passwords
			if (!passEncoder.matches(passwords.getOldPassword(), currentUser.get().getPassword())) {
				throw new HttpClientErrorException(HttpStatus.BAD_REQUEST,
						"Incorrect password provided.");
			}
//			Hash new password and save user
			UserInfo updatedUser = currentUser.get();
			updatedUser.setPassword(passEncoder.encode(updatedUser.getPassword()));
			this.userService.updatePassword(updatedUser);
			return new HttpEntity<String>(HttpStatus.ACCEPTED.toString());
		} else {
			throw new HttpClientErrorException(HttpStatus.NOT_FOUND,
					"Username not found.");
		}
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
