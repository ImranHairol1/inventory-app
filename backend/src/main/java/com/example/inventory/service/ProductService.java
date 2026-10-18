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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private static final Set<String> SORTABLE_FIELDS =
            Set.of("name", "price", "quantity", "category", "createdAt");

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

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

    @Transactional
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
        auditService.log(saved.getId(), saved.getName(), "CREATED", null, null, null, username);
        log.info("User '{}' created product id={}", username, saved.getId());
        return ProductResponse.from(saved);
    }

    @Transactional
    public ProductResponse update(String username, Long id, ProductRequest request) {
        Product product = findOwned(username, id);

        String oldName = product.getName();
        String oldCategory = product.getCategory();
        String oldDescription = product.getDescription();
        Integer oldQuantity = product.getQuantity();
        BigDecimal oldPrice = product.getPrice();

        product.setName(request.name());
        product.setCategory(request.category());
        product.setDescription(request.description());
        product.setQuantity(request.quantity());
        product.setPrice(request.price());

        Product saved = productRepository.save(product);

        logIfChanged(saved, "name", oldName, request.name(), username);
        logIfChanged(saved, "category", oldCategory, request.category(), username);
        logIfChanged(saved, "description", oldDescription, request.description(), username);
        logIfChanged(saved, "quantity", String.valueOf(oldQuantity), String.valueOf(request.quantity()), username);
        logIfChanged(saved, "price", money(oldPrice), money(request.price()), username);

        log.info("User '{}' updated product id={}", username, id);
        return ProductResponse.from(saved);
    }

    @Transactional
    public void delete(String username, Long id) {
        Product product = findOwned(username, id);
        Long productId = product.getId();
        String productName = product.getName();
        productRepository.delete(product);
        auditService.log(productId, productName, "DELETED", null, null, null, username);
        log.info("User '{}' deleted product id={}", username, id);
    }

    private Product findOwned(String username, Long id) {
        return productRepository.findByIdAndOwnerUsername(id, username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    private void logIfChanged(Product product, String field, String oldValue, String newValue, String user) {
        String before = oldValue == null ? "" : oldValue;
        String after = newValue == null ? "" : newValue;
        if (!Objects.equals(before, after)) {
            auditService.log(product.getId(), product.getName(), "UPDATED", field, before, after, user);
        }
    }

    private String money(BigDecimal value) {
        return value == null ? "" : value.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }
}