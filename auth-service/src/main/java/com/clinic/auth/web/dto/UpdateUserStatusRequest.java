package com.clinic.auth.web.dto;

import com.clinic.auth.model.enums.AccountStatus;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Size;

public class UpdateUserStatusRequest {

    private Boolean enabled;

    @JsonAlias("status")
    private AccountStatus accountStatus;

    @Size(max = 255)
    private String reason;

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(AccountStatus accountStatus) {
        this.accountStatus = accountStatus;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}

