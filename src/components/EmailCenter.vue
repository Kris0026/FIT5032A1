<template>
  <div class="card">
    <div class="card-body">
      <h4 class="card-title">Send Health Tips (EmailJS)</h4>
      <p class="text-muted mb-3">
        Enter recipients (comma separated), message, and optional attachment URL.  
        Replace <code>SERVICE_ID</code>, <code>TEMPLATE_ID</code>, <code>PUBLIC_KEY</code> with your EmailJS credentials.
      </p>

      <div class="mb-2">
        <label class="form-label">Recipients</label>
        <textarea
          v-model="recipients"
          class="form-control"
          rows="2"
          placeholder="user1@example.com, user2@example.com"
          aria-label="Recipients (comma separated)"
        ></textarea>
        <div class="form-text">Use comma to separate multiple emails.</div>
      </div>

      <div class="mb-2">
        <label class="form-label">Message</label>
        <textarea
          v-model="message"
          class="form-control"
          rows="4"
          placeholder="Write your health tip here"
          aria-label="Email message"
        ></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Attachment URL (optional)</label>
        <input
          v-model="attachmentUrl"
          type="url"
          class="form-control"
          placeholder="https://example.com/health-tip.pdf"
          aria-label="Attachment URL"
        />
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-primary" @click="send">Send Email</button>
        <button class="btn btn-outline-secondary" @click="clearForm" type="button">Clear</button>
      </div>

      <div v-if="status" class="alert mt-3" :class="statusClass" role="status">{{ status }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import emailjs from '@emailjs/browser'


const SERVICE_ID = 'service_6sfgb5f'
const TEMPLATE_ID = 'template_9kijosj'
const PUBLIC_KEY  = 'CkVaxtV9a7Y1k8DYf'

const recipients = ref('user@demo.com')
const message = ref('Stay active for 150 min/week and keep a regular sleep schedule.')
const attachmentUrl = ref('')
const status = ref('')
const statusClass = ref('alert-info')

function clearForm(){
  recipients.value = ''
  message.value = ''
  attachmentUrl.value = ''
  status.value = ''
}


function isValidEmail(e){
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)
}

async function send(){
  status.value = ''
  statusClass.value = 'alert-info'

  if(!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || SERVICE_ID.includes('YOUR_')){
    status.value = 'Please configure EmailJS credentials in EmailCenter.vue.'
    statusClass.value = 'alert-warning'
    return
  }

  const list = recipients.value.split(',').map(s=>s.trim()).filter(Boolean)
  if(!list.length || !list.every(isValidEmail)){
    status.value = 'Invalid recipient list. Please provide valid email(s), separated by commas.'
    statusClass.value = 'alert-warning'
    return
  }

  try{
    
    emailjs.init(PUBLIC_KEY)

    
    status.value = 'Sending...'
    await Promise.all(list.map(to =>
      emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        to_email: to,
        message: message.value,
        attachment_url: attachmentUrl.value || ''
      })
    ))

    status.value = `Sent successfully to ${list.length} recipient(s).`
    statusClass.value = 'alert-success'
  }catch(e){
    status.value = `Failed to send: ${e?.text || e?.message || 'Unknown error'}`
    statusClass.value = 'alert-danger'
  }
}
</script>

<style scoped>
.card { max-width: 720px; margin: 0 auto; }
</style>
