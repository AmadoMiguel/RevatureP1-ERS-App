package com.ers.models;

public class ClientInfo {
	private int id;
	private String firstName;
	private String lastName;
	private String email;
	private Role role;
	
	public ClientInfo(int id, String firstName, String lastName, String email, Role role) {
		super();
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.role = role;
	}
	public ClientInfo() {
		super();
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
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
		return "ClientInfo [id=" + id + ", firstName=" + firstName + ", lastName=" 
	+ lastName + ", email=" + email + ", role=" + role + "]";
	}

}