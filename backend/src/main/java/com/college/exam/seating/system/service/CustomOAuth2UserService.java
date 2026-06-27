package com.college.exam.seating.system.service;

import com.college.exam.seating.system.entity.User;
import com.college.exam.seating.system.repository.UserRepository;

import org.springframework.security.oauth2.client.userinfo.*;
import org.springframework.security.oauth2.core.user.*;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request)
            throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(request);

        Map<String, Object> attributes = oAuth2User.getAttributes();

        // ✅ Google gives email directly
        String email = (String) attributes.get("email");

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth provider");
        }

        // ✅ CHECK OR CREATE USER
        userRepository.findByUsername(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(email);
                    newUser.setPassword("oauth_user"); // dummy
                    newUser.setRole("STUDENT");
                    return userRepository.save(newUser);
                });

        return oAuth2User;
    }
}