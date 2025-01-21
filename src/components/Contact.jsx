import React, { useState } from "react";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addDataToGoogleSheets = async (data) => {
    const SHEET_ID = "1_BmZiyXWcJ7FwIYrH1eL4hsc2D50pfsMbyukqd24Vx4"; // Replace with your Google Sheet ID
    const RANGE = "Sheet1!A:D"; // Adjust range based on your Google Sheet
    const CLIENT_ID =
      "55343560176-22hv44t49lvk47fcqrbppfidchg0brtq.apps.googleusercontent.com"; // Replace with your Google OAuth2 Client ID
    const CLIENT_SECRET = "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"; // Replace with your Google OAuth2 Client Secret
    const REFRESH_TOKEN =
      "1//04GYVLXFadpUaCgYIARAAGAQSNwF-L9IrlZamWWffZomdM0S2J_j99e6pSMv2quOen_5tlAff2M6bjuc7qGx3vWFbMPOnT-VfzTU"; // Replace with your stored Refresh Token

    // Step 1: Get a new access token using the refresh token
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to obtain access token");
    }

    const { access_token } = await tokenResponse.json();

    // Step 2: Use the access token to add data to Google Sheets
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append?valueInputOption=RAW`;

    const body = {
      values: [[data.name, data.email, data.contact, data.message]],
    };

    const sheetsResponse = await fetch(sheetsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(body),
    });

    if (!sheetsResponse.ok) {
      throw new Error("Failed to add data to Google Sheets");
    }

    return sheetsResponse.json();
  };

  const addDataToStrapi = async (data) => {
    const STRAPI_URL =
      "https://portfolio-backend-311n.onrender.com/api/contactmessage"; // Replace with your Strapi API endpoint
    const STRAPI_TOKEN =
      "536e0034a3491a9103808cf524abd22aa3131cbd3315c87585f081dfae5f29f7741774ad6ad2b90a18d32e299f7b15f98138d7ae0132af4c6dd400bdab6b66fb0ba9a1aa9d1ebf159007ee90b1a38d63bc21df5de5b58571fa887b2d395f7d4c7dea76a0a4133b4327e84049f18156691ba91ba590b2ebde930bc9289e62da6f"; // Replace with your Strapi API token

    const response = await fetch(STRAPI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      throw new Error("Failed to add data to Strapi");
    }

    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.contact ||
      !formData.message
    ) {
      setStatus("Please fill out all fields.");
      return;
    }

    try {
      // Add data to Google Sheets
      await addDataToGoogleSheets(formData);

      // Add data to Strapi
      await addDataToStrapi(formData);

      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", contact: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="min-h-screen py-10 px-6 lg:px-40 bg-gray-100 dark:bg-gray-900 dark:text-white">
      <motion.h1
        className="text-4xl font-bold text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Let's Connect
      </motion.h1>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
        <div className="lg:w-1/2 w-full">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col">
              <label htmlFor="name" className="text-lg font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Your Name"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-lg font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Your Email"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="contact" className="text-lg font-semibold mb-2">
                Contact Number
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Your Contact Number"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="message" className="text-lg font-semibold mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Your Message"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-red-700 text-white py-2 px-4 rounded-lg font-semibold w-full transition-all duration-300 hover:bg-red-600"
              >
                Send Message
              </button>
            </div>
          </motion.form>

          {status && (
            <motion.div
              className="mt-6 text-center text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p
                className={`${
                  status === "Message sent successfully!"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {status}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
