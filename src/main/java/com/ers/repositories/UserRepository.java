package com.ers.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.ers.models.UserInfo;

@Repository
public interface UserRepository extends JpaRepository<UserInfo, Integer> {
	Page<UserInfo> findAll(Pageable pageable);
	Optional<UserInfo> findByEmail(String email);
	Optional<UserInfo> findByUsername(String username);
	
//	Queries to search users by first name, last name and username
	
	@Query(value = "select * from ers.users where ers.users.first_name like ?1", nativeQuery = true)
	Page<UserInfo> usersWithFirstNameLike(String firstNameMatcher, Pageable pageable);
	
	@Query(value = "select * from ers.users where ers.users.last_name like ?1", nativeQuery = true)
	Page<UserInfo> usersWithLastNameLike(String lastNameMatcher, Pageable pageable);
	
	@Query(value = "select * from ers.users where ers.users.first_name like ?1 and ers.users.last_name like ?2",
			nativeQuery = true)
	Page<UserInfo> usersWithFirstNameAndLastNameLike(
			String firstNameMatcher, String lastNameMatcher, Pageable pageable);
	
	@Query(value = "select * from ers.users where ers.users.email like ?1", nativeQuery = true)
	Page<UserInfo> usersWithEmailLike(String emailMatcher, Pageable pageable);
	
	@Query(value = "select * from ers.users where ers.users.username like ?1", nativeQuery = true)
	Page<UserInfo> usersWithUsernameLike(String usernameMatcher, Pageable pageable);
}