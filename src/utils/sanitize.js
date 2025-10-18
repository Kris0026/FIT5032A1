
export function sanitize(input) {
  if (typeof input !== 'string') return input
  let cleaned = input.replace(/<\/(script|style)>/gi, '')
  cleaned = cleaned.replace(/<\s*(script|style)[^>]*>[\s\S]*?<\/(script|style)>/gi, '')
  cleaned = cleaned.replace(/[<>]/g, (m) => ({'<':'&lt;','>':'&gt;'}[m]))
  return cleaned
}

export function sanitizeInput(input) {
  return input.replace(/[<>]/g, c => ({'<':'&lt;','>':'&gt;'}[c]));
}
