package com.freshcart.grocery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.freshcart.grocery.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	java.util.Optional<User> findByEmail(String email);
	boolean existsByEmailIgnoreCase(String email);
	java.util.Optional<User> findByEmailIgnoreCase(String email);
}
