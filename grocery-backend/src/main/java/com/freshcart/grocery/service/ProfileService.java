package com.freshcart.grocery.service;

import com.freshcart.grocery.dto.UpdateProfileRequest;
import com.freshcart.grocery.dto.UserProfileResponse;
import com.freshcart.grocery.entity.User;
import com.freshcart.grocery.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserProfileResponse getProfile(String authenticatedEmail) {
        User user = findUserByEmail(authenticatedEmail);
        return toResponse(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(
            String authenticatedEmail,
            UpdateProfileRequest request
    ) {
        User user = findUserByEmail(authenticatedEmail);

        user.setName(request.fullName().trim());
        user.setPhone(request.phone().trim());
        user.setAddress(request.address().trim());
        user.setCity(request.city().trim());
        user.setState(request.state().trim());
        user.setZipCode(request.zipCode().trim());

        User savedUser = userRepository.save(user);

        return toResponse(savedUser);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User profile not found"
                        )
                );
    }

    private UserProfileResponse toResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getAddress(),
                user.getCity(),
                user.getState(),
                user.getZipCode()
        );
    }
}
