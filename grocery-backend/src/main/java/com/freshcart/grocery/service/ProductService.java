package com.freshcart.grocery.service;

import com.freshcart.grocery.dto.ProductRequest;
import com.freshcart.grocery.entity.Product;
import com.freshcart.grocery.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product not found"
                ));
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Product> listProducts(String category, String search) {

        if (category != null && !category.isEmpty()) {
            return productRepository.findByCategoryIgnoreCase(category);
        }

        if (search != null && !search.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(search);
        }

        return productRepository.findAll();
    }

    public Product createProduct(ProductRequest request) {
        Product product = new Product(
                request.getName(),
                request.getCategory(),
                request.getPrice(),
                request.getStock(),
                request.getImageUrl(),
                request.getDescription(),
                request.getLongDescription()
        );

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {

        Product existingProduct = getProductById(id);

        existingProduct.setName(request.getName());
        existingProduct.setCategory(request.getCategory());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setStock(request.getStock());
        existingProduct.setImageUrl(request.getImageUrl());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setLongDescription(request.getLongDescription());

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {

        Product product = getProductById(id);

        productRepository.delete(product);
    }
}