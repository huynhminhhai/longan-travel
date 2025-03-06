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
            bus: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/128/1042/1042263.png',
                ...defaultIconOptions,
            }),
            default: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/128/1483/1483336.png',
                ...defaultIconOptions,
            })
        };

        let allMarkers = [];

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
            allMarkers = [];

            const icon = icons[type] || icons.default;
            const activeTabPane = document.querySelector(`#${type}-map`);
            const items = activeTabPane.querySelectorAll('.map-item');

            items.forEach(item => {
                const lat = parseFloat(item.getAttribute('data-lat'));
                const lng = parseFloat(item.getAttribute('data-lng'));
                const img = item.querySelector('img').src;
                const name = item.querySelector('.name').textContent;
                const address = item.querySelector('.address').textContent;

                const marker = L.marker([lat, lng], {
                    icon,
                    title: name,
                    alt: address
                }).addTo(markers).bindPopup(`
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
                allMarkers.push(marker);
            });

            const bounds = getMarkersBounds(markers);
            if (bounds.isValid()) {
                map.fitBounds(bounds, {
                    paddingTopLeft: [0, 100],
                    maxZoom: 14
                });
            }

            if (map.searchControl) {
                map.removeControl(map.searchControl);
            }
            addSearchControl();
        }

        function addSearchControl() {
            map.searchControl = new L.Control.Search({
                layer: markers,
                initial: false,
                propertyName: 'title',
                marker: false,
                caseSensitive: false,
                filter: function (searchText, marker) {
                    return marker.options.title.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
                },
                moveToLocation: function (latlng, name, map) {
                    map.setView(latlng, 15);
                    markers.eachLayer(function(layer) {
                        if (layer.options.title === name) {
                            layer.openPopup();
                        }
                    });
                },
                textPlaceholder: 'Tìm kiếm địa điểm...',
                textErr: 'Không tìm thấy địa điểm',
                textCancel: 'Hủy',
            });

            map.addControl(map.searchControl);
        }

        document.querySelectorAll('.map-nav-item').forEach(navItem => {
            navItem.querySelector('button').addEventListener('shown.bs.tab', function () {
                const type = navItem.getAttribute('data-type');
                loadMarkers(type);
            });
        });

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

        function getFirstTabType() {
            const firstTab = document.querySelector('.map-nav-item:first-child');
            return firstTab ? firstTab.getAttribute('data-type') : 'restaurant';
        }

        const initialType = getFirstTabType();
        loadMarkers(initialType);
    }
});