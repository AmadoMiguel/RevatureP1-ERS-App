package com.ers.util;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ers.services.UserService;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
	
	@Autowired
	JWTUtil jwtUtil;
	
	@Autowired
	UserService userService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
//		This header contains the jwt
		final String authHeader = request.getHeader("Authorization");
		String jwt = null;
		String username = null;
		
		if (authHeader != null) {
			jwt = authHeader;
			username = this.jwtUtil.extractUsername(jwt);
		}
		
		if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			UserDetails userInfo = this.userService.loadUserByUsername(username);
			if (this.jwtUtil.validateToken(jwt, userInfo)) {
//				Spring security uses this token for managing authentication in the context of username
//				and password
				UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
						userInfo, null, userInfo.getAuthorities());
				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//				Set the auth token into the context for spring security checks
				SecurityContextHolder.getContext().setAuthentication(authToken);
			}
		}
		response.setHeader("Access-Control-Allow-Origin", "*");
		filterChain.doFilter(request, response);
	}

}
