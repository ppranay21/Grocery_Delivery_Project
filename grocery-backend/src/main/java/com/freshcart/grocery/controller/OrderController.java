package com.freshcart.grocery.controller;

import com.freshcart.grocery.dto.CreateOrderRequest;
import com.freshcart.grocery.dto.OrderResponse;
import com.freshcart.grocery.dto.UpdateOrderStatusRequest;
import com.freshcart.grocery.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/api/orders")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse placeOrder(
            Authentication authentication,
            @Valid @RequestBody CreateOrderRequest request
    ) {
        return orderService.placeOrder(authentication.getName(), request);
    }

    @GetMapping("/api/orders/my")
    public List<OrderResponse> getMyOrders(Authentication authentication) {
        return orderService.getMyOrders(authentication.getName());
    }

    @PutMapping("/api/orders/{orderId}/cancel")
    public OrderResponse cancelMyOrder(
            Authentication authentication,
            @PathVariable Long orderId
    ) {
        return orderService.cancelMyOrder(
                authentication.getName(),
                orderId
        );
    }

    @GetMapping("/api/admin/orders")
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/api/admin/orders/{orderId}/status")
    public OrderResponse updateStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return orderService.updateOrderStatus(orderId, request);
    }
}
