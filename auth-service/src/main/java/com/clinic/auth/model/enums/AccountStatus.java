package com.clinic.auth.model.enums;

/**
 * Enum representing the account status of a user.
 * Used for account moderation (warnings, suspensions, bans).
 */
public enum AccountStatus {
    /**
     * Account is active and can be used normally
     */
    ACTIVE,
    
    /**
     * Account has received a warning but can still be used
     */
    WARNED,
    
    /**
     * Account is temporarily suspended and cannot login
     */
    SUSPENDED,
    
    /**
     * Account is permanently banned and cannot login
     */
    BANNED
}
