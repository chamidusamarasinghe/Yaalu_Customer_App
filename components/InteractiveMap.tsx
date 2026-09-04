import React, { useRef } from 'react';
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

  // Pure OpenStreetMap implementation using OpenLayers (ol.js & ol.source.OSM)
  const openStreetMapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v9.2.4/ol.css" />
      <script src="https://cdn.jsdelivr.net/npm/ol@v9.2.4/dist/ol.js"></script>
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
          cursor: pointer;
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
          cursor: pointer;
        }
        .custom-pin-driver {
          background-color: #fdb813;
          color: #061138;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 2px solid #061138;
          text-align: center;
          white-space: nowrap;
        }
        .ol-zoom {
          top: auto !important;
          bottom: 15px !important;
          right: 15px !important;
          left: auto !important;
        }
        .ol-zoom button {
          background-color: #061138 !important;
          color: #ffffff !important;
          border-radius: 8px !important;
          width: 32px !important;
          height: 32px !important;
          font-size: 16px !important;
          margin: 2px !important;
          border: none !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var initialLng = ${center.longitude};
        var initialLat = ${center.latitude};

        // OpenStreetMap Layer via OpenLayers OSM Source
        var osmLayer = new ol.layer.Tile({
          source: new ol.source.OSM()
        });

        var mapView = new ol.View({
          center: ol.proj.fromLonLat([initialLng, initialLat]),
          zoom: ${zoom}
        });

        var map = new ol.Map({
          target: 'map',
          layers: [osmLayer],
          view: mapView,
          controls: ol.control.defaults.defaults({ attribution: false })
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

        // Render Markers using OpenLayers Overlays
        var markersData = ${JSON.stringify(markers)};
        markersData.forEach(function(m) {
          var el = document.createElement('div');
          var pinType = m.type || 'pickup';
          el.className = pinType === 'drop' ? 'custom-pin-drop' : (pinType === 'driver' ? 'custom-pin-driver' : 'custom-pin-pickup');
          el.innerHTML = (pinType === 'driver' ? '🛵 ' : '📍 ') + (m.title || 'Location');

          var overlay = new ol.Overlay({
            element: el,
            positioning: 'bottom-center',
            stopEvent: false,
            position: ol.proj.fromLonLat([m.longitude, m.latitude])
          });
          map.addOverlay(overlay);
        });

        // Interactive Picker Logic
        if (${interactivePicker}) {
          map.on('click', function(evt) {
            var lonlat = ol.proj.toLonLat(evt.coordinate);
            var lng = lonlat[0];
            var lat = lonlat[1];
            notifyLocationSelected(lat, lng);
          });
        }

        // Render Route Line if enabled
        if (${showRoute} && markersData.length >= 2) {
          var coords = markersData.map(function(m) {
            return ol.proj.fromLonLat([m.longitude, m.latitude]);
          });
          var routeFeature = new ol.Feature({
            geometry: new ol.geom.LineString(coords)
          });
          var routeLayer = new ol.layer.Vector({
            source: new ol.source.Vector({ features: [routeFeature] }),
            style: new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: '#061138',
                width: 5,
                lineDash: [8, 8]
              })
            })
          });
          map.addLayer(routeLayer);
          map.getView().fit(routeFeature.getGeometry().getExtent(), { padding: [40, 40, 40, 40] });
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
          srcDoc={openStreetMapHtml}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="OpenStreetMap Location Picker"
        />
      ) : (
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: openStreetMapHtml }}
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

