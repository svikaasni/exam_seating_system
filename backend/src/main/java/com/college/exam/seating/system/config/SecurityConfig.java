package com.college.exam.seating.system.config;

import com.college.exam.seating.system.service.CustomUserDetailsService;
import com.college.exam.seating.system.service.CustomOAuth2UserService;
import com.college.exam.seating.system.service.OAuth2SuccessHandler;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final CustomOAuth2UserService oAuth2UserService;
    private final OAuth2SuccessHandler successHandler;

    public SecurityConfig(CustomUserDetailsService userDetailsService,
                          CustomOAuth2UserService oAuth2UserService,
                          OAuth2SuccessHandler successHandler) {
        this.userDetailsService = userDetailsService;
        this.oAuth2UserService = oAuth2UserService;
        this.successHandler = successHandler;
    }

    // 🔐 Password Encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🔐 Authentication Manager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // 🔥 AUTH PROVIDER
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // 🌐 FIXED CORS CONFIG (ONLY ONE PLACE)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // ✅ Frontend origin (React)
        config.setAllowedOrigins(List.of("http://localhost:3000"));

        // OR if using Vite use:
        // config.setAllowedOrigins(List.of("http://localhost:5173"));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }

    // 🔐 SECURITY FILTER CHAIN
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())

            .authenticationProvider(authenticationProvider())

            .authorizeHttpRequests(auth -> auth

                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // 🔓 PUBLIC
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/oauth2/**").permitAll()
                .requestMatchers("/login/**").permitAll()

                // 👨‍💻 ADMIN ONLY
                .requestMatchers("/allocation/run").hasRole("ADMIN")
                .requestMatchers("/allocation/send-whatsapp").hasRole("ADMIN")

                // 🧑‍💼 STAFF + ADMIN
                .requestMatchers("/allocation/list").hasAnyRole("ADMIN", "STAFF")
 .requestMatchers("/pdf/**").hasAnyRole("ADMIN", "STAFF")

                // 🔔 Notifications
                .requestMatchers("/notifications/**").hasRole("ADMIN")

                // 👨‍🎓 STUDENT
                .requestMatchers("/student/**")
                .hasAnyRole("ADMIN", "STAFF", "STUDENT")

                .anyRequest().authenticated()
            )

            .httpBasic(httpBasic -> {})

            .oauth2Login(oauth -> oauth
                .loginPage("/login")
                .userInfoEndpoint(user -> user.userService(oAuth2UserService))
                .successHandler(successHandler)
            );

        return http.build();
    }
}