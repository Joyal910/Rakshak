package com.marian.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.marian.project.model.User;
import com.marian.project.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Allow cross-origin requests from React front-end (localhost:3000)
public class UserController {

    @Autowired
    private UserService userService;

    // Fetch all users
    @GetMapping("/api/users")
    public List<User> showAllUsers() {
        return userService.getAllUsers();
    }

    // Fetch a single user by ID
    @GetMapping("/api/users/{userId}")
    public Optional<User> showUserById(@PathVariable int userId) {
        return userService.getUserById(userId);
    }

    // Add a new user
    @PostMapping("/api/users")
    public String addUser(@RequestBody User user) {
        // Check if the email is already registered
        if (userService.isEmailRegistered(user.getEmail())) {
            return "Email is already registered!";
        }
        
        // Proceed with saving the user if email is not already registered
        userService.saveUser(user);
        return "User registered successfully!";
    }

    // Update a user by ID
    @PutMapping("/api/users/{userId}")
    public User updateUser(@PathVariable int userId, @RequestBody User user) {
        return userService.updateUser(userId, user);
    }

    // Delete a user by ID
    @DeleteMapping("/api/users/{userId}")
    public String removeUser(@PathVariable int userId) {
        return userService.deleteUserById(userId);
    }
    
    @PostMapping("/api/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User loginUser) {
        Map<String, Object> response = new HashMap<>();
        // Authenticate the user
        boolean isValidUser = userService.authenticateUser(loginUser.getEmail(), loginUser.getPassword());
        if (isValidUser) {
            // Fetch the user's details
            String userStatus = userService.getUserStatus(loginUser.getEmail());
            Integer userId = userService.getUserIdByEmail(loginUser.getEmail());
            String userRole = userService.getUserRoleByEmail(loginUser.getEmail());
            String userName = userService.getUserNameByEmail(loginUser.getEmail()); // Add this method

            if ("active".equalsIgnoreCase(userStatus)) {
                response.put("success", true);
                response.put("message", "Login successful!");
                response.put("userid", userId);
                response.put("role", userRole);
                response.put("name", userName); // Include name in the response
                response.put("userStatus", userStatus);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "This user is blocked. Please contact support.");
                response.put("userStatus", userStatus);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
        } else {
            response.put("success", false);
            response.put("message", "Invalid credentials!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }


}
