package com.ers.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ers.exceptions.EmailInUseException;
import com.ers.exceptions.UserNotFoundException;
import com.ers.models.User;
import com.ers.repositories.UserRepository;

@Service
public class UserService {
	private UserRepository userRepository;
	
	@Autowired
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
//	Send paginated users information
	public Page<User> getAllUsers(Optional<Integer> page) {
		Pageable pageable = PageRequest.of(page.orElse(0), 5);
		return this.userRepository.findAll(pageable);
	}
	
	public User getUserById(int userId) throws UserNotFoundException {
		Optional<User> foundUser = this.userRepository.findById(userId);
		if (foundUser.isPresent()) {
			return foundUser.get();
		} else {
			throw new UserNotFoundException("User with id "+userId+" not found.");
		}
	}
	
	public Optional<User> findUserByEmail(String email) {
		return this.findUserByEmail(email);
	}
	
	public User registerUser(User newUser) throws EmailInUseException {
//		Check that email is not in the database
		Optional<User> otherUser = findUserByEmail(newUser.getEmail());
		if (otherUser.isPresent()) {
			throw new EmailInUseException("Email already in use.");
		}
		return this.userRepository.save(newUser);
	}
	
	public User updateUser(User newUserInfo) throws UserNotFoundException,
	EmailInUseException {
		User userToUpdate = getUserById(newUserInfo.getId());
		if (userToUpdate != null) {
//			Now check if the new email in the updated user info is not in use
			Optional<User> userWithSameEmail = findUserByEmail(userToUpdate.getEmail());
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
		User userToRemove = getUserById(userId);
		if (userToRemove != null) {
			this.userRepository.delete(userToRemove);
		} else {
			throw new UserNotFoundException("User with id "+userId+" not found.");
		}
	}
}
