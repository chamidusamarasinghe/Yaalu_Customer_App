import React, { useRef } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
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
  center = { latitude: 6.9271, longitude: 79.8612 }, // Default Colombo
  zoom = 14,
  markers = [
    { id: '1', latitude: 6.9271, longitude: 79.8612, title: 'Selected Location', type: 'pickup' },
  ],
  showRoute = false,
  onLocationSelect,
  interactivePicker = true,
}: InteractiveMapProps) {
  const webViewRef = useRef<WebView>(null);

  const leafletHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html, #map {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background-color: #e2e8f0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .custom-pin-pickup {
          background-color: #061138;
          color: #fdb813;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 2px solid #fdb813;
          text-align: center;
          white-space: nowrap;
        }
        .custom-pin-drop {
          background-color: #ea580c;
          color: white;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 2px solid white;
          text-align: center;
          white-space: nowrap;
        }
        .custom-pin-driver {
          background-color: #fdb813;
          color: #061138;
          padding: 6px;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 2px solid #061138;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: false,
          attributionControl: false
        }).setView([${center.latitude}, ${center.longitude}], ${zoom});

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        var pickerMarker = null;

        function createPinIcon(title) {
          return L.divIcon({
            className: 'custom-pin-pickup',
            html: '📍 ' + title,
            iconSize: null
          });
        }

        var initialLat = ${center.latitude};
        var initialLng = ${center.longitude};

        pickerMarker = L.marker([initialLat, initialLng], {
          icon: createPinIcon('${markers[0]?.title || 'Selected Location'}'),
          draggable: ${interactivePicker}
        }).addTo(map);

        if (${interactivePicker}) {
          map.on('click', function(e) {
            var lat = e.latlng.lat;
            var lng = e.latlng.lng;
            pickerMarker.setLatLng([lat, lng]);
            
            var msg = JSON.stringify({ type: 'location_selected', lat: lat, lng: lng });
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(msg);
            }
            if (window.parent && window.parent.postMessage) {
              window.parent.postMessage(msg, '*');
            }
          });

          pickerMarker.on('dragend', function(e) {
            var position = pickerMarker.getLatLng();
            var msg = JSON.stringify({ type: 'location_selected', lat: position.lat, lng: position.lng });
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(msg);
            }
            if (window.parent && window.parent.postMessage) {
              window.parent.postMessage(msg, '*');
            }
          });
        }

        if (${showRoute} && ${markers.length} >= 2) {
          var points = ${JSON.stringify(markers.map((m) => [m.latitude, m.longitude]))};
          var polyline = L.polyline(points, {
            color: '#061138',
            weight: 5,
            opacity: 0.8,
            dashArray: '8, 8'
          }).addTo(map);
          map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
        }
      </script>
    </body>
    </html>
  `;

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

  return (
    <View style={[styles.container, { height: height as any }]}>
      {Platform.OS === 'web' ? (
        <iframe
          srcDoc={leafletHtml}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Interactive Map Location Picker"
        />
      ) : (
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: leafletHtml }}
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
