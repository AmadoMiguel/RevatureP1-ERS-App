package com.ers.security;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ers.services.UserService;
import com.ers.util.JwtRequestFilter;

@EnableWebSecurity
public class ERSSecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}
	
	@Autowired
	private JwtRequestFilter jwtFilter;
	
	@Autowired
	private UserService userService;
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
//		Spring security will call the service in order to authenticate the user
//		It will call the loadUserByUsername method on the service
		auth.userDetailsService(userService)
		.passwordEncoder(passwordEncoder());
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
		.cors().and()
		.csrf().disable()
		.httpBasic().and()
//		Used to avoid creating sessions. Instead, each request is filtered separately.
		.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
		.authorizeRequests()
		.antMatchers(HttpMethod.GET, "/ers/users/info").hasAnyAuthority("admin", "finance")
		.antMatchers(HttpMethod.PUT, "/ers/users/*").hasAuthority("admin")
		.antMatchers(HttpMethod.POST, "/ers/users/register").permitAll()
//		.antMatchers(HttpMethod.POST, "/ers/users/login").permitAll()
		.antMatchers(HttpMethod.GET, "/ers/reimbursements/status/*").hasAuthority("finance")
		.antMatchers(HttpMethod.POST, "/ers/reimbursements/*").hasAuthority("user")
		.antMatchers(HttpMethod.PATCH, "/ers/reimbursements/*").hasAuthority("finance");
//		Use jwt filter before every request to intercept and check user authorities
		http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
    public CorsConfigurationSource corsConfigurationSource() 
    {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.unmodifiableList(Arrays.asList("*")));
        configuration.setAllowedMethods(
        		Collections.unmodifiableList(Arrays.asList("HEAD", "GET", "POST", "PUT", "PATCH", "DELETE")));
        configuration.setAllowedHeaders(
        		Collections.unmodifiableList(Arrays.asList("Authorization", "Cache-Control", "Content-Type")));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
