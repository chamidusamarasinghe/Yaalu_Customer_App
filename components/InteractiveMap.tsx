import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  type?: 'pickup' | 'drop' | 'driver';
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

  // Rock-solid Leaflet.js HTML with OpenStreetMap Tiles
  const leafletMapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        html, body, #map {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          background: #e2e8f0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .leaflet-container {
          background: #e2e8f0 !important;
        }
        .custom-pin-pickup {
          background-color: #061138;
          color: #fdb813;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          border: 2px solid #fdb813;
          white-space: nowrap;
          text-align: center;
        }
        .custom-pin-drop {
          background-color: #ea580c;
          color: white;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          border: 2px solid white;
          white-space: nowrap;
          text-align: center;
        }
        .custom-pin-driver {
          background-color: #fdb813;
          color: #061138;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          border: 2px solid #061138;
          white-space: nowrap;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var initialLat = ${mapCenter.latitude};
        var initialLng = ${mapCenter.longitude};

        var map = L.map('map', {
          center: [initialLat, initialLng],
          zoom: ${zoom},
          zoomControl: false,
          attributionControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          subdomains: ['a', 'b', 'c']
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        function notifyLocationSelected(lat, lng) {
          var msg = JSON.stringify({ type: 'location_selected', lat: lat, lng: lng });
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(msg);
          }
          if (window.parent && window.parent.postMessage) {
            window.parent.postMessage(msg, '*');
          }
        }

        var markersData = ${JSON.stringify(validMarkers)};
        var latLngs = [];

        markersData.forEach(function(m) {
          var pinType = m.type || 'pickup';
          var className = pinType === 'drop' ? 'custom-pin-drop' : (pinType === 'driver' ? 'custom-pin-driver' : 'custom-pin-pickup');
          var labelHtml = (pinType === 'drop' ? '🎯 ' : (pinType === 'driver' ? '🛵 ' : '📍 ')) + (m.title || 'Location');

          var customIcon = L.divIcon({
            className: 'leaflet-div-icon',
            html: '<div class="' + className + '">' + labelHtml + '</div>',
            iconSize: [120, 36],
            iconAnchor: [60, 18]
          });

          L.marker([m.latitude, m.longitude], { icon: customIcon }).addTo(map);
          latLngs.push([m.latitude, m.longitude]);
        });

        var polyline = null;
        if (${showRoute} && latLngs.length >= 2) {
          polyline = L.polyline(latLngs, {
            color: '#061138',
            weight: 5,
            opacity: 0.85,
            dashArray: '8, 8'
          }).addTo(map);

          try {
            map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
          } catch(e) {}
        } else if (latLngs.length === 1) {
          map.setView(latLngs[0], 14);
        }

        if (${interactivePicker}) {
          map.on('click', function(e) {
            notifyLocationSelected(e.latlng.lat, e.latlng.lng);
          });
        }

        setTimeout(function() {
          map.invalidateSize();
          if (polyline) {
            try {
              map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
            } catch(e) {}
          }
        }, 300);
      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWebMessage = (event: MessageEvent) => {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data && data.type === 'location_selected' && onLocationSelect) {
            onLocationSelect(data.lat, data.lng);
          }
        } catch (e) {}
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
    } catch (e) {}
  };

  return (
    <View style={[styles.container, { height: height as any }]}>
      {Platform.OS === 'web' ? (
        <iframe
          srcDoc={leafletMapHtml}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="OpenStreetMap Location Picker"
        />
      ) : (
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: leafletMapHtml }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={handleMessage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#CBD5E1',
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
