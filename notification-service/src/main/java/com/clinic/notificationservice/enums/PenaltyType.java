package com.clinic.notificationservice.enums;

/**
 * Types of penalties that can be applied to users.
 */
public enum PenaltyType {
    /**
     * Double the booking fee for future appointments
     */
    DOUBLE_BOOKING_FEE,
    
    /**
     * Triple the booking fee for future appointments
     */
    TRIPLE_BOOKING_FEE,
    
    /**
     * Temporarily ban the account for a period
     */
    TEMPORARY_BAN,
    
    /**
     * Permanently ban the account
     */
    PERMANENT_BAN,
    
    /**
     * Deduct points from user's rating
     */
    RATING_PENALTY,
    
    /**
     * Restrict certain features
     */
    FEATURE_RESTRICTION
}
