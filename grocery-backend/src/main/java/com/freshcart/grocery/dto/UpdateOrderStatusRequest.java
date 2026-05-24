package com.freshcart.grocery.dto;

import com.freshcart.grocery.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(

        @NotNull(message = "Order status is required")
        OrderStatus status
) {
}
