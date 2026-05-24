package com.freshcart.grocery.dto;

public record UserProfileResponse(
        Long id,
        String fullName,
        String email,
        String role,
        String phone,
        String address,
        String city,
        String state,
        String zipCode
) {
}
