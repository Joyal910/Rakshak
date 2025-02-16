package com.marian.project.service;

import com.marian.project.model.User;
import com.marian.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // BCrypt encoder

    // Fetch all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Fetch a single user by ID
    public Optional<User> getUserById(int userId) {
        return userRepository.findById(userId);
    }

    public User saveUser(User user) {
        // Encrypt password before saving it
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword); // Set encrypted password
        return userRepository.save(user);
    }

    // Update an existing user by ID
    public User updateUser(int userId, User user) {
        Optional<User> existingUser = userRepository.findById(userId);
        if (existingUser.isPresent()) {
            user.setUserId(userId); // Ensure the user ID is preserved when updating
            return userRepository.save(user);
        }
        return null; // or throw an exception
    }

    // Delete a user by ID
    public String deleteUserById(int userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return "User with ID " + userId + " was deleted successfully.";
        } else {
            return "User not found!";
        }
    }

    // Check if an email address already exists in the user table
    public boolean isEmailRegistered(String email) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        return existingUser.isPresent();
    }

    // Authenticate user by email and password
    public boolean authenticateUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Compare the hashed password with the provided password
            return passwordEncoder.matches(password, user.getPassword());
        }

        return false; // User not found or incorrect credentials
    }

    // Get user status by email
    public String getUserStatus(String email) {
        // Retrieve the user as an Optional
        Optional<User> optionalUser = userRepository.findByEmail(email);

        // Extract the user status if present, or return "unknown" if not
        return optionalUser.map(User::getUserStatus).orElse("unknown");
    }

    public Integer getUserIdByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.map(User::getUserId).orElse(null);
    }
    public String getUserRoleByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.map(User::getRole).orElse(null);
    }
    public String getUserNameByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.map(User::getName).orElse(null);
    }

}
