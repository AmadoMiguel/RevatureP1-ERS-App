package com.ers.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ers.services.UserService;

@Configuration
@EnableWebSecurity
public class ERSSecurityConfig extends WebSecurityConfigurerAdapter {
//	TODO: Configure JWT token and inject it here
	
	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}
	
	@Autowired
	private UserService userService;
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
//		Spring security will call the service in order to authenticate the user
//		It will call the loadUserByUsername method on the service
		auth.userDetailsService(userService);
		
//		After JWT is configured, apply it here
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
		.httpBasic().disable()
		.csrf().disable()
		.cors().disable()
		.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
		.and()
		.authorizeRequests()
//		.anyRequest().authenticated()
		.antMatchers(HttpMethod.GET, "/ers/users").authenticated()
		.antMatchers(HttpMethod.POST, "/ers/users/register").permitAll()
		.antMatchers(HttpMethod.POST, "/ers/users/login").permitAll();
	}
	
	
	@SuppressWarnings("deprecation")
	@Bean
	public PasswordEncoder passwordEncoder() {
		return NoOpPasswordEncoder.getInstance();
	}

}
