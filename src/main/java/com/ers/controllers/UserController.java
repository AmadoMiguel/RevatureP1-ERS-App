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
	
//	Send paginated users
	@GetMapping("/info")
	public Page<UserInfo> requestAllUsers(
			@RequestParam("page") Optional<Integer> page,
			@RequestParam("sortOrders") Optional<String[]> sortOrders,
//			Filter options for searching users
			@RequestParam("firstName") Optional<String> firstNameLike,
			@RequestParam("lastName") Optional<String> lastNameLike,
			@RequestParam("email") Optional<String> emailLike,
			@RequestParam("username") Optional<String> usernameLike) {
		return this.userService.getAllUsers(page, sortOrders, firstNameLike, lastNameLike, emailLike, usernameLike);
	}
	
	@GetMapping("/id/{id}")
	public UserInfo requestUserInformation(@PathVariable int id,
			@RequestHeader("Authorization") Optional<String> jwt) {
//		Check that current user asks for his/her info. Other users info is not visible
//		to current user, except for administrators.
		if (jwt.isPresent()) {
			String username = this.jwtUtil.extractUsername(jwt.get());
			String role = this.jwtUtil.extractRole(jwt.get());
			Optional<UserInfo> currUser = this.userService.findUserByUsername(username);
			if (currUser.isPresent()) {
//				Check if IDs match or if current user is admin
				if (currUser.get().getId() == id) {
						return currUser.get();
				} else if (role.equals("admin")) {
					try {
						return this.userService.getUserById(id);
					} catch (UserNotFoundException e) {
						throw new HttpClientErrorException(HttpStatus.NOT_FOUND, 
								e.getMessage());
					}
				} else throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED, "Unauthorized.");
			} else throw new HttpClientErrorException(HttpStatus.NOT_FOUND, "Current User not found in the system");
		} else throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Please include authorization header");
	}
	
	@GetMapping("/username/{username}")
	public UserInfo findUserByUsername(@PathVariable String username,
			@RequestHeader("Authorization") Optional<String> jwt) {
		if (jwt.isPresent()) {
			String requester = this.jwtUtil.extractUsername(jwt.get());
			if (requester.equals(username)) {
				Optional<UserInfo> possibleUser = this.userService.findUserByUsername(username);
				if (possibleUser.isPresent())
					return possibleUser.get();
				throw new HttpClientErrorException(HttpStatus.NOT_FOUND, "Username not found in the system");
			}
			throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED, "Not authorized to this information");
		}
		throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Please include authorization header");
	}
	
	@PostMapping("/login/username/{username}")
	public ResponseEntity<ClientInfo> loginUser(@PathVariable String username) {
		UserDetails userInfo = this.userService.loadUserByUsername(username);
		if (userInfo == null) {
			throw new HttpClientErrorException(HttpStatus.NOT_FOUND,
					"Username not found");
		}
		ArrayList<String> authorities = new ArrayList<String>();
		for (GrantedAuthority auth : userInfo.getAuthorities()) {
			authorities.add(auth.getAuthority());
		}
		final String jwt = jwtUtil.generateToken(userInfo);
		ClientInfo info = new ClientInfo(userInfo.getUsername(), authorities.get(0), jwt);
		return ResponseEntity.ok(info);
	}
	
	@PostMapping("/login/password/{password}")
	public ResponseEntity<String> loginPassword(@PathVariable String password,
			@RequestHeader("Authorization") Optional<String> jwt) {
		if (jwt.isPresent()) {
			String username = this.jwtUtil.extractUsername(jwt.get());
			UserDetails userInfo = this.userService.loadUserByUsername(username);
			if (userInfo == null)
				throw new HttpClientErrorException(HttpStatus.NOT_FOUND,
						"Authentication user not found");
			if (this.passEncoder.matches(password, userInfo.getPassword()))
				return new ResponseEntity<String>("Accepted", HttpStatus.ACCEPTED);
			throw new HttpClientErrorException(HttpStatus.BAD_REQUEST,
					"Incorrect password");
		}
		throw new HttpClientErrorException(HttpStatus.BAD_REQUEST,
				"Please include Authorization header");
	}
	
	@PostMapping("/register")
	public HttpEntity<String> registerNewUser(@RequestBody UserInfo newUser) {
		try {
//			Hash password before storing user
			newUser.setPassword(passEncoder.encode(newUser.getPassword()));
			this.userService.registerUser(newUser);
		} catch (EmailInUseException e1) {
			throw new HttpClientErrorException(HttpStatus.BAD_REQUEST,
					e1.getMessage());
		} catch (UsernameInUseException e2) {
			throw new HttpClientErrorException(HttpStatus.BAD_REQUEST,
					e2.getMessage());
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
			@RequestHeader("Authorization") Optional<String> jwt) {
		if (jwt.isPresent()) {
			String username = this.jwtUtil.extractUsername(jwt.get());
			Optional<UserInfo> currentUser = this.userService.findUserByUsername(username);
			if (currentUser.isPresent()) {
//				Check passwords
				if (!passEncoder.matches(passwords.getOldPassword(), currentUser.get().getPassword())) {
					throw new HttpClientErrorException(HttpStatus.BAD_REQUEST,
							"Incorrect password provided");
				}
//				Hash new password and save user
				UserInfo updatedUser = currentUser.get();
				updatedUser.setPassword(passEncoder.encode(passwords.getNewPassword()));
				this.userService.updatePassword(updatedUser);
				return new HttpEntity<String>(HttpStatus.ACCEPTED.toString());
			} else {
				throw new HttpClientErrorException(HttpStatus.NOT_FOUND,
						"Username not found.");
			}
		}
		throw new HttpClientErrorException(HttpStatus.BAD_REQUEST,
				"Please include Authentication header");
	}
	
	@DeleteMapping("/{id}")
	public HttpEntity<String> removeUser(
			@PathVariable int id,
			@RequestHeader String jwt) {
		try {
//			Only current user can delete her/his account
			String username = this.jwtUtil.extractUsername(jwt);
			Optional<UserInfo> currentUser = this.userService.findUserByUsername(username);
			if (currentUser.isPresent()) {
				if (currentUser.get().getId() == id) {
					this.userService.deleteUser(id);
					return new HttpEntity<String>(HttpStatus.NO_CONTENT.toString());
				} else {
					throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED,
							"Can't delete other user's account.");
				}
			} else {
				throw new HttpClientErrorException(HttpStatus.NOT_FOUND,
						"Username not found.");
			}
		} catch(UserNotFoundException e) {
			throw new HttpClientErrorException(HttpStatus.NOT_FOUND,
					e.getMessage());
		}
	}
	
//	Controller-level exception handler
	@ExceptionHandler
	public ResponseEntity<String> errorHandler(HttpClientErrorException ex) {
		return new ResponseEntity<String>(ex.getMessage(), ex.getStatusCode());
	}
}
