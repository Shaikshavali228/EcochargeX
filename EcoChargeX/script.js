document.getElementById("toggleMode").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
});

// Function to calculate charging efficiency
function calculateCharging() {
    let sunHours = parseFloat(document.getElementById("sunHours").value);
    let sunTemp = parseFloat(document.getElementById("sunTemp").value);
    let deviceConsumption = parseFloat(document.getElementById("deviceConsumption").value);

    if (isNaN(sunHours) || isNaN(sunTemp) || isNaN(deviceConsumption) || sunHours <= 0 || deviceConsumption <= 0) {
        document.getElementById("result").innerHTML = "Please enter valid values.";
        return;
    }

    let baseEfficiency = 22;
    let additionalEfficiency = (sunTemp - 25) * 0.1;
    let totalEfficiency = Math.max(baseEfficiency + additionalEfficiency, 10); // Minimum efficiency is 10%
    
    let solarPanelPower = 5; // 5W solar panel
    let chargePower = (totalEfficiency / 100) * sunHours * solarPanelPower;
    let chargeGained = chargePower * 200;

    let batteryLife = chargeGained / deviceConsumption;

    document.getElementById("result").innerHTML = `
        <strong>Efficiency:</strong> ${totalEfficiency.toFixed(2)}%<br>
        <strong>Charge Gained:</strong> ${chargeGained.toFixed(2)} mAh<br>
        <strong>Battery Life:</strong> ${batteryLife.toFixed(2)} hours
    `;

    updateBatteryStatus(chargeGained);
    updateEfficiencyChart(totalEfficiency);
}

// Update battery status bar
function updateBatteryStatus(chargeGained) {
    let batteryPercentage = Math.min((chargeGained / 10000) * 100, 100);
    document.getElementById("batteryFill").style.width = batteryPercentage + "%";
    document.getElementById("batteryFill").style.background = batteryPercentage > 50 ? "green" : batteryPercentage > 20 ? "orange" : "red";
}

// Efficiency Chart
function updateEfficiencyChart(efficiency) {
    let ctx = document.getElementById('efficiencyChart').getContext('2d');

    if (window.efficiencyChartInstance) {
        window.efficiencyChartInstance.destroy();
    }

    window.efficiencyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["25°C", "30°C", "35°C", "40°C", "45°C", "50°C"],
            datasets: [{
                label: 'Efficiency (%)',
                data: [22, 22.5, 23, 23.5, 24, efficiency],
                borderColor: 'orange',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}