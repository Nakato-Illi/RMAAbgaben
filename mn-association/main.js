document.addEventListener('DOMContentLoaded', function () {
    const continentSpans = document.querySelectorAll('.mark');
    continentSpans.forEach(span => {
        span.addEventListener('click', function () {
            const imageUrl = span.getAttribute('data-image');
            const markerClass = span.getAttribute('data-marker');
            changeContinent(imageUrl, markerClass);
        });
    });

    // Add event listener for the back button
    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', function () {
        // Reset to the global map
        document.querySelector('.world-map').style.backgroundImage = `url("assets/img/global1.jpg")`;

        const markers = document.querySelectorAll('.marker > div');
        markers.forEach(marker => {
            marker.style.display = 'none';
        });

        // Display the global marker
        const globalMarker = document.querySelector('.global-marker');
        if (globalMarker) {
            globalMarker.style.display = 'block';
        }
    });
});

function changeContinent(imageUrl, markerClass) {
    document.querySelector('.world-map').style.backgroundImage = `url(${imageUrl})`;

    const markers = document.querySelectorAll('.marker > div');
    markers.forEach(marker => {
        marker.style.display = 'none';
    });

    const selectedMarker = document.querySelector(`.${markerClass}`);
    if (selectedMarker) {
        selectedMarker.style.display = 'block';
    }
}
