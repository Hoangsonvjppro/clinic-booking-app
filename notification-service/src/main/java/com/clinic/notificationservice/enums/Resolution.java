package com.clinic.notificationservice.enums;

/**
 * Resolution types for report processing.
 * Determines what action admin takes on a report.
 */
public enum Resolution {
    /**
     * Send a warning to the reported user
     */
    WARNING,
    
    /**
     * Apply a penalty (e.g., double booking fee)
     */
    PENALTY,
    
    /**
     * Temporarily suspend the account
     */
    SUSPEND,
    
    /**
     * Permanently ban the account
     */
    BAN,
    
    /**
     * Dismiss the report (no violation found)
     */
    DISMISS
}
