package com.example.inventory.controller;

import com.example.inventory.dto.ProductRequest;
import com.example.inventory.dto.ProductResponse;
import com.example.inventory.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<ProductResponse> getAll(Authentication authentication,
                                        @RequestParam(required = false) String search,
                                        @RequestParam(required = false) String category,
                                        @RequestParam(defaultValue = "createdAt") String sortBy,
                                        @RequestParam(defaultValue = "desc") String direction) {
        return productService.getAll(authentication.getName(), search, category, sortBy, direction);
    }

    @GetMapping("/{id}")
    public ProductResponse getOne(Authentication authentication, @PathVariable Long id) {
        return productService.getOne(authentication.getName(), id);
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(Authentication authentication,
                                                  @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.create(authentication.getName(), request));
    }

    @PutMapping("/{id}")
    public ProductResponse update(Authentication authentication, @PathVariable Long id,
                                  @Valid @RequestBody ProductRequest request) {
        return productService.update(authentication.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        productService.delete(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}