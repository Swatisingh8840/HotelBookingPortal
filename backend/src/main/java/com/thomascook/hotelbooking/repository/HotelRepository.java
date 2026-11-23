package com.thomascook.hotelbooking.repository;

import com.thomascook.hotelbooking.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query("SELECT DISTINCT h FROM Hotel h LEFT JOIN FETCH h.amenities WHERE LOWER(h.city) LIKE LOWER(CONCAT('%', :city, '%'))")
    List<Hotel> searchByCityWithAmenities(@Param("city") String city);

    @Query("SELECT DISTINCT h FROM Hotel h LEFT JOIN FETCH h.amenities")
    List<Hotel> findAllWithAmenities();

    @Query("SELECT DISTINCT h FROM Hotel h LEFT JOIN FETCH h.amenities LEFT JOIN FETCH h.rooms WHERE h.id = :id")
    Optional<Hotel> findByIdWithRoomsAndAmenities(@Param("id") Long id);

    @Query("SELECT DISTINCT h FROM Hotel h LEFT JOIN FETCH h.amenities WHERE h.id IN :ids")
    List<Hotel> findByIdInWithAmenities(@Param("ids") List<Long> ids);
}
