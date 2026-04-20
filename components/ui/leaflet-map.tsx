import React from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

export type MapMarker = {
  id: number | string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
};

type Props = {
  markers: MapMarker[];
  height?: number;
  initialLat?: number;
  initialLng?: number;
  zoom?: number;
};

function buildHtml(markers: MapMarker[], lat: number, lng: number, zoom: number): string {
  const markersJson = JSON.stringify(markers);
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
    .leaflet-popup-content-wrapper {
      border-radius: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .leaflet-popup-content b { color: #10B981; }
    .leaflet-popup-content p { color: #64748B; font-size: 12px; margin-top: 4px; }
  </style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map', { zoomControl: true }).setView([${lat}, ${lng}], ${zoom});

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  var greenIcon = L.divIcon({
    html: '<div style="background:#10B981;width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -12],
  });

  var markers = ${markersJson};
  markers.forEach(function(m) {
    L.marker([m.latitude, m.longitude], { icon: greenIcon })
      .addTo(map)
      .bindPopup('<b>' + m.title + '</b>' + (m.description ? '<p>' + m.description + '</p>' : ''));
  });

  if (markers.length > 1) {
    var group = L.featureGroup(markers.map(function(m) {
      return L.marker([m.latitude, m.longitude]);
    }));
    map.fitBounds(group.getBounds().pad(0.2));
  }
</script>
</body>
</html>`;
}

export default function LeafletMap({
  markers,
  height = 280,
  initialLat = 14.5995,
  initialLng = 120.9842,
  zoom = 12,
}: Props) {
  const centerLat = markers[0]?.latitude ?? initialLat;
  const centerLng = markers[0]?.longitude ?? initialLng;

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        source={{ html: buildHtml(markers, centerLat, centerLng, zoom) }}
        style={styles.webview}
        originWhitelist={["*"]}
        scrollEnabled={false}
        javaScriptEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
  },
});
