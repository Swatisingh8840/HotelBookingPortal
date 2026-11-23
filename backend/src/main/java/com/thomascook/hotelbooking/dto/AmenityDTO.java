package com.thomascook.hotelbooking.dto;

public class AmenityDTO {
    private Long id;
    private String name;
    private String iconCode;

    public AmenityDTO() {
    }

    public AmenityDTO(Long id, String name, String iconCode) {
        this.id = id;
        this.name = name;
        this.iconCode = iconCode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIconCode() {
        return iconCode;
    }

    public void setIconCode(String iconCode) {
        this.iconCode = iconCode;
    }
}
