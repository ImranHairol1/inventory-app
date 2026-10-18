package com.example.inventory.repository;

import com.example.inventory.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findTop200ByChangedByOrderByChangedAtDesc(String changedBy);
}