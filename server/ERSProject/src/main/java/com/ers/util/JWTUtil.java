package com.ers.util;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.stereotype.Service;

import com.ers.models.UserInfo;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

// Jwt configuration for user authentication/authorization
@Service
public class JWTUtil {
//	Key to activate jwt generation
	private String secretKey = System.getenv("SECRET_KEY");
	
	private String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
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
	
	
	public String generateToken(UserInfo userInfo) {
		Map<String, Object> claims = new HashMap<>();
//		Role to determine if current user can access to certain info
		claims.put("role", userInfo.getRole().getName());
		return createToken(claims, userInfo.getUsername());
	}
	
	private String createToken(Map<String, Object> claims, String subject) {
		return Jwts.builder().setClaims(claims).setSubject(subject)
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + (1000 * 60 * 60 * 10)))
				.signWith(SignatureAlgorithm.HS256, secretKey).compact();
	}
	
	public Boolean validateToken(String token, UserInfo userInfo) {
		final String username = extractUsername(token);
		return (username.equals(userInfo.getUsername()) && !isTokenExpired(token));
	}
}
