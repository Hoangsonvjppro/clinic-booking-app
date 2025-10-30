package com.clinic.auth.service;

import com.clinic.auth.model.Role;
import com.clinic.auth.model.User;
import com.clinic.auth.repo.RoleRepository;
import com.clinic.auth.repo.UserRepository;
import com.clinic.auth.exception.DuplicateResourceException;
import com.clinic.auth.exception.ResourceNotFoundException;
import com.clinic.auth.web.dto.CreateRoleRequest;
import com.clinic.auth.web.dto.UpdateUserRolesRequest;
import com.clinic.auth.web.dto.UserRolesResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Transactional
    public Role createRole(CreateRoleRequest request) {
        if (roleRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Role already exists: " + request.getName());
        }

        Role role = Role.builder()
                .name(request.getName())
                .displayName(toDisplayName(request.getName()))
                .description(request.getDescription())
                .build();

        return roleRepository.save(role);
    }

    @Transactional(readOnly = true)
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Transactional
    public UserRolesResponse updateUserRoles(UpdateUserRolesRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getEmail()));

        Set<Role> roles = request.getRoleNames().stream()
                .map(name -> roleRepository.findByName(name)
                        .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + name)))
                .collect(Collectors.toSet());

        user.setRoles(roles);
        userRepository.save(user);

        return mapToUserRolesResponse(user);
    }

    @Transactional(readOnly = true)
    public UserRolesResponse getUserRoles(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return mapToUserRolesResponse(user);
    }

    private UserRolesResponse mapToUserRolesResponse(User user) {
        UserRolesResponse response = new UserRolesResponse();
        response.setEmail(user.getEmail());
        response.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        response.setEnabled(user.isEnabled());
        return response;
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
