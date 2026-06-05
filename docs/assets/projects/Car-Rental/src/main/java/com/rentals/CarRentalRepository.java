package com.rentals;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;


public interface CarRentalRepository extends JpaRepository<RentedCar, Long> {

    // Method to find overlapping rentals based on car, pick-up date, and return date.
    @Query("SELECT r FROM RentedCar r WHERE r.car = :car AND " +
           "((r.fromDate <= :returnDate AND r.toDate >= :pickUpDate) OR " +
           "(r.fromDate <= :pickUpDate AND r.toDate >= :pickUpDate) OR " +
           "(r.fromDate <= :returnDate AND r.toDate >= :returnDate))")
    
    List<RentedCar> findOverlappingRentals(@Param("car") String car, 
                                           @Param("pickUpDate") LocalDate pickUpDate, 
                                           @Param("returnDate") LocalDate returnDate);
}