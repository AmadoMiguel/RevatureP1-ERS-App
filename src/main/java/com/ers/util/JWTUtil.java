package com.ers.util;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

// Jwt configuration for user authentication/authorization
@Service
public class JWTUtil {
	
//	Key to activate jwt generation
	private String secretKey = System.getenv("SECRET_JWT_KEY");
	
	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}
	
	public String extractRole(String token) {
		return (String) extractClaim(token, new Function<Claims, String>() {
			@Override
			public String apply(Claims t) {
				return t.get("role", String.class);
			}
		});
	}
	
	private Date getTokenExpirationDate(String token) {
		return extractClaim(token, Claims::getExpiration);
	}
	
	private Boolean isTokenExpired(String token) {
		return getTokenExpirationDate(token).before(new Date());
	}
	
//	Generic claim extractor, since the claims can be any Object of any type
	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}
//	Get all claims stored in the jwt
	public Claims extractAllClaims(String token) {
		return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
	}
	
	public String generateToken(UserDetails userInfo) {
		Map<String, Object> claims = new HashMap<>();
//		Roles to determine if current user can access to certain info
		ArrayList<String> authorities = new ArrayList<String>();
		for (GrantedAuthority auth: userInfo.getAuthorities()) {
			authorities.add(auth.getAuthority());
		}
//		For the purpose of this project, each user has only one role
		claims.put("role", authorities.get(0));
		return createToken(claims, userInfo.getUsername());
	}
	
	private String createToken(Map<String, Object> claims, String subject) {
		return Jwts.builder().setClaims(claims).setSubject(subject)
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + (1000 * 60 * 60 * 10)))
				.signWith(SignatureAlgorithm.HS256, secretKey).compact();
	}
	
	public Boolean validateToken(String token, UserDetails userInfo) {
		final String username = extractUsername(token);
		return (username.equals(userInfo.getUsername()) && !isTokenExpired(token));
	}
}
