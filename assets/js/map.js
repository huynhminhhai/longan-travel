$(document).ready(function () {
    if ($('#map').length > 0) {
        const map = L.map('map').setView([10.5333, 106.4167], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        const markers = L.layerGroup().addTo(map);
        let routingControl = null;

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
            shopping: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/128/2331/2331970.png',
                ...defaultIconOptions,
            }),
            oil: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/128/1791/1791150.png',
                ...defaultIconOptions,
            }),
            atm: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/128/3016/3016352.png',
                ...defaultIconOptions,
            }),
            hospital: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/128/3448/3448513.png',
                ...defaultIconOptions,
            }),
            taxi: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/128/2401/2401174.png',
                ...defaultIconOptions,
            }),
            market: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/128/862/862819.png',
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

        function showRoute(destLat, destLng) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    console.log("Vị trí người dùng:", userLat, userLng);
                    console.log("Điểm đến:", destLat, destLng);
        
                    if (routingControl) {
                        map.removeControl(routingControl);
                    }
        
                    const customFormatter = L.Util.extend({}, L.Routing.Formatter.prototype, {
                        formatDistance: function(distance) {
                            return distance >= 1000 ? (distance / 1000).toFixed(1) + " km" : distance + " m";
                        },
                        formatTime: function(time) {
                            const minutes = Math.round(time / 60);
                            return minutes >= 60 ? Math.floor(minutes / 60) + " giờ " + (minutes % 60) + " phút" : minutes + " phút";
                        },
                        formatInstruction: function(instr, i) {
                            const directions = {
                                "Head": "Đi thẳng",
                                "Turn left": "Rẽ trái",
                                "Turn right": "Rẽ phải",
                                "Slight left": "Rẽ trái nhẹ",
                                "Slight right": "Rẽ phải nhẹ",
                                "Continue": "Tiếp tục",
                                "Enter roundabout": "Vào vòng xuyến",
                                "Exit roundabout": "Ra khỏi vòng xuyến",
                                "Arrive": "Đến nơi"
                            };
                            const direction = directions[instr.text] || instr.text;
                            return `${i + 1}. ${direction} (${this.formatDistance(instr.distance)})`;
                        }
                    });
        
                    routingControl = L.Routing.control({
                        waypoints: [
                            L.latLng(userLat, userLng),
                            L.latLng(destLat, destLng)
                        ],
                        routeWhileDragging: true,
                        lineOptions: { styles: [{ color: 'blue', weight: 4 }] },
                        show: true,
                        formatter: customFormatter,
                        summaryTemplate: '<h2>{name}</h2><h3>{distance} - {time}</h3>',
                        instructionsTemplate: `
                            <table class="routing-instructions">
                                <thead>
                                    <tr><th>Bước</th><th>Khoảng cách</th><th>Hướng dẫn</th></tr>
                                </thead>
                                <tbody>{instructions}</tbody>
                            </table>
                        `
                    }).addTo(map);
        
                    L.marker([userLat, userLng], {
                        icon: icons.default
                    }).addTo(markers).bindPopup("Bạn đang ở đây").openPopup();
        
                    // Tạo bounds từ waypoints
                    const waypoints = routingControl.getWaypoints();
                    const bounds = L.latLngBounds(waypoints.map(wp => wp.latLng));
                    map.fitBounds(bounds, { padding: [50, 50] });
                }, function(error) {
                    alert("Lỗi định vị: " + error.message);
                }, {
                    enableHighAccuracy: true,
                    timeout: 30000,
                    maximumAge: 0
                });
            } else {
                alert("Trình duyệt không hỗ trợ định vị!");
            }
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
                                <div><strong>Địa chỉ:</strong> ${address}</div>
                                <a href="https://maps.google.com/?q=${lat},${lng}" target="_blank">Xem trên Google Maps</a>
                                <br>
                                <button class="btn-route" data-lat="${lat}" data-lng="${lng}">Chỉ đường</button>
                            </div>
                        </div>
                    </div>
                `);
        
                marker.on('popupopen', function() {
                    const btn = marker.getPopup().getElement().querySelector('.btn-route');
                    btn.addEventListener('click', function() {
                        showRoute(lat, lng);
                    });
                });
        
                item._marker = marker;
                allMarkers.push(marker);
            });
        
            const bounds = getMarkersBounds(markers);
            if (bounds.isValid()) {
                map.fitBounds(bounds, { paddingTopLeft: [0, 100], maxZoom: 14 });
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
                textPlaceholder: 'Tìm kiếm địa điểm...', // Đã là tiếng Việt
                textErr: 'Không tìm thấy địa điểm',     // Đã là tiếng Việt
                textCancel: 'Hủy'                       // Đã là tiếng Việt
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