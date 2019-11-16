package com.ers.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ers.models.UserInfo;

@Repository
public interface UserRepository extends JpaRepository<UserInfo, Integer> {
	Page<UserInfo> findAll(Pageable pageable);
	Optional<UserInfo> findUserByEmail(String email);
	Optional<UserInfo> findByUsername(String username);
}