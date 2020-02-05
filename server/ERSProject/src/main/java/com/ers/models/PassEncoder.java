package com.ers.models;

import java.security.SecureRandom;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PassEncoder extends BCryptPasswordEncoder {

	public PassEncoder() {
	}

	public PassEncoder(int strength) {
		super(strength);
	}

	public PassEncoder(BCryptVersion version) {
		super(version);
	}

	public PassEncoder(BCryptVersion version, SecureRandom random) {
		super(version, random);
	}

	public PassEncoder(int strength, SecureRandom random) {
		super(strength, random);
	}

	public PassEncoder(BCryptVersion version, int strength) {
		super(version, strength);
	}

	public PassEncoder(BCryptVersion version, int strength, SecureRandom random) {
		super(version, strength, random);
	}
	
	

}
