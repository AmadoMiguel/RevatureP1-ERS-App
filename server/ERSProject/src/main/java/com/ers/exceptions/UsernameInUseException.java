package com.ers.exceptions;

public class UsernameInUseException extends Exception {
	private static final long serialVersionUID = 1L;
	
	private String exceptionMessage = "An error ocurred";

	public UsernameInUseException(String message) {
		super(message);
		this.exceptionMessage = message;
	}

}
