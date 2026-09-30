import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  type?: 'pickup' | 'drop' | 'driver' | 'vehicle' | string;
  vehicleType?: string;
  blinking?: boolean;
}

interface InteractiveMapProps {
  height?: number | string;
  center?: { latitude: number; longitude: number };
  zoom?: number;
  markers?: MapMarker[];
  showRoute?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  interactivePicker?: boolean;
}

export default function InteractiveMap({
  height = 300,
  center = { latitude: 6.9271, longitude: 79.8612 }, // Default Colombo center view
  zoom = 14,
  markers = [],
  showRoute = false,
  onLocationSelect,
  interactivePicker = true,
}: InteractiveMapProps) {
  const webViewRef = useRef<WebView>(null);

  // Auto-recenter view on active markers if present
  const validMarkers = markers.filter(
    (m) => m && typeof m.latitude === 'number' && typeof m.longitude === 'number' && !isNaN(m.latitude) && !isNaN(m.longitude)
  );

  const mapCenter = validMarkers.length > 0
    ? { latitude: validMarkers[0].latitude, longitude: validMarkers[0].longitude }
    : center;

  // Pure OpenStreetMap HTML powered by OpenLayers JS engine (No Leaflet dependency)
  const openStreetMapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v7.5.0/ol.css" />
      <script src="https://cdn.jsdelivr.net/npm/ol@v7.5.0/dist/ol.js"></script>
      <style>
        html, body, #map {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          background: #e2e8f0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .ol-control button {
          background-color: #0B1044 !important;
          color: #FFC72C !important;
          font-weight: bold;
          border-radius: 8px !important;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes blink-pulse {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.45; filter: brightness(1.4); }
        }
        .custom-pin-pickup {
          background: linear-gradient(135deg, #0B1044 0%, #1E293B 100%);
          color: #FFC72C;
          padding: 6px 14px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          border: 2px solid #FFC72C;
          white-space: nowrap;
          text-align: center;
          transform: translate(-50%, -50%);
        }
        .custom-pin-drop {
          background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
          color: white;
          padding: 6px 14px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          border: 2px solid white;
          white-space: nowrap;
          text-align: center;
          transform: translate(-50%, -50%);
        }
        .custom-pin-driver {
          background: linear-gradient(135deg, #FDB813 0%, #D97706 100%);
          color: #0B1044;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 900;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          border: 2px solid #0B1044;
          white-space: nowrap;
          text-align: center;
          transform: translate(-50%, -50%);
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var initialLat = ${mapCenter.latitude};
        var initialLng = ${mapCenter.longitude};
        var initialCenter = ol.proj.fromLonLat([initialLng, initialLat]);

        var map = new ol.Map({
          target: 'map',
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            })
          ],
          view: new ol.View({
            center: initialCenter,
            zoom: ${zoom}
          }),
          controls: ol.control.defaults.defaults({ zoom: true, attribution: false })
        });

        function notifyLocationSelected(lat, lng) {
          var msg = JSON.stringify({ type: 'location_selected', lat: lat, lng: lng });
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(msg);
          }
          if (window.parent && window.parent.postMessage) {
            window.parent.postMessage(msg, '*');
          }
        }

        function getVehicleIconAndColor(vType) {
          var clean = (vType || '').toString().trim().toLowerCase();
          if (clean === 'bike' || clean === 'motorbike' || clean === 'courier') {
            return { icon: '🏍️', color: '#FDB813', bg: '#061138', name: 'Bike' };
          }
          if (clean === 'flex' || clean === 'three_wheel' || clean === 'tuk' || clean === 'tuktuk' || clean === 'threewheel') {
            return { icon: '🛺', color: '#10B981', bg: '#061138', name: 'Tuk-Tuk' };
          }
          if (clean === 'mini' || clean === 'car' || clean === 'taxi' || clean === 'normal_car' || clean === 'cab' || clean === 'sedan') {
            return { icon: '🚗', color: '#3B82F6', bg: '#061138', name: 'Car' };
          }
          if (clean === 'luxury' || clean === 'luxury_car' || clean === 'premium' || clean === 'lux') {
            return { icon: '🚘', color: '#F59E0B', bg: '#0F172A', name: 'Luxury' };
          }
          if (clean === 'van' || clean === 'cargo' || clean === 'large') {
            return { icon: '🚐', color: '#8B5CF6', bg: '#061138', name: 'Van' };
          }
          return { icon: '🚗', color: '#FDB813', bg: '#061138', name: 'Rider' };
        }

        var markersData = ${JSON.stringify(validMarkers)};
        var olCoords = [];

        markersData.forEach(function(m) {
          var pinType = m.type || 'pickup';
          var el;

          if (pinType === 'vehicle' || m.vehicleType) {
            var vehInfo = getVehicleIconAndColor(m.vehicleType || pinType);
            var isBlinking = m.blinking !== false; // Blink by default for active searching vehicle icons
            var animStyle = isBlinking ? 'animation: blink-pulse 1.2s infinite ease-in-out;' : '';

            var wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.alignItems = 'center';
            wrapper.style.transform = 'translate(-50%, -100%)';

            wrapper.innerHTML = \`
              <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: \${vehInfo.color}3D; border: 2.5px solid \${vehInfo.color}; animation: pulse-ring 2s infinite ease-out; bottom: -8px; z-index: 1;"></div>
              <div style="display: flex; align-items: center; gap: 6px; background: linear-gradient(135deg, \${vehInfo.bg} 0%, #1E293B 100%); color: #FFFFFF; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; box-shadow: 0 6px 16px rgba(0,0,0,0.4); border: 2.5px solid \${vehInfo.color}; white-space: nowrap; z-index: 2; \${animStyle}">
                <span style="font-size: 18px; line-height: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">\${vehInfo.icon}</span>
                \${m.title ? '<span>' + m.title + '</span>' : ''}
              </div>
              <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid \${vehInfo.color}; margin-top: -1px; z-index: 2;"></div>
            \`;

            el = wrapper;
          } else {
            var className = pinType === 'drop' ? 'custom-pin-drop' : (pinType === 'driver' ? 'custom-pin-driver' : 'custom-pin-pickup');
            var labelHtml = (pinType === 'driver' ? '🛵 ' : (pinType === 'drop' ? '🎯 ' : '🏬 ')) + (m.title || 'Location');

            el = document.createElement('div');
            el.className = className;
            el.innerHTML = labelHtml;
          }


          var coord = ol.proj.fromLonLat([m.longitude, m.latitude]);
          olCoords.push(coord);

          var overlay = new ol.Overlay({
            position: coord,
            positioning: 'center-center',
            element: el,
            stopEvent: false
          });
          map.addOverlay(overlay);
        });


        if (${showRoute} && olCoords.length >= 2) {
          var startM = markersData[0];
          var endM = markersData[markersData.length - 1];
          var osrmUrl = 'https://router.project-osrm.org/route/v1/driving/' + startM.longitude + ',' + startM.latitude + ';' + endM.longitude + ',' + endM.latitude + '?overview=full&geometries=geojson';

          fetch(osrmUrl)
            .then(function(res) { return res.json(); })
            .then(function(data) {
              if (data && data.routes && data.routes.length > 0 && data.routes[0].geometry && data.routes[0].geometry.coordinates) {
                var roadCoords = data.routes[0].geometry.coordinates.map(function(pt) {
                  return ol.proj.fromLonLat([pt[0], pt[1]]);
                });
                drawRoutePolyline(roadCoords);
              } else {
                drawRoutePolyline(olCoords);
              }
            })
            .catch(function() {
              drawRoutePolyline(olCoords);
            });
        } else if (olCoords.length === 1) {
          map.getView().setCenter(olCoords[0]);
          map.getView().setZoom(${zoom});
        }

        function drawRoutePolyline(coords) {
          var routeFeature = new ol.Feature({
            geometry: new ol.geom.LineString(coords)
          });

          var routeStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: '#2563EB',
              width: 5
            })
          });

          var vectorSource = new ol.source.Vector({
            features: [routeFeature]
          });

          var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: routeStyle
          });

          map.addLayer(vectorLayer);

          try {
            map.getView().fit(vectorSource.getExtent(), { padding: [45, 45, 45, 45], maxZoom: 16 });
          } catch(e) {}
        }

        if (${interactivePicker}) {
          map.on('click', function(evt) {
            var lonLat = ol.proj.toLonLat(evt.coordinate);
            notifyLocationSelected(lonLat[1], lonLat[0]);
          });
        }

        setTimeout(function() {
          map.updateSize();
        }, 300);
      </script>
    </body>
    </html>
  `;

  // Listen for Web iframe messages
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleWebMessage = (e: MessageEvent) => {
        try {
          const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
          if (data && data.type === 'location_selected' && onLocationSelect) {
            onLocationSelect(data.lat, data.lng);
          }
        } catch {
          // ignore parsing error
        }
      };
      window.addEventListener('message', handleWebMessage);
      return () => window.removeEventListener('message', handleWebMessage);
    }
  }, [onLocationSelect]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'location_selected' && onLocationSelect) {
        onLocationSelect(data.lat, data.lng);
      }
    } catch (e) {
      // Ignore parse errors
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { height: height as any }]}>
        {React.createElement('iframe', {
          srcDoc: openStreetMapHtml,
          style: { width: '100%', height: '100%', border: 'none' },
          title: 'OpenStreetMap Live Navigation Map',
        })}
      </View>
    );
  }

  return (
    <View style={[styles.container, { height: height as any }]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: openStreetMapHtml }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#CBD5E1',
    overflow: 'hidden',
    borderRadius: 16,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
