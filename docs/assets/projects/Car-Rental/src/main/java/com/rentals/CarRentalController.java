package com.rentals;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CarRentalController {
    @Autowired
    private CarRentalService carRentalService;

    @PostMapping("/rent-car")
    public void rentCar(@RequestBody RentCarRequest request) {
        try {
            carRentalService.rentCar(request);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("/rented-cars")
    public List<RentedCar> getRentedCars() {
        return carRentalService.getRentedCars();
    }
}