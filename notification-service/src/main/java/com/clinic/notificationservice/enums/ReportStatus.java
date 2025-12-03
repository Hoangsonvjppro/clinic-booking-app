package com.clinic.notificationservice.enums;

/**
 * Status of a report in the system.
 */
public enum ReportStatus {
    /**
     * Report has been submitted and awaiting review
     */
    PENDING,
    
    /**
     * Admin is currently reviewing the report
     */
    REVIEWING,
    
    /**
     * Report has been resolved with an action taken
     */
    RESOLVED,
    
    /**
     * Report was dismissed (no action taken)
     */
    DISMISSED
}
