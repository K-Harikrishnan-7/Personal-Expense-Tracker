package com.expense.tracker.expense_tracker_backend.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.expense.tracker.expense_tracker_backend.security.services.UserDetailsImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${expense.tracker.jwtSecret}")
    private String jwtSecret;

    @Value("${expense.tracker.jwtExpirationMs}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {

        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return JWT.create()
                .withSubject((userPrincipal.getUsername()))
                .withClaim("id", userPrincipal.getId()) // Add user ID
                .withClaim("email", userPrincipal.getEmail()) // Add email
                .withIssuedAt(new Date())
                .withExpiresAt(new Date((new Date()).getTime() + jwtExpirationMs))
                .sign(Algorithm.HMAC512(jwtSecret));
    }

    public String getUserNameFromJwtToken(String token) {
        return JWT.require(Algorithm.HMAC512(jwtSecret))
                .build()
                .verify(token)
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            JWT.require(Algorithm.HMAC512(jwtSecret)).build().verify(authToken);
            return true;
        } catch (JWTVerificationException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        }
        return false;
    }

    public DecodedJWT decodeJwtToken(String token) {
        try {
            return JWT.require(Algorithm.HMAC512(jwtSecret)).build().verify(token);
        } catch (JWTVerificationException e) {
            logger.error("Error decoding JWT token: {}", e.getMessage());
            return null;
        }
    }

    public String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}
