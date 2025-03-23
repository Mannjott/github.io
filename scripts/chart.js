"use strict";
function initializeChart() {
    const canvas = document.getElementById('visitorChart');
    if (!canvas) {
        console.log('Canvas not found, waiting...');
        setTimeout(initializeChart, 100); // Try again in 100ms
        return;
    }
    console.log('Canvas found, creating chart...');
    fetch('/data/chart.json')
        .then(response => response.json())
        .then(data => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                            label: 'Visitors',
                            data: data.visitors,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    })
        .catch(error => console.error('Error:', error));
}
// Start the initialization process
initializeChart();
//# sourceMappingURL=chart.js.map