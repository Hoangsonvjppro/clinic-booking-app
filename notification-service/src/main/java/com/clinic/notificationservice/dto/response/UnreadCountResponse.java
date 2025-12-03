package com.clinic.notificationservice.dto.response;

/**
 * Response DTO for unread notification counts.
 * Provides count of unread warnings and other unread items.
 */
public class UnreadCountResponse {

    private Long userId;
    private long unreadWarnings;
    private long unreadNotifications;
    private long pendingReportsAsReporter;
    private long totalUnread;

    // === Constructors ===

    public UnreadCountResponse() {
    }

    public UnreadCountResponse(Long userId, long unreadWarnings, long unreadNotifications, 
                               long pendingReportsAsReporter) {
        this.userId = userId;
        this.unreadWarnings = unreadWarnings;
        this.unreadNotifications = unreadNotifications;
        this.pendingReportsAsReporter = pendingReportsAsReporter;
        this.totalUnread = unreadWarnings + unreadNotifications;
    }

    // === Static Factory Methods ===

    public static UnreadCountResponse empty(Long userId) {
        UnreadCountResponse response = new UnreadCountResponse();
        response.userId = userId;
        response.unreadWarnings = 0;
        response.unreadNotifications = 0;
        response.pendingReportsAsReporter = 0;
        response.totalUnread = 0;
        return response;
    }

    public static UnreadCountResponse of(Long userId, long unreadWarnings, 
                                         long unreadNotifications, long pendingReportsAsReporter) {
        return new UnreadCountResponse(userId, unreadWarnings, unreadNotifications, pendingReportsAsReporter);
    }

    // === Getters and Setters ===

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public long getUnreadWarnings() {
        return unreadWarnings;
    }

    public void setUnreadWarnings(long unreadWarnings) {
        this.unreadWarnings = unreadWarnings;
        this.totalUnread = this.unreadWarnings + this.unreadNotifications;
    }

    public long getUnreadNotifications() {
        return unreadNotifications;
    }

    public void setUnreadNotifications(long unreadNotifications) {
        this.unreadNotifications = unreadNotifications;
        this.totalUnread = this.unreadWarnings + this.unreadNotifications;
    }

    public long getPendingReportsAsReporter() {
        return pendingReportsAsReporter;
    }

    public void setPendingReportsAsReporter(long pendingReportsAsReporter) {
        this.pendingReportsAsReporter = pendingReportsAsReporter;
    }

    public long getTotalUnread() {
        return totalUnread;
    }

    public void setTotalUnread(long totalUnread) {
        this.totalUnread = totalUnread;
    }
}
