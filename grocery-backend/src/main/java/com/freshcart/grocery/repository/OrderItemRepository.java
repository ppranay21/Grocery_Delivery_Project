package com.freshcart.grocery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.freshcart.grocery.entity.OrderItem;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);
}
