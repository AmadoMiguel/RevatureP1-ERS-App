package com.ers.exceptions;

public class EmailInUseException extends Exception {
	private static final long serialVersionUID = 1L;
	
	private String message;
	
	public EmailInUseException(String message) {
		this.message = message;
	}

}