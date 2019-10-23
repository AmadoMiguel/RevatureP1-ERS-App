package com.ers.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ers.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
	Page<User> findAll(Pageable pageable);
	Optional<User> findUserByEmail(String email);
}