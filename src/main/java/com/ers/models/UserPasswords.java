package com.ers.models;

public class UserPasswords {

	private String oldPassword;
	private String newPassword;
	
	public UserPasswords(String oldPassword, String newPassword) {
		super();
		this.oldPassword = oldPassword;
		this.newPassword = newPassword;
	}

	public String getOldPassword() {
		return oldPassword;
	}

	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

	@Override
	public String toString() {
		return "UserPasswords [oldPassword=" + oldPassword + ", newPassword=" + newPassword + "]";
	}
	

}
