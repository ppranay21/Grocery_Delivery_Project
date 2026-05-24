package com.freshcart.grocery.dto;

import com.freshcart.grocery.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        Long userId,
        String customerEmail,
        String fullName,
        String phone,
        String address,
        String city,
        String state,
        String zipCode,
        String paymentMethod,
        BigDecimal subtotal,
        BigDecimal deliveryFee,
        BigDecimal tax,
        BigDecimal totalAmount,
        OrderStatus status,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {
}
