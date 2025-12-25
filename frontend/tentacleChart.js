function drawTentacleChart(ctx, labels, openData, clickData, unsubData) {
    const tentaclePlugin = {
        id: 'tentacleEffect',
        afterDraw: chart => {
            const ctx = chart.ctx;
            chart.data.datasets.forEach((ds, dsIdx) => {
                const meta = chart.getDatasetMeta(dsIdx);
                ctx.save();
                ctx.globalAlpha = 0.18;
                ctx.strokeStyle = ds.tentacleColor || ds.borderColor;
                ctx.lineWidth = 12;
                meta.data.forEach((point, i) => {
                    if (i > 0) {
                        const prev = meta.data[i - 1];
                        ctx.beginPath();
                        ctx.moveTo(prev.x, prev.y);
                        const midX = (prev.x + point.x) / 2;
                        const midY = (prev.y + point.y) / 2 + 30 * Math.sin(i + dsIdx * 2);
                        ctx.bezierCurveTo(midX, midY, midX, midY, point.x, point.y);
                        ctx.stroke();
                    }
                });
                ctx.restore();
            });
        }
    };

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Open Rate',
                    data: openData,
                    borderColor: 'rgba(255,175,189,1)',
                    backgroundColor: 'rgba(255,195,113,0.2)',
                    tentacleColor: 'rgba(255,175,189,0.35)',
                    borderWidth: 4,
                    pointBackgroundColor: 'rgba(255,175,189,1)',
                    pointRadius: 8,
                    tension: 0.5,
                    fill: true,
                },
                {
                    label: 'Click Rate',
                    data: clickData,
                    borderColor: 'rgba(123,104,238,1)',
                    backgroundColor: 'rgba(123,104,238,0.13)',
                    tentacleColor: 'rgba(123,104,238,0.35)',
                    borderWidth: 4,
                    pointBackgroundColor: 'rgba(123,104,238,1)',
                    pointRadius: 8,
                    tension: 0.5,
                    fill: false,
                },
                {
                    label: 'Unsubscribed',
                    data: unsubData,
                    borderColor: 'rgba(255,99,132,1)',
                    backgroundColor: 'rgba(255,99,132,0.13)',
                    tentacleColor: 'rgba(255,99,132,0.35)',
                    borderWidth: 4,
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointRadius: 8,
                    tension: 0.5,
                    fill: false,
                }
            ]
        },
        options: {
            plugins: {
                legend: { display: true, labels: { font: { size: 16 } } }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#7b68ee', font: { size: 16 } }
                },
                y: {
                    grid: { color: 'rgba(123,104,238,0.07)' },
                    ticks: { color: '#ffafbd', font: { size: 16 } },
                    beginAtZero: true,
                    max: 100
                }
            }
        },
        plugins: [tentaclePlugin]
    });
}

// On DOMContentLoaded, replace chart placeholder with canvas and draw chart
window.addEventListener('DOMContentLoaded', function() {
    const chartContainer = document.querySelector('#analytics .chart-container');
    if (chartContainer) {
        // Remove placeholder
        const placeholder = chartContainer.querySelector('.chart-placeholder');
        if (placeholder) placeholder.remove();
        // Add canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'tentacleChart';
        canvas.width = 600;
        canvas.height = 320;
        chartContainer.appendChild(canvas);
        // Fetch analytics data from backend
        fetch('http://localhost:5000/api/analytics')
            .then(res => res.json())
            .then(data => {
                // Expecting data.performance_chart = { labels: [...], open: [...], click: [...], unsub: [...] }
                if (data && data.performance_chart) {
                    const labels = data.performance_chart.labels || [];
                    const openData = data.performance_chart.open || [];
                    const clickData = data.performance_chart.click || [];
                    const unsubData = data.performance_chart.unsub || [];
                    drawTentacleChart(canvas.getContext('2d'), labels, openData, clickData, unsubData);
                } else {
                    // fallback to dummy data if backend missing
                    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    const openData = [68, 72, 65, 80, 77, 85, 90];
                    const clickData = [24, 28, 22, 35, 30, 40, 45];
                    const unsubData = [2, 1, 3, 2, 4, 2, 1];
                    drawTentacleChart(canvas.getContext('2d'), labels, openData, clickData, unsubData);
                }
            })
            .catch(() => {
                // fallback to dummy data if fetch fails
                const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const openData = [68, 72, 65, 80, 77, 85, 90];
                const clickData = [24, 28, 22, 35, 30, 40, 45];
                const unsubData = [2, 1, 3, 2, 4, 2, 1];
                drawTentacleChart(canvas.getContext('2d'), labels, openData, clickData, unsubData);
            });
    }
});
