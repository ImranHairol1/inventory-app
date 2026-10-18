package com.example.inventory.controller;

import com.example.inventory.entity.AuditLog;
import com.example.inventory.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    public List<AuditLog> getLogs(Authentication authentication) {
        return auditLogRepository.findTop200ByChangedByOrderByChangedAtDesc(authentication.getName());
    }
}