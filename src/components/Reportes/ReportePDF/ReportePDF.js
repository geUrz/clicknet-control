import { BiSolidFilePdf } from 'react-icons/bi'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import QRCode from 'qrcode'
import { formatDate } from '@/helpers'
import styles from './ReportePDF.module.css'

export function ReportePDF(props) {
  const { reporte, user, firmaCli, firmaTec } = props

  const generarPDF = async () => {
    if (!reporte) return

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a5'
    })

    const marginMain = 4
    const pageWidth = doc.internal.pageSize.getWidth()

    // Función para agregar el texto en el pie de página
    const addFooterText = () => {
      const text = 'www.clicknetmx.com'
      const textWidth = doc.getTextWidth(text)
      const x = (pageWidth - textWidth) / 2
      const y = doc.internal.pageSize.height - 5 // Posición a 10 mm del borde inferior
      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      doc.text(text, x, y)
    }

    // Añadir contenido a la primera página
    const logoImg = 'img/logo.png'
    const logoWidth = 50
    const logoHeight = 14
    const xPosition = pageWidth - logoWidth - marginMain

    doc.addImage(logoImg, 'PNG', xPosition, 12.5, logoWidth, logoHeight)

    doc.setFont('helvetica')
    const font1 = 9.5
    const font2 = 8.5
    const font3 = 8

    doc.setFontSize(`${font1}`)
    doc.setTextColor(0, 0, 0)
    doc.text('CLICKNETMX', marginMain, 16)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text('Punta Este Corporativo', marginMain, 20)
    doc.text('Calzada Carranza 951,', marginMain, 24)
    doc.text('Piso 10 Suite 304, Interior "E"', marginMain, 28)
    doc.text('C.P. 2125', marginMain, 32)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Juan Roberto Espinoza Espinoza', marginMain, 36)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text('RFC: EIEJ8906244J3', marginMain, 40)

    doc.setFontSize(`${font1}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Cliente', marginMain, 48)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${user.nombre_residencial}`, marginMain, 52)

    doc.setFontSize(`${font1}`)
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "bold")
    doc.text('REPORTE', doc.internal.pageSize.width - marginMain - doc.getTextWidth('REPORTE'), 34)
    doc.setFontSize(`${font1}`)
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "normal")
    doc.text('Folio', doc.internal.pageSize.width - marginMain - doc.getTextWidth('Folio'), 40)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${reporte.folio}`, doc.internal.pageSize.width - marginMain - doc.getTextWidth(`${reporte.folio}`), 43.5)

    doc.setFontSize(`${font1}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Fecha', doc.internal.pageSize.width - marginMain - doc.getTextWidth('Fecha'), 49)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(
      `${formatDate(reporte.date).toUpperCase()}`,
      doc.internal.pageSize.width - marginMain - doc.getTextWidth(`${formatDate(reporte.date)}`),
      52.5
    )

    doc.autoTable({
      startY: 58,
      head: [
        [
          { content: 'Descripción', styles: { halign: 'left' } }
        ]
      ],
      styles: {
        cellPadding: 2.5,
        cellWidth: 'auto',
      },
      body: [[reporte.descripcion || 'Sin descripción']],
      headStyles: { fillColor: [240, 240, 240], fontSize: `${font1}`, textColor: [50, 50, 50] },
      bodyStyles: { fontSize: `${font2}` },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      columnStyles: {
        cellWidth: 100,
        cellPadding: 2.5,
        valign: 'middle'
      },
      margin: { top: 0, left: marginMain, bottom: 0, right: marginMain },
    })

    const top = 154
    const boxWidth = 143.5
    const boxHeight = 30

    doc.setDrawColor(255, 255, 255)
    doc.rect(marginMain, top, boxWidth, boxHeight)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Nota:', marginMain, top + 0)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    const content = reporte.nota === undefined || reporte.nota === null ? (
      ''
    ) : (
      `${reporte.nota}`
    )


    const textX = marginMain
    const textY = top + 4
    const txtWidth = boxWidth - 4

    doc.text(content, textX, textY, { maxWidth: txtWidth })

    // Firma
    const firmaWidth = 24
    const firmaHeight = 12
    const marginRightFirma = 20
    const xPos = pageWidth - firmaWidth - marginRightFirma

    if (firmaTec) {
      doc.addImage(firmaTec, 'PNG', xPos, 174, firmaWidth, firmaHeight)
    }
    doc.setFontSize(`${font3}`)
    doc.setTextColor(50, 50, 50)
    doc.text('_________________________', doc.internal.pageSize.width - 35 - doc.getTextWidth('Firma Técnico'), 188)
    doc.text('Firma Técnico', doc.internal.pageSize.width - 23.5 - doc.getTextWidth('Firma Técnico'), 192.5)

    if (firmaCli) {
      doc.addImage(firmaCli, 'PNG', xPos, 174, firmaWidth, firmaHeight)
    }
    doc.setFontSize(`${font3}`)
    doc.setTextColor(50, 50, 50)
    doc.text('_________________________', doc.internal.pageSize.width - 85 - doc.getTextWidth('Firma Cliente'), 188)
    doc.text('Firma Cliente', doc.internal.pageSize.width - 72 - doc.getTextWidth('Firma Cliente'), 192.5)

    const qrCodeText = 'https://www.facebook.com/clicknet.mx'
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeText)
    doc.addImage(qrCodeDataUrl, 'PNG', 2, 170, 35, 35)

    doc.setFontSize(`${font3}`)
    doc.setTextColor(120, 120, 120)

    addFooterText() // Agregar texto en el pie de la primera página

    doc.addPage()
    doc.autoTable({
      startY: 4,
      head: [[{ content: 'Evidencias Antes del Trabajo', styles: { halign: 'left' } }]],
      headStyles: { fillColor: [240, 240, 240], fontSize: font1, textColor: [50, 50, 50] },
      margin: { top: 0, left: marginMain, right: marginMain },
    })
    addFooterText() // Agregar texto en el pie de la segunda página

    const imgAntes = [
      { img: reporte.img1, title: reporte.title1 },
      { img: reporte.img2, title: reporte.title2 },
      { img: reporte.img3, title: reporte.title3 },
      { img: reporte.img4, title: reporte.title4 },
      { img: reporte.img5, title: reporte.title5 },
      { img: reporte.img6, title: reporte.title6 },
      { img: reporte.img7, title: reporte.title7 },
      { img: reporte.img8, title: reporte.title8 },
      { img: reporte.img9, title: reporte.title9 },
      { img: reporte.img10, title: reporte.title10 }
    ]

    let posY = 18
    let posX = 20

    imgAntes.forEach((item, index) => {
      if (item.img) {
        doc.addImage(item.img, 'PNG', posX, posY, 50, 30)
        if (item.title) {
          doc.setFontSize(font2)
          doc.setTextColor(0, 0, 0)
          doc.text(item.title, posX + 25, posY + 35, { maxWidth: 50, align: 'center' })
        }
      }
      posX += 55
      if ((index + 1) % 2 === 0) {
        posX = 20
        posY += 40
      }
    })

    doc.addPage()
    doc.autoTable({
      startY: 4,
      head: [[{ content: 'Evidencias Después del Trabajo', styles: { halign: 'left' } }]],
      headStyles: { fillColor: [240, 240, 240], fontSize: font1, textColor: [50, 50, 50] },
      margin: { top: 0, left: marginMain, right: marginMain },
    })
    addFooterText() // Agregar texto en el pie de la tercera página

    const imgDespues = [
      { img: reporte.img11, title: reporte.title11 },
      { img: reporte.img12, title: reporte.title12 },
      { img: reporte.img13, title: reporte.title13 },
      { img: reporte.img14, title: reporte.title14 },
      { img: reporte.img15, title: reporte.title15 },
      { img: reporte.img16, title: reporte.title16 },
      { img: reporte.img17, title: reporte.title17 },
      { img: reporte.img18, title: reporte.title18 },
      { img: reporte.img19, title: reporte.title19 },
      { img: reporte.img20, title: reporte.title20 }
    ]

    posY = 18
    posX = 20

    imgDespues.forEach((item, index) => {
      if (item.img) {
        doc.addImage(item.img, 'PNG', posX, posY, 50, 30)
        if (item.title) {
          doc.setFontSize(font2)
          doc.setTextColor(0, 0, 0)
          doc.text(item.title, posX + 25, posY + 35, { maxWidth: 50, align: 'center' })
        }
      }
      posX += 55
      if ((index + 1) % 2 === 0) {
        posX = 20
        posY += 40
      }
    })

    doc.save(`${reporte.folio}.pdf`)
  }

  const compartirPDF = () => {
    generarPDF()
  }

  return (
    <div className={styles.iconPDF}>
      <div onClick={compartirPDF}>
        <BiSolidFilePdf />
      </div>
    </div>
  )
}
