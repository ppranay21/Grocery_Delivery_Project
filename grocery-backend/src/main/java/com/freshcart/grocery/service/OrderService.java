package com.freshcart.grocery.service;

import com.freshcart.grocery.dto.*;
import com.freshcart.grocery.entity.*;
import com.freshcart.grocery.repository.OrderRepository;
import com.freshcart.grocery.repository.ProductRepository;
import com.freshcart.grocery.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class OrderService {

    private static final BigDecimal DELIVERY_FEE = new BigDecimal("4.99");
    private static final BigDecimal TAX_RATE = new BigDecimal("0.08");

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderService(
            OrderRepository orderRepository,
            UserRepository userRepository,
            ProductRepository productRepository
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public OrderResponse placeOrder(String authenticatedEmail, CreateOrderRequest request) {
        User user = userRepository.findByEmailIgnoreCase(authenticatedEmail)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Logged-in user not found"
                        )
                );

        Order order = new Order();
        order.setUser(user);
        order.setFullName(request.fullName().trim());
        order.setPhone(request.phone().trim());
        order.setAddress(request.address().trim());
        order.setCity(request.city().trim());
        order.setState(request.state().trim());
        order.setZipCode(request.zipCode().trim());
        order.setPaymentMethod(request.paymentMethod());
        order.setStatus(OrderStatus.PLACED);

        BigDecimal subtotal = BigDecimal.ZERO;

        for (CreateOrderItemRequest requestedItem : request.items()) {
            Product product = productRepository.findByIdForUpdate(requestedItem.productId())
                    .orElseThrow(() ->
                            new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "Product not found: " + requestedItem.productId()
                            )
                    );

            if (product.getStock() < requestedItem.quantity()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Not enough stock for " + product.getName()
                );
            }

            BigDecimal itemSubtotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(requestedItem.quantity()))
                    .setScale(2, RoundingMode.HALF_UP);

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setImageUrl(product.getImageUrl());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setQuantity(requestedItem.quantity());
            orderItem.setSubtotal(itemSubtotal);

            order.addItem(orderItem);

            product.setStock(product.getStock() - requestedItem.quantity());
            productRepository.save(product);

            subtotal = subtotal.add(itemSubtotal);
        }

        subtotal = subtotal.setScale(2, RoundingMode.HALF_UP);

        BigDecimal tax = subtotal
                .multiply(TAX_RATE)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalAmount = subtotal
                .add(DELIVERY_FEE)
                .add(tax)
                .setScale(2, RoundingMode.HALF_UP);

        order.setSubtotal(subtotal);
        order.setDeliveryFee(DELIVERY_FEE);
        order.setTax(tax);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        return toResponse(savedOrder);
    }

    @Transactional
    public List<OrderResponse> getMyOrders(String authenticatedEmail) {
        return orderRepository
                .findByUserEmailIgnoreCaseOrderByCreatedAtDesc(authenticatedEmail)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public OrderResponse cancelMyOrder(String authenticatedEmail, Long orderId) {
        Order order = orderRepository.findByIdAndUserEmailIgnoreCase(
                        orderId,
                        authenticatedEmail
                )
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Order not found"
                        )
                );

        if (order.getStatus() != OrderStatus.PLACED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only placed orders can be cancelled"
            );
        }

        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findByIdForUpdate(item.getProductId())
                    .orElseThrow(() ->
                            new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "Product not found: " + item.getProductId()
                            )
                    );

            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);

        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public List<OrderResponse> getAllOrders() {
        return orderRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public OrderResponse updateOrderStatus(
            Long orderId,
            UpdateOrderStatusRequest request
    ) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Order not found"
                        )
                );

        order.setStatus(request.status());

        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems()
                .stream()
                .map(item -> new OrderItemResponse(
                        item.getId(),
                        item.getProductId(),
                        item.getProductName(),
                        item.getImageUrl(),
                        item.getUnitPrice(),
                        item.getQuantity(),
                        item.getSubtotal()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getEmail(),
                order.getFullName(),
                order.getPhone(),
                order.getAddress(),
                order.getCity(),
                order.getState(),
                order.getZipCode(),
                order.getPaymentMethod(),
                order.getSubtotal(),
                order.getDeliveryFee(),
                order.getTax(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt(),
                itemResponses
        );
    }
}
