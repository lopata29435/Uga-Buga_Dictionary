package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.beans.factory.annotation.Value;
import lombok.RequiredArgsConstructor;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.util.Arrays;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.access.AccessDeniedHandlerImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import java.time.Instant;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    @Value("${api.version}")
    private String apiVersion;

    private static final String[] WHITE_LIST_URL = {
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html"
    };

    @PostConstruct
    public void enableInheritableThreadLocal() {
        SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
    }

    @PostConstruct
    public void logApiVersion() {
        System.out.println("=== API VERSION IN SECURITY CONFIG: " + apiVersion + " ===");
        System.out.println("=== PERMITALL PATTERN: /api/" + apiVersion + "/auth/** ===");
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
         configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "http://localhost",
                "https://lopata.su",
                "https://www.lopata.su"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With", "Cache-Control"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationEntryPoint jsonAuthenticationEntryPoint() {
        return new AuthenticationEntryPoint() {
            private final ObjectMapper mapper = new ObjectMapper();
            @Override
            public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                mapper.writeValue(response.getOutputStream(), java.util.Map.of(
                        "timestamp", Instant.now().toString(),
                        "status", 401,
                        "error", "UNAUTHORIZED",
                        "message", authException.getMessage(),
                        "path", request.getRequestURI()
                ));
            }
        };
    }

    @Bean
    public AccessDeniedHandler jsonAccessDeniedHandler() {
        return new AccessDeniedHandler() {
            private final ObjectMapper mapper = new ObjectMapper();
            @Override
            public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                mapper.writeValue(response.getOutputStream(), java.util.Map.of(
                        "timestamp", Instant.now().toString(),
                        "status", 403,
                        "error", "FORBIDDEN",
                        "message", accessDeniedException.getMessage(),
                        "path", request.getRequestURI()
                ));
            }
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        System.out.println("=== BUILDING SECURITY FILTER CHAIN ===");
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> {
                    System.out.println("=== CONFIGURING REQUEST MATCHERS ===");
                    System.out.println("=== PERMITALL: /api/" + apiVersion + "/auth/** ===");
                    auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(String.format("/api/%s/auth/**", apiVersion)).permitAll()
                        .requestMatchers(String.format("/%s/auth/**", apiVersion)).permitAll()
                        .requestMatchers(String.format("/api/%s/dictionary/**", apiVersion)).authenticated()
                        .requestMatchers(String.format("/%s/dictionary/**", apiVersion)).authenticated()
                        .requestMatchers(WHITE_LIST_URL).permitAll()
                        .requestMatchers("/uga-buga_dictionary/**", "/favicon.ico", "/hammer.svg", "/profile.jpg", "/assets/**").permitAll()
                        .anyRequest().authenticated();
                })
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jsonAuthenticationEntryPoint())
                        .accessDeniedHandler(jsonAccessDeniedHandler())
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
