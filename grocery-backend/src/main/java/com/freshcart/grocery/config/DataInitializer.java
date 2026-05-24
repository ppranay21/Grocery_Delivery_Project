package com.freshcart.grocery.config;

import com.freshcart.grocery.entity.Product;
import com.freshcart.grocery.entity.User;
import com.freshcart.grocery.repository.ProductRepository;
import com.freshcart.grocery.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedProducts(ProductRepository productRepository) {
        return args -> {
            List<Product> products = List.of(
                    product("Fresh Apples", "Fruits", "2.99", 100, "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6", "Fresh and crispy red apples.", "These fresh apples are perfect for snacks, salads, juices, and desserts."),
                    product("Bananas", "Fruits", "1.49", 120, "https://images.unsplash.com/photo-1587132137056-bfbf0166836e", "Sweet ripe bananas.", "Naturally sweet bananas perfect for smoothies and healthy snacks."),
                    product("Organic Milk", "Dairy", "3.99", 80, "https://images.unsplash.com/photo-1550583724-b2692b85b150", "Fresh organic milk.", "Fresh organic milk sourced from trusted farms."),
                    product("Fresh Bread", "Bakery", "2.49", 60, "https://images.unsplash.com/photo-1509440159596-0249088772ff", "Soft bakery bread.", "Freshly baked soft bread ideal for sandwiches and toast."),
                    product("Tomatoes", "Vegetables", "1.99", 90, "/tomatoes-small.jpg", "Fresh red tomatoes.", "Juicy red tomatoes suitable for salads, sauces, and everyday meals."),
                    product("Potatoes", "Vegetables", "2.25", 150, "https://images.unsplash.com/photo-1518977676601-b53f82aba655", "Farm fresh potatoes.", "Fresh potatoes for roasting, frying, baking, and cooking."),
                    product("Chicken Breast", "Meat", "8.99", 40, "https://images.unsplash.com/photo-1604503468506-a8da13d82791", "Fresh boneless chicken breast.", "High-quality boneless chicken breast cleaned and packed for cooking."),
                    product("Orange Juice", "Beverages", "4.49", 75, "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b", "Fresh orange juice.", "Refreshing orange juice perfect for breakfast."),
                    product("Strawberries", "Fruits", "4.99", 55, "https://images.unsplash.com/photo-1464965911861-746a04b4bca6", "Sweet fresh strawberries.", "Bright red strawberries for desserts, smoothies, and snacks."),
                    product("Blueberries", "Fruits", "5.49", 45, "https://images.unsplash.com/photo-1498557850523-fd3d118b962e", "Fresh blueberries.", "Plump blueberries rich in flavor for breakfast bowls and baking."),
                    product("Oranges", "Fruits", "3.49", 95, "https://images.unsplash.com/photo-1547514701-42782101795e", "Juicy oranges.", "Juicy oranges packed with bright citrus flavor."),
                    product("Green Grapes", "Fruits", "3.99", 70, "https://images.unsplash.com/photo-1537640538966-79f369143f8f", "Seedless green grapes.", "Crisp green grapes for snacking and fruit salads."),
                    product("Mangoes", "Fruits", "2.99", 65, "https://images.unsplash.com/photo-1553279768-865429fa0078", "Sweet ripe mangoes.", "Tropical mangoes with a sweet and juicy taste."),
                    product("Pineapple", "Fruits", "3.79", 42, "https://images.unsplash.com/photo-1550258987-190a2d41a8ba", "Fresh pineapple.", "Golden pineapple with a bright tropical flavor."),
                    product("Watermelon", "Fruits", "6.99", 30, "https://images.unsplash.com/photo-1563114773-84221bd62daa", "Refreshing watermelon.", "Large juicy watermelon for hot days and family snacks."),
                    product("Avocados", "Fruits", "4.29", 50, "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578", "Creamy avocados.", "Creamy avocados for toast, salads, and dips."),
                    product("Carrots", "Vegetables", "1.79", 130, "https://images.unsplash.com/photo-1447175008436-054170c2e979", "Crunchy carrots.", "Fresh carrots for salads, soups, and healthy snacks."),
                    product("Broccoli", "Vegetables", "2.49", 75, "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc", "Fresh green broccoli.", "Nutritious broccoli florets for steaming, stir-fry, and sides."),
                    product("Spinach", "Vegetables", "2.99", 85, "https://images.unsplash.com/photo-1576045057995-568f588f82fb", "Leafy spinach.", "Tender spinach leaves for salads, smoothies, and cooking."),
                    product("Onions", "Vegetables", "1.59", 140, "https://images.unsplash.com/photo-1508747703725-719777637510", "Fresh yellow onions.", "Everyday onions for cooking, soups, and sauces."),
                    product("Cucumbers", "Vegetables", "1.89", 90, "https://images.unsplash.com/photo-1604977042946-1eecc30f269e", "Crisp cucumbers.", "Cool cucumbers for salads, sandwiches, and snacks."),
                    product("Bell Peppers", "Vegetables", "3.49", 70, "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83", "Colorful bell peppers.", "Sweet bell peppers for stir-fries, salads, and roasting."),
                    product("Lettuce", "Vegetables", "2.29", 60, "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1", "Fresh lettuce.", "Crisp lettuce heads for salads, wraps, and burgers."),
                    product("Cauliflower", "Vegetables", "3.29", 48, "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3", "Fresh cauliflower.", "Firm cauliflower for roasting, steaming, and low-carb meals."),
                    product("Cheddar Cheese", "Dairy", "4.99", 55, "https://images.unsplash.com/photo-1452195100486-9cc805987862", "Sharp cheddar cheese.", "Rich cheddar cheese for sandwiches, snacks, and recipes."),
                    product("Greek Yogurt", "Dairy", "5.49", 65, "https://images.unsplash.com/photo-1488477181946-6428a0291777", "Creamy Greek yogurt.", "Thick Greek yogurt for breakfast bowls, smoothies, and sauces."),
                    product("Butter", "Dairy", "3.79", 70, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d", "Creamy dairy butter.", "Smooth butter for baking, cooking, and toast."),
                    product("Eggs", "Dairy", "4.29", 120, "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f", "Farm fresh eggs.", "Fresh eggs for breakfast, baking, and everyday cooking."),
                    product("Mozzarella", "Dairy", "4.49", 45, "https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b", "Soft mozzarella cheese.", "Mild mozzarella for pizzas, salads, and sandwiches."),
                    product("Almond Milk", "Dairy", "3.99", 52, "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4", "Smooth almond milk.", "Plant-based almond milk for cereal, coffee, and smoothies."),
                    product("Cream Cheese", "Dairy", "3.49", 38, "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d", "Spreadable cream cheese.", "Smooth cream cheese for bagels, dips, and desserts."),
                    product("Sour Cream", "Dairy", "2.99", 44, "https://images.unsplash.com/photo-1563636619-e9143da7973b", "Tangy sour cream.", "Cool sour cream for tacos, potatoes, and sauces."),
                    product("Croissants", "Bakery", "5.99", 40, "https://images.unsplash.com/photo-1555507036-ab1f4038808a", "Buttery croissants.", "Flaky croissants baked fresh for breakfast or snacks."),
                    product("Bagels", "Bakery", "4.49", 55, "https://images.unsplash.com/photo-1585478259715-4d3f2f6debd6", "Fresh bakery bagels.", "Chewy bagels ready for cream cheese or sandwiches."),
                    product("Muffins", "Bakery", "4.99", 36, "https://images.unsplash.com/photo-1607958996333-41aef7caefaa", "Soft bakery muffins.", "Sweet muffins for breakfast, coffee breaks, and desserts."),
                    product("Baguette", "Bakery", "2.99", 48, "https://images.unsplash.com/photo-1549931319-a545dcf3bc73", "Crusty baguette.", "Classic baguette with a crisp crust and soft center."),
                    product("Tortillas", "Bakery", "3.49", 64, "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d", "Soft flour tortillas.", "Soft tortillas for wraps, tacos, and quick meals."),
                    product("Dinner Rolls", "Bakery", "3.99", 58, "https://images.unsplash.com/photo-1509440159596-0249088772ff", "Soft dinner rolls.", "Fresh rolls for dinners, sliders, and lunch boxes."),
                    product("Chocolate Cake", "Bakery", "9.99", 18, "https://images.unsplash.com/photo-1578985545062-69928b1d9587", "Rich chocolate cake.", "Moist chocolate cake for celebrations and dessert nights."),
                    product("Donuts", "Bakery", "6.49", 32, "https://images.unsplash.com/photo-1551024601-bec78aea704b", "Assorted donuts.", "Sweet donuts for breakfast treats and sharing."),
                    product("Ground Beef", "Meat", "7.99", 45, "https://images.unsplash.com/photo-1603048297172-c92544798d5a", "Fresh ground beef.", "Versatile ground beef for burgers, pasta, tacos, and casseroles."),
                    product("Salmon Fillet", "Meat", "12.99", 30, "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2", "Fresh salmon fillet.", "Tender salmon fillets for baking, grilling, and healthy meals."),
                    product("Turkey Slices", "Meat", "6.99", 42, "https://images.unsplash.com/photo-1604909052743-94e838986d24", "Deli turkey slices.", "Lean turkey slices for sandwiches, wraps, and snacks."),
                    product("Pork Chops", "Meat", "9.49", 28, "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6", "Fresh pork chops.", "Tender pork chops ready for grilling, roasting, or pan-searing."),
                    product("Shrimp", "Meat", "11.99", 36, "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47", "Fresh shrimp.", "Clean shrimp for pasta, stir-fry, salads, and seafood dinners."),
                    product("Bacon", "Meat", "6.49", 50, "https://images.unsplash.com/photo-1524438418049-ab2acb7aa48f", "Smoky bacon.", "Crispy bacon strips for breakfast, sandwiches, and burgers."),
                    product("Lemonade", "Beverages", "3.49", 80, "https://images.unsplash.com/photo-1621263764928-df1444c5e859", "Refreshing lemonade.", "Sweet and tangy lemonade for a cool drink anytime."),
                    product("Iced Tea", "Beverages", "3.29", 75, "https://images.unsplash.com/photo-1556679343-c7306c1976bc", "Chilled iced tea.", "Smooth iced tea for meals, picnics, and warm afternoons."),
                    product("Sparkling Water", "Beverages", "4.99", 90, "https://images.unsplash.com/photo-1564419320461-6870880221ad", "Crisp sparkling water.", "Refreshing sparkling water with a clean bubbly finish."),
                    product("Cold Brew Coffee", "Beverages", "5.49", 55, "https://images.unsplash.com/photo-1461023058943-07fcbe16d735", "Smooth cold brew coffee.", "Rich cold brew coffee for a chilled caffeine boost.")
            );

            products.forEach(product -> {
                if (productRepository.findByNameIgnoreCase(product.getName()).isEmpty()) {
                    productRepository.save(product);
                }
            });
        };
    }

    @Bean
    CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@gmail.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");

                User demoUser = new User();
                demoUser.setName("Demo User");
                demoUser.setEmail("user@gmail.com");
                demoUser.setPassword(passwordEncoder.encode("123456"));
                demoUser.setRole("USER");

                userRepository.saveAll(List.of(admin, demoUser));
            }
        };
    }

    private Product product(
            String name,
            String category,
            String price,
            Integer stock,
            String imageUrl,
            String description,
            String longDescription
    ) {
        return new Product(
                name,
                category,
                new BigDecimal(price),
                stock,
                imageUrl,
                description,
                longDescription
        );
    }
}
