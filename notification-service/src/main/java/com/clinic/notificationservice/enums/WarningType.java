package com.clinic.notificationservice.enums;

/**
 * Types of warnings that can be issued to users.
 */
public enum WarningType {
    /**
     * Standard warning for minor violations
     */
    WARNING,
    
    /**
     * Final warning before penalties are applied
     */
    FINAL_WARNING,
    
    /**
     * Notice that a penalty has been applied
     */
    PENALTY_NOTICE
}
