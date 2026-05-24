package com.freshcart.grocery.controller;

import com.freshcart.grocery.dto.UpdateProfileRequest;
import com.freshcart.grocery.dto.UserProfileResponse;
import com.freshcart.grocery.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public UserProfileResponse getProfile(Authentication authentication) {
        return profileService.getProfile(authentication.getName());
    }

    @PutMapping
    public UserProfileResponse updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return profileService.updateProfile(
                authentication.getName(),
                request
        );
    }
}
