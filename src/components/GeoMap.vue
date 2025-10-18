
<template>
  <div class="container py-4">
    <h3 class="mb-3">Nearby Health & Fitness Map</h3>

    <div class="mb-3">
      <label class="form-label">Search for:</label>
      <select v-model="searchType" class="form-select w-auto d-inline-block ms-2">
        <option value="gym">Gyms</option>
        <option value="park">Parks</option>
      </select>
      <button class="btn btn-primary ms-2" @click="searchNearby">Search Nearby</button>
    </div>

    <div id="map" style="height: 480px;" class="border rounded shadow-sm"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const map = ref(null)
const markers = []
const searchType = ref('gym')


onMounted(() => {
  map.value = L.map('map').setView([-37.8136, 144.9631], 13) // Melbourne city center

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map.value)

  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        L.marker([latitude, longitude])
          .addTo(map.value)
          .bindPopup(' You are here!')
          .openPopup()
        map.value.setView([latitude, longitude], 14)
      },
      () => alert('Unable to access your location.')
    )
  }
})


async function searchNearby() {
  if (!map.value) return

  markers.forEach(m => m.remove())
  markers.length = 0

  const bounds = map.value.getBounds()
  const query = `
    [out:json];
    (
      node["leisure"="${searchType.value}"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
      node["amenity"="${searchType.value}"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
    );
    out center;
  `
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query
  })
  const data = await res.json()

  if (data?.elements?.length) {
    data.elements.forEach(el => {
      const lat = el.lat
      const lon = el.lon
      const name = el.tags?.name || '(Unnamed)'
      const marker = L.marker([lat, lon])
        .addTo(map.value)
        .bindPopup(` ${name}`)
      markers.push(marker)
    })
  } else {
    alert(`No nearby ${searchType.value}s found.`)
  }
}
</script>
