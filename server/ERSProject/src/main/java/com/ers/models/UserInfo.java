package com.ers.models;


import java.util.ArrayList;
import java.util.Collection;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

@Entity
@Table(name= "users")
public class UserInfo extends User {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private int id;
	
	@Column(nullable= false, unique= true)
	private String username;
	
	@Column(nullable= false)
	private String password;
	
	@Column(nullable= false)
	private String firstName;
	
	@Column(nullable= false)
	private String lastName;
	
	@Column(nullable= false, unique= true)
	private String email;
	
	@Transient
	private static Collection<? extends GrantedAuthority> authorities = 
	new ArrayList<GrantedAuthority>();
	
//	Multiplicity with Role entity
	@ManyToOne
	@JoinColumn(name= "role_id", nullable= false)
	private Role role;

	public UserInfo(int id, String password, String firstName, String lastName, String email, 
			Role role) {
		super(email, email, authorities);
		this.id = id;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.role = role;
	}
	
	public UserInfo(String username, String password, Collection<? extends GrantedAuthority> authorities) {
		super(username, password, authorities);
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", password=" + password + ", firstName=" + firstName 
				+ ", lastName=" + lastName
				+ ", email=" + email + ", role=" + role + "]";
	}
	
}