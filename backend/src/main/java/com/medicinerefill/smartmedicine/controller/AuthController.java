package com.medicinerefill.smartmedicine.controller;

import com.medicinerefill.smartmedicine.dto.JwtAuthenticationResponse;
import com.medicinerefill.smartmedicine.dto.LoginRequest;
import com.medicinerefill.smartmedicine.dto.SignUpRequest;
import com.medicinerefill.smartmedicine.model.User;
import com.medicinerefill.smartmedicine.repository.UserRepository;
import com.medicinerefill.smartmedicine.config.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            String jwt = tokenProvider.generateToken(authentication);
            User user = (User) authentication.getPrincipal();
            
            JwtAuthenticationResponse.UserSummary userSummary = new JwtAuthenticationResponse.UserSummary(
                    user.getId(), user.getName(), user.getEmail()
            );
            
            return ResponseEntity.ok(new JwtAuthenticationResponse(jwt, userSummary));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid email or password\"}");
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body("{\"error\": \"Email address already in use!\"}");
        }
        
        // Create new user
        User user = new User(signUpRequest.getName(),
                           signUpRequest.getEmail(),
                           passwordEncoder.encode(signUpRequest.getPassword()));
        
        User result = userRepository.save(user);
        
        // Generate JWT token
        String jwt = tokenProvider.generateTokenFromEmail(result.getEmail());
        
        JwtAuthenticationResponse.UserSummary userSummary = new JwtAuthenticationResponse.UserSummary(
                result.getId(), result.getName(), result.getEmail()
        );
        
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt, userSummary));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("{\"message\": \"User logged out successfully\"}");
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"User not authenticated\"}");
        }
        
        User user = (User) authentication.getPrincipal();
        JwtAuthenticationResponse.UserSummary userSummary = new JwtAuthenticationResponse.UserSummary(
                user.getId(), user.getName(), user.getEmail()
        );
        
        return ResponseEntity.ok(userSummary);
    }
}