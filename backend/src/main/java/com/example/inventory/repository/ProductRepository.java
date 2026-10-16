package com.example.inventory.repository;

import com.example.inventory.entity.Product;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByIdAndOwnerUsername(Long id, String username);

    @Query("""
            SELECT p FROM Product p
            WHERE p.owner.username = :username
              AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:category IS NULL OR p.category = :category)
            """)
    List<Product> search(@Param("username") String username,
                         @Param("search") String search,
                         @Param("category") String category,
                         Sort sort);
}