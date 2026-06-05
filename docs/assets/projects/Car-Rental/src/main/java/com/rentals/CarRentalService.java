package com.rentals;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarRentalService {
    @Autowired
    private CarRentalRepository carRentalRepository;

    public void rentCar(RentCarRequest request) {
        // Validate request
        validateRequest(request);

        // Check for overlapping rentals
        List<RentedCar> overlappingRentals = carRentalRepository.findOverlappingRentals(
                request.getCar(), request.getPickUpDate(), request.getReturnDate());

        if (!overlappingRentals.isEmpty()) {
            throw new IllegalArgumentException("The car is already rented out during the selected period.");
        }

        // Save to database
        RentedCar rentedCar = new RentedCar();
        rentedCar.setDriverName(request.getDriverName());
        rentedCar.setCar(request.getCar());
        rentedCar.setFromDate(request.getPickUpDate());
        rentedCar.setToDate(request.getReturnDate());
        rentedCar.setRevenue(request.getCost());

        try {
            carRentalRepository.save(rentedCar);
        } catch (Exception e) {
            // Handle exception
            throw new RuntimeException("Failed to rent car", e);
        }
    }

    public List<RentedCar> getRentedCars() {
        return carRentalRepository.findAll();
    }

    private void validateRequest(RentCarRequest request) {
        if (request.getDriverName() == null || request.getDriverName().isEmpty()) {
            throw new IllegalArgumentException("Driver name is required");
        }
        if (request.getDriverAge() < 18) {
            throw new IllegalArgumentException("Driver must be 18 years or older");
        }
        if (request.getPickUpDate() == null || request.getReturnDate() == null) {
            throw new IllegalArgumentException("Pick-up and return dates are required");
        }
        if (request.getReturnDate().compareTo(request.getPickUpDate()) <= 0) {
            throw new IllegalArgumentException("Return date must be after pick-up date");
        }
    }
}