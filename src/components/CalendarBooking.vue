<template>
  <section class="p-4 bg-white rounded-3 shadow-sm">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h2 id="cal-heading" class="h5 m-0">Appointments</h2>
      <div class="btn-group" role="group" aria-label="Calendar actions">
        <button class="btn btn-outline-secondary btn-sm" @click="goToday" title="Go to today">
          Today
        </button>
        <button class="btn btn-outline-secondary btn-sm" @click="prev" title="Previous">
          ‹
        </button>
        <button class="btn btn-outline-secondary btn-sm" @click="next" title="Next">
          ›
        </button>
      </div>
    </div>

    <p class="text-muted">
      Select a day range to add an appointment. Overlapping bookings are blocked. Click an event to delete it.
    </p>

    <FullCalendar
      ref="calRef"
      aria-labelledby="cal-heading"
      :options="options"
      style="--fc-border-color:#dee2e6"
    />
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'



const STORAGE_KEY = 'mh_calendar_events_v1'


function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Failed to load events:', e)
  }
 
  return [{ id: 'e1', title: 'Checkup', start: new Date().toISOString().slice(0, 10) }]
}

const events = ref(loadEvents())
watch(
  events,
  (v) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
    } catch (e) {
      console.warn('Failed to save events:', e)
    }
  },
  { deep: true }
)


function overlaps(startISO, endISO) {
  const s = new Date(startISO).getTime()
  const e = new Date(endISO).getTime()
  return events.value.some((ev) => {
    const es = new Date(ev.start).getTime()
    const ee = ev.end ? new Date(ev.end).getTime() : es + 24 * 3600 * 1000
    return Math.max(s, es) < Math.min(e, ee)
  })
}

const calRef = ref(null)
function getApi() { return calRef.value?.getApi?.() }
function goToday() { getApi()?.today() }
function prev() { getApi()?.prev() }
function next() { getApi()?.next() }

const options = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  selectable: true,
  selectMirror: true,
  height: 'auto',
  

  
  events(info, success) {
    success(events.value)
  },

  
  select(sel) {
    const title = prompt('Title for booking?')
    if (!title) return
    if (overlaps(sel.startStr, sel.endStr)) {
      alert('Time conflict with existing booking.')
      return
    }
    events.value.push({
      id: String(Date.now()),
      title,
      start: sel.startStr,
      end: sel.endStr
    })
  },

  
  eventClick(info) {
    if (confirm(`Delete "${info.event.title}"?`)) {
      events.value = events.value.filter((e) => e.id !== info.event.id)
    }
  }
}
</script>

<style scoped>
:deep(.fc) {
  --fc-button-bg: #0d6efd;
  --fc-button-border-color: #0d6efd;
}
:deep(.fc .fc-daygrid-day.fc-day-today) {
  background: rgba(13, 110, 253, 0.06);
}
</style>
