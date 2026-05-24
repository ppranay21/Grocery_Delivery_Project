package com.freshcart.grocery.repository;

import com.freshcart.grocery.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserEmailIgnoreCaseOrderByCreatedAtDesc(String email);

    List<Order> findAllByOrderByCreatedAtDesc();

    Optional<Order> findByIdAndUserEmailIgnoreCase(Long id, String email);
}
