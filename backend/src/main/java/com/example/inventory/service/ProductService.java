package com.example.inventory.service;

import com.example.inventory.dto.ProductRequest;
import com.example.inventory.dto.ProductResponse;
import com.example.inventory.entity.Product;
import com.example.inventory.entity.User;
import com.example.inventory.repository.ProductRepository;
import com.example.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private static final Set<String> SORTABLE_FIELDS =
            Set.of("name", "price", "quantity", "category", "createdAt");

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<ProductResponse> getAll(String username, String search, String category,
                                        String sortBy, String direction) {
        String searchTerm = (search == null || search.isBlank()) ? null : search.trim();
        String categoryTerm = (category == null || category.isBlank()) ? null : category.trim();
        String field = SORTABLE_FIELDS.contains(sortBy) ? sortBy : "createdAt";
        Sort.Direction dir = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;

        log.info("User '{}' listing products (search={}, category={}, sort={} {})",
                username, searchTerm, categoryTerm, field, dir);

        return productRepository.search(username, searchTerm, categoryTerm, Sort.by(dir, field))
                .stream()
                .map(ProductResponse::from)
                .toList();
    }

    public ProductResponse getOne(String username, Long id) {
        return ProductResponse.from(findOwned(username, id));
    }

    public ProductResponse create(String username, ProductRequest request) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Product product = Product.builder()
                .name(request.name())
                .category(request.category())
                .description(request.description())
                .quantity(request.quantity())
                .price(request.price())
                .owner(owner)
                .build();

        Product saved = productRepository.save(product);
        log.info("User '{}' created product id={}", username, saved.getId());
        return ProductResponse.from(saved);
    }

    public ProductResponse update(String username, Long id, ProductRequest request) {
        Product product = findOwned(username, id);
        product.setName(request.name());
        product.setCategory(request.category());
        product.setDescription(request.description());
        product.setQuantity(request.quantity());
        product.setPrice(request.price());

        Product saved = productRepository.save(product);
        log.info("User '{}' updated product id={}", username, id);
        return ProductResponse.from(saved);
    }

    public void delete(String username, Long id) {
        Product product = findOwned(username, id);
        productRepository.delete(product);
        log.info("User '{}' deleted product id={}", username, id);
    }

    private Product findOwned(String username, Long id) {
        return productRepository.findByIdAndOwnerUsername(id, username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }
}