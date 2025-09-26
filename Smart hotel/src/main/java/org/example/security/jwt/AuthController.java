package org.example.security.jwt;




import org.example.entity.Roles;
import org.example.entity.User;
import org.example.repository.UserRepository;
import org.example.security.jwt.JwtUtils;
import org.example.security.jwt.LoginRequest;
import org.example.security.jwt.LoginResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

    @RestController
    @RequestMapping("/api/auth")
    public class AuthController {

        private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

        @Autowired
        private AuthenticationManager authenticationManager;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private JwtUtils jwtUtils;


        @PostMapping("/login")
        public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
            try {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginRequest.getEmail(),
                                loginRequest.getPassword()
                        )
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);

                String jwt = jwtUtils.generateTokenFromUsername((org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal());

                org.springframework.security.core.userdetails.UserDetails userDetails =
                        (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();

                List<String> roles = userDetails.getAuthorities().stream()
                        .map(auth -> auth.getAuthority())
                        .collect(Collectors.toList());

                return ResponseEntity.ok(new LoginResponse(userDetails.getUsername(), roles, jwt));

            } catch (BadCredentialsException e) {
                logger.error("Invalid login attempt for user {}", loginRequest.getEmail());
                return ResponseEntity.status(401).body("Invalid username or password");
            }
        }


        @PostMapping("/register")
        public ResponseEntity<?> registerUser(@RequestBody User userRequest) {
            if (userRepository.existsByEmail(userRequest.getEmail())) {
                return ResponseEntity
                        .badRequest()
                        .body("Error: Email is already in use!");
            }

            // encode password
            userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));

            // default role if not set
            if (userRequest.getRole() == null) {
                userRequest.setRole(Roles.ROLE_USER);
            }

            userRepository.save(userRequest);

            return ResponseEntity.ok("User registered successfully!");
        }


    }




