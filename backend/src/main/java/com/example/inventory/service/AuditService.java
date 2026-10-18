package com.example.inventory.service;

import com.example.inventory.entity.AuditLog;
import com.example.inventory.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void log(Long productId, String productName, String action,
                    String fieldName, String oldValue, String newValue, String user) {
        auditLogRepository.save(AuditLog.builder()
                .productId(productId)
                .productName(productName)
                .action(action)
                .fieldName(fieldName)
                .oldValue(oldValue)
                .newValue(newValue)
                .changedBy(user)
                .changedAt(LocalDateTime.now())
                .build());
    }
}