package com.rentals;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class CarRentalServiceTest {

    @Mock
    private CarRentalRepository carRentalRepository;

    @InjectMocks
    private CarRentalService carRentalService;

    public CarRentalServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRentCar_OverlappingRental() {
        RentCarRequest request = new RentCarRequest();
        request.setCar("Volvo S60");
        request.setPickUpDate(LocalDate.of(2023, 10, 1));
        request.setReturnDate(LocalDate.of(2023, 10, 5));
        request.setDriverName("John Doe");
        request.setDriverAge(25);
        request.setCost(7500);

        RentedCar existingRental = new RentedCar();
        existingRental.setCar("Volvo S60");
        existingRental.setFromDate(LocalDate.of(2023, 10, 3));
        existingRental.setToDate(LocalDate.of(2023, 10, 7));

        when(carRentalRepository.findOverlappingRentals("Volvo S60", LocalDate.of(2023, 10, 1), LocalDate.of(2023, 10, 5)))
                .thenReturn(Collections.singletonList(existingRental));

        assertThrows(IllegalArgumentException.class, () -> carRentalService.rentCar(request));
    }
}