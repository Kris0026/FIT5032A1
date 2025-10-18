
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


export function exportToCsv(filename, rows) {
  if (!rows || !rows.length) return

  const headers = Object.keys(rows[0])
  const csv = [
    headers.join(','),                                          
    ...rows.map(r => headers.map(h => escapeCsv(r[h])).join(','))
  ].join('\r\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

function escapeCsv(v) {
  if (v == null) return ''
  const s = String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}


export function exportToPdf(filename, rows, title = 'Export') {
  if (!rows || !rows.length) return
  const headers = Object.keys(rows[0])

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  doc.setFontSize(14)
  doc.text(title, 40, 40)

  autoTable(doc, {
    startY: 60,
    head: [headers],
    body: rows.map(r => headers.map(h => r[h] ?? '')),
    styles: { fontSize: 9, cellPadding: 6, overflow: 'linebreak' },
    headStyles: { fillColor: [33, 150, 243] },
    margin: { left: 40, right: 40 },
    didDrawPage: data => {
      
      const page = doc.getNumberOfPages()
      doc.setFontSize(9)
      doc.text(`Page ${page}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10)
    }
  })

  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`)
}
