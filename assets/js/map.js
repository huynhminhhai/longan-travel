$(document).ready(function () {
    if ($('#map').length > 0) {
        const map = L.map('map').setView([10.5333, 106.4167], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        const markers = L.layerGroup().addTo(map);

        const defaultIconOptions = {
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        };

        // Define icons outside the loadMarkers function to avoid re-creating them on each call
        const icons = {
            restaurant: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/128/948/948036.png',
                ...defaultIconOptions,
            }),
            hotel: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/128/3009/3009489.png',
                ...defaultIconOptions,
            }),
            tourist: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/128/7060/7060110.png',
                ...defaultIconOptions,
            }),
            default: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/128/1483/1483336.png',
                ...defaultIconOptions,
            })
        };

        // Get marker bounds
        function getMarkersBounds(layerGroup) {
            const bounds = L.latLngBounds();
            layerGroup.eachLayer(layer => {
                if (layer.getLatLng) {
                    bounds.extend(layer.getLatLng());
                }
            });
            return bounds;
        }

        function loadMarkers(type) {
            markers.clearLayers();
            const icon = icons[type] || icons.default; // Use the appropriate icon

            const activeTabPane = document.querySelector(`#${type}-map`);
            const items = activeTabPane.querySelectorAll('.map-item');

            items.forEach(item => {
                const lat = parseFloat(item.getAttribute('data-lat'));
                const lng = parseFloat(item.getAttribute('data-lng'));
                const img = item.querySelector('img').src;
                const name = item.querySelector('.name').textContent;
                const address = item.querySelector('.address').textContent;

                const marker = L.marker([lat, lng], { icon }).addTo(markers).bindPopup(`
                    <div class="card">
                        <div class="card-img">
                            <img src="${img}" alt="${name}" />
                        </div>
                        <div class="card-body">
                            <div class="card-title">${name}</div>
                            <div class="card-text">
                                <div>${address}</div>
                                <a href="https://maps.google.com/?q=${lat},${lng}">Google Map</a>
                            </div>
                        </div>
                    </div>
                `);
                item._marker = marker;
            });

            const bounds = getMarkersBounds(markers);
            if (bounds.isValid()) {
                map.fitBounds(bounds, {
                    paddingTopLeft: [0, 100],
                    maxZoom: 14
                });
            }
        }

        // Event listener for tab changes
        document.querySelectorAll('.map-nav-item').forEach(navItem => {
            navItem.querySelector('button').addEventListener('shown.bs.tab', function () {
                const type = navItem.getAttribute('data-type');
                loadMarkers(type);
            });
        });

        // Click event for map items
        document.querySelectorAll('.map-item').forEach(item => {
            item.addEventListener('click', function () {
                const lat = parseFloat(this.getAttribute('data-lat'));
                const lng = parseFloat(this.getAttribute('data-lng'));
                map.setView([lat, lng], 15);

                if (this._marker) {
                    this._marker.openPopup();
                }
            });
        });

        // Load default markers on initial load
        loadMarkers('restaurant');
    }
});
