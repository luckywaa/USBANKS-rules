// ==UserScript==
// @name         HSBC Travel Inventory Type
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  HSBC Travel Inventory Type
// @author       lol
// @match        https://hsbc-travel-membersite.podiumrewards.com/*
// @grant        none
// @run-at document-start
// ==/UserScript==

// 用于显示HSBC US travel里的hotel预定来源，要找BKG(booking)的。

(function () {
    'use strict';

    if (!location.hash.startsWith("#/hotels/detail/")) {
        return;
    }

    console.log("HSBC Inventory Script Loaded.");

    // Intercept XMLHttpRequest
    (function () {
        const originalXHR = window.XMLHttpRequest;
        function ModifiedXHR() {
            const xhr = new originalXHR();

            // Intercept 'onreadystatechange'
            const originalOpen = xhr.open;
            xhr.open = function (method, url, ...args) {
                // Check if the request is for the target API
                this.isTargetAPI = url.includes('/api/v1/hotel/view');
                return originalOpen.apply(this, [method, url, ...args]);
            };

            const originalSend = xhr.send;
            xhr.send = function (...args) {
                if (this.isTargetAPI) {
                    this.addEventListener('readystatechange', function () {
                        if (this.readyState === 4 && this.status === 200) {
                            try {
                                const data = JSON.parse(this.responseText);
                                waitForRoomContainers(() => processApiResponse(data));
                            } catch (err) {
                                console.error('Error parsing API response:', err);
                            }
                        }
                    });
                }
                return originalSend.apply(this, args);
            };

            return xhr;
        }
        window.XMLHttpRequest = ModifiedXHR;
    })();

    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const response = await originalFetch(...args);

        // Check if the request matches the target API
        if (args[0].includes('/api/v1/hotel/view')) {
            // Clone the response to parse its data
            const clonedResponse = response.clone();
            clonedResponse.json().then(data => {
                waitForRoomContainers(() => processApiResponse(data));
            });
        }

        return response;
    };

    // Function to compare floating-point numbers with an epsilon
    function floatEquals(a, b, epsilon = 1e-2) {
        return Math.abs(a - b) < epsilon;
    }

    // Wait for room-container elements to exist
    function waitForRoomContainers(callback, maxRetries = 20, interval = 500) {
        let retries = 0;

        const checkExist = setInterval(() => {
            const containers = document.querySelectorAll('.room-container');
            if (containers.length > 0) {
                clearInterval(checkExist);
                callback();
            } else if (retries >= maxRetries) {
                clearInterval(checkExist);
                console.error('Timeout: room-container elements not found.');
            }
            retries++;
        }, interval);
    }

    // Process API response and inject inventory_type
    function processApiResponse(data) {
        try {
            const roomData = data.data.hotel_data[0].room_data;

            // Iterate through the room data from API
            roomData.forEach(apiRoom => {
                const apiTitle = apiRoom.rate_data[0]?.title; // Get the title
                const apiPrice = apiRoom.rate_data[0]?.price_details.display_price; // Get the price
                const inventoryType = apiRoom.rate_data[0]?.inventory_type; // Get the inventory type
                const apiPaymentType = apiRoom.rate_data[0]?.payment_type; // Get payment type (POSTPAID, PREPAID)
                const apiDescription = apiRoom.rate_data[0]?.description.trim(); // Get description

                // Determine payment type string from API
                const apiPaymentText = apiPaymentType === "PREPAID"
                    ? "Prepaid - Book Now, Pay Now"
                    : "Book now, pay when you stay";

                // console.log(`title ${apiTitle}, price ${apiPrice}, inventoryType ${inventoryType}`);

                // Match the API data with DOM elements
                document.querySelectorAll('.room-container').forEach(container => {
                    const roomTitle = container.querySelector('.h5.regular')?.textContent.trim();
                    const roomPriceText = container.querySelector('.price-position .payment-span')?.textContent.trim();
                    const roomPrice = roomPriceText ? parseFloat(roomPriceText.replace("$", "").replace(",", "").split(" ")[0]) : NaN;

                    // Dynamically locate payment type element
                    const paymentTypeElement = Array.from(container.querySelectorAll('li'))
                        .find(li => li.id.startsWith('room-payment-type'));
                    const roomPaymentText = paymentTypeElement ? paymentTypeElement.textContent.trim() : '';

                    // Dynamically locate description element
                    const descriptionElement = container.querySelector('.col-sm-12 p');
                    const roomDescription = descriptionElement ? descriptionElement.textContent.trim() : '';

                    // console.log(`title ${roomTitle}, price ${roomPrice}`);

                    // Compare the API title and price with the page title and price
                    if (roomTitle === apiTitle && floatEquals(roomPrice, parseFloat(apiPrice))
                        && roomPaymentText.includes(apiPaymentText) && roomDescription === apiDescription) {
                        console.log(`Matched ${roomTitle}`);
                        // Append the inventory type to the room details
                        const detailsList = container.querySelector('.col-sm-5.details ul');
                        if (detailsList) {
                            const inventoryItem = document.createElement('li');
                            inventoryItem.className = 'inventory-type';
                            inventoryItem.innerHTML = `<strong>Inventory Type:</strong> ${inventoryType}`;
                            detailsList.appendChild(inventoryItem);
                        }
                    }
                });
            });
        } catch (err) {
            console.error("Error processing API response:", err);
        }
    }
})();
