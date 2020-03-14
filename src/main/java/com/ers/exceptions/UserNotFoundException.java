package com.ers.exceptions;

public class UserNotFoundException extends Exception {
	private static final long serialVersionUID = 1L;
	
	private String message;
	
	public UserNotFoundException(String message) {
		this.message = message;
	}
	
}
