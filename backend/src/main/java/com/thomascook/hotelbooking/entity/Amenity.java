package com.thomascook.hotelbooking.entity;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "amenities")
public class Amenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "icon_code", nullable = false, length = 50)
    private String iconCode;

    public Amenity() {
    }

    public Amenity(Long id, String name, String iconCode) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Amenity amenity = (Amenity) o;
        return Objects.equals(id, amenity.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
