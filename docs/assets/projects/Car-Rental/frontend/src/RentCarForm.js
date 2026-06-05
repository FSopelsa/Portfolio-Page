import React, { useState, useEffect } from "react";
import "./RentCarForm.css";

const carImages = {
  "Volvo S60": [
    "/Car_pics/Volvo.S60/Volvo_S60_D5_R-Design_(II).jpg",
    "/Car_pics/Volvo.S60/Volvo_S60_R-Design_Edition.jpg",
    "/Car_pics/Volvo.S60/volvo-S60-T8-Polestar-310119.jpg",
  ],
  "Volkswagen Golf": [
    "/Car_pics/Volkswagen.golf/volkswagen-golf-gti-5-door.jpg",
    "/Car_pics/Volkswagen.golf/volkswagen-golf-gti-5-door-661.jpg",
    "/Car_pics/Volkswagen.golf/badfon-volkswagen-golf-gti.jpg",
  ],
  "Ford Transit": [
    "/Car_pics/Ford.Transit/Ford_Transit.jpg",
    "/Car_pics/Ford.Transit/Ford_Transit_Connect.jpg",
    "/Car_pics/Ford.Transit/Ford_Transit_Front.jpg",
  ],
  "Ford Mustang": [
    "/Car_pics/Ford.Mustang/ford-mustang-60th-anniversary.jpg",
    "/Car_pics/Ford.Mustang/2025-mustang-60th-anniversary.jpg",
    "/Car_pics/Ford.Mustang/ford-mustang-transparent.png",
  ],
};

const RentCarForm = () => {
  const [formData, setFormData] = useState({
    car: "",
    pickUpDate: "",
    returnDate: "",
    driverName: "",
    driverAge: "",
  });

  const [cost, setCost] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const carPrices = {
      "Volvo S60": 1500,
      "Volkswagen Golf": 1333,
      "Ford Mustang": 3000,
      "Ford Transit": 2400,
    };

    const { car, pickUpDate, returnDate } = formData;

    if (!car || !pickUpDate || !returnDate) {
      setCost(0);
      return;
    }

    const pickUp = new Date(pickUpDate);
    const returnD = new Date(returnDate);

    if (returnD <= pickUp) {
      setCost(0);
      return;
    }

    const days = (returnD - pickUp) / (1000 * 60 * 60 * 24);
    const rentalCost = days * carPrices[car];
    setCost(rentalCost);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmSubmit = async () => {
    setShowModal(false);
    setLoading(true);

    // Validate form data
    const { pickUpDate, returnDate, driverName, driverAge } = formData;
    const today = new Date().toISOString().split("T")[0];

    if (pickUpDate < today) {
      setError("Pick-up date can't be in the past");
      setLoading(false);
      return;
    }

    if (returnDate <= pickUpDate) {
      setError("Return date can't be before or on the pick-up date");
      setLoading(false);
      return;
    }

    if (!isNaN(driverName)) {
      setError("Driver name can't be a number");
      setLoading(false);
      return;
    }

    if (driverAge < 18) {
      setError("Driver must be 18 years or older");
      setLoading(false);
      return;
    }

    // Send data to backend
    try {
      const response = await fetch("/api/rent-car", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, cost }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "This car is already rented by someone on the seleceted dates. Please try another time or another car."
        );
      }

      setError("");
      alert("Car rented successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image) => {
    setEnlargedImage(image);
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  return (
    <div className="rent-car-container">
      <div className="rent-car-form">
        <h1>Car Rental Service</h1>
        <p>Select a car to see pictures</p>
        <form onSubmit={handleSubmit}>
          <select name="car" onChange={handleChange} required>
            <option value="">Select Car</option>
            <option value="Volvo S60">Volvo S60 - 1500 kr/day</option>
            <option value="Volkswagen Golf">
              Volkswagen Golf - 1333 kr/day
            </option>
            <option value="Ford Mustang">Ford Mustang - 3000 kr/day</option>
            <option value="Ford Transit">Ford Transit - 2400 kr/day</option>
          </select>
          <input
            type="date"
            name="pickUpDate"
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="returnDate"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="driverName"
            placeholder="Driver name"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="driverAge"
            placeholder="Driver age"
            onChange={handleChange}
            required
            min="18"
          />
          <button type="submit" disabled={loading}>
            {" "}
            {loading ? "Renting..." : "Rent Car"}{" "}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p id="costText">Cost: {cost} SEK</p>
        </form>
      </div>

      {formData.car && (
        <div className="car-images-container">
          <p className="click-to-enlarge">Click to enlarge images</p>
          <div className="car-images">
            {carImages[formData.car].map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${formData.car} ${index + 1}`}
                className="car-image"
                onClick={() => handleImageClick(image)}
              />
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to rent this car?</p>
            <button onClick={confirmSubmit}>Yes</button>
            <button onClick={() => setShowModal(false)}>No</button>
          </div>
        </div>
      )}

      {enlargedImage && (
        <div className="enlarged-image-modal" onClick={closeEnlargedImage}>
          <img
            src={enlargedImage}
            alt="Enlarged Car"
            className="enlarged-image"
          />
        </div>
      )}
    </div>
  );
};

export default RentCarForm;
