package com.college.exam.seating.system.service;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User user = (OAuth2User) authentication.getPrincipal();

        String email = user.getAttribute("email");

        if (email == null) {
            email = "unknown";
        }

        // ✅ ENCODE URL (VERY IMPORTANT)
        String encodedEmail = URLEncoder.encode(email, StandardCharsets.UTF_8);

        String redirectUrl = "http://localhost:3000/oauth-success?email=" + encodedEmail;

        response.sendRedirect(redirectUrl);
    }
}