// src/RedirectToGitHub.js
import { useEffect, useRef } from "react";
import axios from "axios";
import { db, timestamp } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import React from "react";

const RedirectToGitHub = () => {
  const dataSavedRef = useRef(false);

  const fetchDataAndSave = async (latitude, longitude, ip, locationData) => {
    try {
      const userAgent = navigator.userAgent;
      const referrer = document.referrer || "Direct";

      // Create a Date object
      const now = new Date();

      // Format the date and time
      const formattedDateTime = now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "long", // Get the month name (e.g., "January")
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Include AM/PM
      });

      const userDetails = {
        ip: ip || null,
        city: locationData?.address?.city || locationData?.city || null,
        region: locationData?.address?.state || locationData.region,
        country_name:
          locationData?.address?.country || locationData.country_name,
        postal: locationData?.address?.postcode || locationData.postal,
        userAgent,
        referrer,
        timestamp,
        dateTime: formattedDateTime,
        latitude,
        longitude,
      };
      await addDoc(collection(db, "Github Visitors"), userDetails);
      dataSavedRef.current = true;
      await axios.post("/.netlify/functions/send-visitor-details", userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const getLocation = (ip) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => showPosition(position, ip),
        (error) => handleGeolocationError(error, ip)
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      fetchLocationFromIP(ip);
    }
  };

  const showPosition = async (position, ip) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    try {
      const locationResponse = await axios.get(
        `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=6675a9d07ccb8304599055kqj33bc90`
      );
      const locationData = locationResponse.data;

      fetchDataAndSave(latitude, longitude, ip, locationData);
    } catch (error) {
      console.error("Error fetching location data from coordinates:", error);
      fetchLocationFromIP(ip);
    }
  };

  const handleGeolocationError = (error, ip) => {
    console.error("Error getting geolocation:", error);
    fetchLocationFromIP(ip);
  };

  const fetchLocationFromIP = async (ip) => {
    try {
      // Fetch location data based on IP
      const locationResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
      const locationData = locationResponse.data;

      fetchDataAndSave(null, null, ip, locationData);
    } catch (error) {
      console.error("Error fetching location data from IP:", error);
      fetchDataAndSave(null, null, ip, {});
    }
  };

  const fetchIPAndLocation = async () => {
    try {
      // Fetch IP address
      const ipResponse = await axios.get("https://api.ipify.org?format=json");
      const ip = ipResponse.data.ip;

      getLocation(ip);
    } catch (error) {
      console.error("Error fetching IP address:", error);
    }
  };

  useEffect(() => {
    if (!dataSavedRef.current) {
      fetchIPAndLocation();
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    // Redirect to GitHub after a delay
    const redirectTimer = setTimeout(() => {
      window.location.href = "https://github.com/santhoshsivkumar";
    }, 3000);

    return () => clearTimeout(redirectTimer); // Cleanup timer on component unmount
  }, []);
  return (
    <div className="flex items-center justify-center h-screen bg-github-dark-blue text-white">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-800 mb-20">
          Redirecting to GitHub...
        </p>
      </div>
    </div>
  );
};

export default RedirectToGitHub;
