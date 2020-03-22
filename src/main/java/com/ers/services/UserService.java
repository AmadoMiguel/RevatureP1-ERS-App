package com.ers.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.ers.exceptions.EmailInUseException;
import com.ers.exceptions.UserNotFoundException;
import com.ers.exceptions.UsernameInUseException;
import com.ers.models.UserInfo;
import com.ers.repositories.UserRepository;

@Service
public class UserService implements UserDetailsService {
	private UserRepository userRepository;
	
	@Autowired
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
//	Send paginated users information. Default value of 5 users per page.
//	Default page value: 5.
//	Users can be retrieved with/without filters on their properties
	public Page<UserInfo> getAllUsers(
			Optional<Integer> page,
			Optional<String[]> sortOrders,
			Optional<String> firstNameLike,
			Optional<String> lastNameLike,
			Optional<String> emailLike,
			Optional<String> usernameLike) {
		Pageable pageable = PageRequest.of(page.orElse(0), 5, Sort.by(sortOrders.orElse(new String[]{"id"})));
//		Handle each filtering option to call specific query. For now, the only combined parameters to
//		filter at the same time will be first name and last name
		if (firstNameLike.isPresent() && lastNameLike.isPresent())
			return this.userRepository.usersWithFirstNameAndLastNameLike(
					firstNameLike.get(), lastNameLike.get(), pageable);
		if (firstNameLike.isPresent())
			return this.userRepository.usersWithFirstNameLike(firstNameLike.get(), pageable);
		if (lastNameLike.isPresent())
			return this.userRepository.usersWithLastNameLike(lastNameLike.get(), pageable);
		if (emailLike.isPresent())
			return this.userRepository.usersWithEmailLike(emailLike.get(), pageable);
		if (usernameLike.isPresent())
			return this.userRepository.usersWithUsernameLike(usernameLike.get(), pageable);
		
//		Default query without filtering applied
		return this.userRepository.findAll(pageable);
	}
	
//	Get user details for authentication. This method is called by the security configure class
//	class
	@Override
	public UserDetails loadUserByUsername(String username) {
		Optional<UserInfo> foundUser = this.userRepository.findByUsername(username);
		if (foundUser.isPresent()) {
			List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
			authorities.add(new SimpleGrantedAuthority(foundUser.get().getRole().getName()));
			User user = new User(foundUser.get().getUsername(), 
					foundUser.get().getPassword(), authorities);
			return user;
		}
		else {
			return null;
		}
	}
	
	public UserInfo getUserById(int userId) throws UserNotFoundException {
		Optional<UserInfo> foundUser = this.userRepository.findById(userId);
		if (foundUser.isPresent()) {
			return foundUser.get();
		} else {
			throw new UserNotFoundException("User with id "+userId+" not found.");
		}
	}
	
	public Optional<UserInfo> findUserByEmail(String email) {
		return this.userRepository.findByEmail(email);
	}
	
	public Optional<UserInfo> findUserByUsername(String username) {
		return this.userRepository.findByUsername(username);
	}
	
	public UserInfo registerUser(UserInfo newUser) throws EmailInUseException, 
	UsernameInUseException {
//		Check that email and username are not in the database
		Optional<UserInfo> otherUser = findUserByEmail(newUser.getEmail());
		if (otherUser.isPresent()) {
			throw new EmailInUseException("Email already in use.");
		}
		otherUser = this.findUserByUsername(newUser.getUsername());
		if (otherUser.isPresent()) {
			throw new UsernameInUseException("Username already in use.");
		}
		return this.userRepository.save(newUser);
	}
	
	public UserInfo updateUser(UserInfo newUserInfo) throws UserNotFoundException,
	EmailInUseException, UsernameInUseException {
		try {
			UserInfo userToUpdate = getUserById(newUserInfo.getId());
//			Check if the new email in the updated user info is not in use
			Optional<UserInfo> userWithSameEmail = findUserByEmail(newUserInfo.getEmail());
			if (userWithSameEmail.isPresent()) {
				throw new EmailInUseException("Email already in use.");
			}
//			Check if the new username in the updated user info is not in use
			Optional<UserInfo> userWithSameUsername = 
					this.findUserByUsername(newUserInfo.getUsername());
			if (userWithSameUsername.isPresent()) {
				throw new UsernameInUseException("Username already in use.");
			}
//			Compare fields and udpate where not null
			if (newUserInfo.getFirstName() != null) {
				userToUpdate.setFirstName(newUserInfo.getFirstName());
			}
			if (newUserInfo.getLastName() != null) {
				userToUpdate.setLastName(newUserInfo.getLastName());
			}
			if (newUserInfo.getUsername() != null) {
				userToUpdate.setUsername(newUserInfo.getUsername());
			}
			if (newUserInfo.getEmail() != null) {
				userToUpdate.setEmail(newUserInfo.getEmail());
			}
			if (newUserInfo.getRole() != null) {
				userToUpdate.setRole(newUserInfo.getRole());
			}
			return this.userRepository.save(userToUpdate);
		} catch(UserNotFoundException e) {
			throw e;
		}
	}
	
//	The possible errors are checked in the controller
	public void updatePassword(UserInfo user) {
		this.userRepository.save(user);
	}
	
	public void deleteUser(int userId) throws UserNotFoundException {
		UserInfo userToRemove = getUserById(userId);
		if (userToRemove != null) {
			this.userRepository.delete(userToRemove);
		} else {
			throw new UserNotFoundException("User with id "+userId+" not found.");
		}
	}
}
