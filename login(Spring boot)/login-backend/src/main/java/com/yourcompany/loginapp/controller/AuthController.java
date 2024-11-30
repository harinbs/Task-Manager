package com.yourcompany.loginapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.yourcompany.loginapp.model.User;
import com.yourcompany.loginapp.service.AuthService;

@RestController
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/api/auth")
    public String authenticate(@RequestBody User user) {
        boolean isAuthenticated = authService.authenticate(user.getUsername(), user.getPassword());
        return isAuthenticated ? "Authenticated" : "Authentication Failed";
    }
}