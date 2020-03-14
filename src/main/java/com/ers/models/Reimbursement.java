package com.ers.models;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name= "reimbursements")
public class Reimbursement {
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private int id;
	
	@Column(nullable= false)
	private double amount;
	
	@Column(nullable= false)
	private String description;
	
	@ManyToOne
	@JoinColumn(name= "type_id", nullable= false)
	private ReimbursementType type;
	
	@ManyToOne
	@JoinColumn(name= "author_id", nullable= false)
	private UserInfo author;
	
	@ManyToOne
	@JoinColumn(name= "resolver_id", nullable= false)
	private UserInfo resolver;
	
	@ManyToOne
	@JoinColumn(name= "status_id", nullable= false)
	private ReimbursementStatus status;
	
	@Column(nullable= false)
	private LocalDate dateSubmitted;
	
	@Column(nullable= false)
	private LocalDate dateResolved;

	public Reimbursement(int id, double amount, String description, ReimbursementType type, 
			UserInfo author, UserInfo resolver, ReimbursementStatus status, LocalDate dateSubmitted, 
			LocalDate dateResolved) {
		super();
		this.id = id;
		this.amount = amount;
		this.description = description;
		this.type = type;
		this.author = author;
		this.resolver = resolver;
		this.status = status;
		this.dateSubmitted = dateSubmitted;
		this.dateResolved = dateResolved;
	}

	public Reimbursement() {
		super();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public ReimbursementType getType() {
		return type;
	}

	public void setType(ReimbursementType type) {
		this.type = type;
	}

	public UserInfo getAuthor() {
		return author;
	}

	public void setAuthor(UserInfo author) {
		this.author = author;
	}

	public UserInfo getResolver() {
		return resolver;
	}

	public void setResolver(UserInfo resolver) {
		this.resolver = resolver;
	}

	public ReimbursementStatus getStatus() {
		return status;
	}

	public void setStatus(ReimbursementStatus status) {
		this.status = status;
	}

	public LocalDate getDateSubmitted() {
		return dateSubmitted;
	}

	public void setDateSubmitted(LocalDate dateSubmitted) {
		this.dateSubmitted = dateSubmitted;
	}

	public LocalDate getDateResolved() {
		return dateResolved;
	}

	public void setDateResolved(LocalDate dateResolved) {
		this.dateResolved = dateResolved;
	}

	@Override
	public String toString() {
		return "Reimbursement [id=" + id + ", amount=" + amount + ", description=" 
	+ description + ", type=" + type + ", author=" + author + ", resolver=" + resolver 
	+ ", status=" + status + ", dateSubmitted=" + dateSubmitted + ", dateResolved=" 
	+ dateResolved + "]";
	}
	
}