const temperatureInput = document.getElementById("temperatureInput");
const unitSelect = document.getElementById("unitSelect");
const convertBtn = document.getElementById("convertBtn");

const celsiusResult = document.getElementById("celsiusResult");
const fahrenheitResult = document.getElementById("fahrenheitResult");
const kelvinResult = document.getElementById("kelvinResult");

const errorMessage = document.getElementById("errorMessage");

function formatNumber(value) {
    return Number(value.toFixed(2));
}

function convertTemperature() {

    const value = temperatureInput.value.trim();
    const unit = unitSelect.value;

    // Empty input
    if (value === "") {
        errorMessage.textContent = "Please enter a temperature.";
        resetResults();
        return;
    }

    const temperature = Number(value);

    // Invalid number
    if (!Number.isFinite(temperature)) {
        errorMessage.textContent = "Please enter a valid number.";
        resetResults();
        return;
    }

    let celsius;

    // Convert input to Celsius
    if (unit === "C") {
        celsius = temperature;
    } 
    else if (unit === "F") {
        celsius = (temperature - 32) * 5 / 9;
    } 
    else {
        celsius = temperature - 273.15;
    }

    // Absolute zero check
    if (celsius < -273.15) {
        errorMessage.textContent =
            "Temperature cannot be below absolute zero (-273.15°C).";

        resetResults();
        return;
    }

    // Convert Celsius to other units
    const fahrenheit = (celsius * 9 / 5) + 32;
    const kelvin = celsius + 273.15;

    errorMessage.textContent = "";

    celsiusResult.textContent = formatNumber(celsius);
    fahrenheitResult.textContent = formatNumber(fahrenheit);
    kelvinResult.textContent = formatNumber(kelvin);
}

function resetResults() {
    celsiusResult.textContent = "—";
    fahrenheitResult.textContent = "—";
    kelvinResult.textContent = "—";
}

convertBtn.addEventListener("click", convertTemperature);

temperatureInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        convertTemperature();
    }
});