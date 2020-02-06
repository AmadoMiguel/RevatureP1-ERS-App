package com.ers.models;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name= "users")
public class UserInfo {

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
	
//	Multiplicity with Role entity
	@ManyToOne
	@JoinColumn(name= "role_id", nullable= false)
	private Role role;

	public UserInfo(String username, String password,String firstName, 
			String lastName, String email, Role role) {
		super();
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.role = role;
	}
	
	public UserInfo() {
		super();
	}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
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
		return "UserInfo [id=" + id + ", username=" + username + ", password=" + password + 
				", firstName=" + firstName + ", lastName=" + lastName + ", email=" + email + 
				", role=" + role + "]";
	}
	
}