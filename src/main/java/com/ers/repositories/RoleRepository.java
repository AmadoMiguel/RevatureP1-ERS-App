package com.ers.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ers.models.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
	
}
