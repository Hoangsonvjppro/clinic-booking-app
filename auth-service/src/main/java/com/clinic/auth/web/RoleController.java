package com.clinic.auth.web;

import com.clinic.auth.model.Role;
import com.clinic.auth.model.User;
import com.clinic.auth.repo.RoleRepository;
import com.clinic.auth.exception.DuplicateResourceException;
import com.clinic.auth.exception.ResourceNotFoundException;
import com.clinic.auth.repo.UserRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Locale;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Role> createRole(@RequestParam @NotBlank String name) {
        if (roleRepository.existsByName(name)) {
            throw new DuplicateResourceException("Role already exists: " + name);
        }
        Role role = Role.builder()
                .name(name)
                .displayName(toDisplayName(name))
                .description("Role " + name.toUpperCase(Locale.ROOT))
                .build();
        return ResponseEntity.ok(roleRepository.save(role));
    }

    @PutMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignRoles(@PathVariable Long userId, @RequestParam String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Role r = roleRepository.findByName(role)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + role));
        user.setRoles(Set.of(r));
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    private String toDisplayName(String code) {
        String normalized = code.replace('_', ' ').toLowerCase(Locale.ROOT);
        String[] parts = normalized.split("\\s+");
        StringBuilder builder = new StringBuilder();
        for (String part : parts) {
            if (part.isEmpty()) {
                continue;
            }
            if (builder.length() > 0) {
                builder.append(' ');
            }
            builder.append(Character.toUpperCase(part.charAt(0)));
            if (part.length() > 1) {
                builder.append(part.substring(1));
            }
        }
        return builder.toString();
    }
}
