package com.ers.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ers.models.ClientInfo;
import com.ers.models.User;
import com.ers.repositories.UserRepository;

@Service
public class UserService {
	private UserRepository userRepository;
	
	@Autowired
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public Page<User> getAllUsers(Optional<Integer> page) {
		Pageable pageable = PageRequest.of(page.orElse(0), 3);
		return this.userRepository.findAll(pageable);
	}
	public Optional<User> getUserById(int userId) {
		return this.userRepository.findById(userId);
	}
	
	public User registerUser(User newUser) {
		return this.userRepository.save(newUser);
	}
	
	public User updateUser(User newUserInfo) {
		Optional<User> userToUpdate = getUserById(newUserInfo.getId());
		if (userToUpdate.isPresent()) {
			return this.userRepository.save(newUserInfo);
		}
//		In case user is not in the database
		return null;
	}
}
