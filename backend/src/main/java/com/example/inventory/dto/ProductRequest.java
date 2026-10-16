package com.example.inventory.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name must be at most 100 characters")
        String name,

        @Size(max = 50, message = "Category must be at most 50 characters")
        String category,

        @Size(max = 1000, message = "Description must be at most 1000 characters")
        String description,

        @NotNull(message = "Quantity is required")
        @Min(value = 0, message = "Quantity cannot be negative")
        Integer quantity,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", message = "Price cannot be negative")
        BigDecimal price
) {}