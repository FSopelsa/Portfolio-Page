package com.rentals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.transaction.TestTransaction;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = RentalApplication.class)
@AutoConfigureMockMvc
@Transactional
public class CarRentalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testRentCar_Success() throws Exception {
        String requestJson = "{ \"car\": \"Volvo S60\", \"pickUpDate\": \"2023-10-01\", \"returnDate\": \"2023-10-05\", \"driverName\": \"John Doe\", \"driverAge\": 25, \"cost\": 7500 }";

        mockMvc.perform(post("/api/rent-car")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk());

        // Rollback the transaction to clean up the database
        TestTransaction.flagForRollback();
        TestTransaction.end();
    }

    @Test
    public void testRentCar_OverlappingRental() throws Exception {
        String requestJson1 = "{ \"car\": \"Volvo S60\", \"pickUpDate\": \"2023-10-01\", \"returnDate\": \"2023-10-05\", \"driverName\": \"John Doe\", \"driverAge\": 25, \"cost\": 7500 }";
        String requestJson2 = "{ \"car\": \"Volvo S60\", \"pickUpDate\": \"2023-10-03\", \"returnDate\": \"2023-10-07\", \"driverName\": \"Jane Doe\", \"driverAge\": 30, \"cost\": 9000 }";

        // First rental should succeed
        mockMvc.perform(post("/api/rent-car")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson1))
                .andExpect(status().isOk());

        // Second rental with overlapping dates should fail
        mockMvc.perform(post("/api/rent-car")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson2))
                .andExpect(status().isBadRequest());

        // Rollback the transaction to clean up the database
        TestTransaction.flagForRollback();
        TestTransaction.end();
    }
}