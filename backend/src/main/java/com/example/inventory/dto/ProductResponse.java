package com.example.inventory.dto;

import com.example.inventory.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
        Long id,
        String name,
        String category,
        String description,
        Integer quantity,
        BigDecimal price,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getCategory(),
                product.getDescription(),
                product.getQuantity(),
                product.getPrice(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}