package com.ers.models;

public class ClientInfo {
	
	private String username;
	private String role;
	private String jwt;
	
	public ClientInfo(String username, String role, String jwt) {
		super();
		this.username = username;
		this.role = role;
		this.jwt = jwt;
	}
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getJwt() {
		return jwt;
	}
	public void setJwt(String jwt) {
		this.jwt = jwt;
	}
	
	@Override
	public String toString() {
		return "ClientInfo [username=" + username + ", role=" + role + ", jwt=" + jwt + "]";
	}

}