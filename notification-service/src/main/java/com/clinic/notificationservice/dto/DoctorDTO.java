package com.clinic.notificationservice.dto;

public class DoctorDTO {
    private String name, address;

    public DoctorDTO() {
    }

    public DoctorDTO(String name, String address) {
        this.name = name;
        this.address = address;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
