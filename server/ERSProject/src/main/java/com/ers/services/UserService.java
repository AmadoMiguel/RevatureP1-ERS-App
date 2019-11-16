package com.ers.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ers.exceptions.EmailInUseException;
import com.ers.exceptions.UserNotFoundException;
import com.ers.models.UserInfo;
import com.ers.repositories.UserRepository;

@Service
public class UserService implements UserDetailsService {
	private UserRepository userRepository;
	
	@Autowired
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
//	Send paginated users information
	public Page<UserInfo> getAllUsers(Optional<Integer> page) {
		Pageable pageable = PageRequest.of(page.orElse(0), 5);
		return this.userRepository.findAll(pageable);
	}
	
//	Get user details for authentication
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<UserInfo> foundUser = this.userRepository.findByUsername(username);
		if (foundUser.isPresent()) {
			return foundUser.get();
		}
		else {
			throw new UsernameNotFoundException("User not found in the system.");
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
		return this.findUserByEmail(email);
	}
	
	public UserInfo registerUser(UserInfo newUser) throws EmailInUseException {
//		Check that email is not in the database
		Optional<UserInfo> otherUser = findUserByEmail(newUser.getEmail());
		if (otherUser.isPresent()) {
			throw new EmailInUseException("Email already in use.");
		}
		return this.userRepository.save(newUser);
	}
	
	public UserInfo updateUser(UserInfo newUserInfo) throws UserNotFoundException,
	EmailInUseException {
		UserInfo userToUpdate = getUserById(newUserInfo.getId());
		if (userToUpdate != null) {
//			Now check if the new email in the updated user info is not in use
			Optional<UserInfo> userWithSameEmail = findUserByEmail(userToUpdate.getEmail());
			if (userWithSameEmail.isPresent()) {
				throw new EmailInUseException("Email already in use.");
			}
			return this.userRepository.save(newUserInfo);
		} else {
//			In case user is not in the database
			throw new UserNotFoundException("User with id "+newUserInfo.getId()+" not found.");
		}	
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
