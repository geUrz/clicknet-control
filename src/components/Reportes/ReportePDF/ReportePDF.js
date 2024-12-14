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

    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a5'
      }
    )

    const logoImg = 'img/logo.png'
    const logoWidth = 50
    const logoHeight = 14
    const marginMain = 4
    const marginRightLogo = marginMain

    const pageWidth = doc.internal.pageSize.getWidth()

    const xPosition = pageWidth - logoWidth - marginRightLogo

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
    doc.setTextColor(0, 0, 0);
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

    const pWidth = doc.internal.pageSize.getWidth()
    const mRight = marginMain
    const tableWidth = 33
    const marginLeft = pWidth - mRight - tableWidth

    const firmaWidth = 24
    const firmaHeight = 12
    const marginRightFirma = 20

    const firmaWidthCli = 24
    const firmaHeightCli = 12
    const marginRightFirmaCli = 70

    const pgWidth = doc.internal.pageSize.getWidth()
    const pgWidthCli = doc.internal.pageSize.getWidth()

    const xPos = pgWidth - firmaWidth - marginRightFirma
    const xPosCli = pgWidthCli - firmaWidthCli - marginRightFirmaCli

    if (firmaTec) {
      doc.addImage(firmaTec, 'PNG', xPos, 174, firmaWidth, firmaHeight)
    }
    doc.setFontSize(`${font3}`)
    doc.setTextColor(50, 50, 50)
    doc.text('_________________________', doc.internal.pageSize.width - 35 - doc.getTextWidth('Firma Técnico'), 188)
    doc.text('Firma Técnico', doc.internal.pageSize.width - 23.5 - doc.getTextWidth('Firma Técnico'), 192.5)


    if (firmaCli) {
      doc.addImage(firmaCli, 'PNG', xPosCli, 174, firmaWidthCli, firmaHeightCli)
    }
    doc.setFontSize(`${font3}`)
    doc.setTextColor(50, 50, 50)
    doc.text('_________________________', doc.internal.pageSize.width - 85 - doc.getTextWidth('Firma Cliente'), 188)
    doc.text('Firma Cliente', doc.internal.pageSize.width - 72 - doc.getTextWidth('Firma Cliente'), 192.5)


    const qrCodeText = 'https://www.facebook.com/clicknet.mx'
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeText)
    doc.addImage(qrCodeDataUrl, 'PNG', 2, 170, 35, 35)

    doc.setFontSize(`${font3}`);
    doc.setTextColor(120, 120, 120)

    const text = 'www.clicknetmx.com';
    const textWidth = doc.getTextWidth(text);
    const pagWidth = doc.internal.pageSize.width
    const x = (pagWidth - textWidth) / 2
    const y = 205
    doc.text(text, x, y)

    const imgWidth = 25;
    const imgHeight = 45;
    const spaceBetweenImages = 35; // Espacio horizontal entre las imágenes
    const imagesPerRow = 4;

    // Función para calcular el punto de inicio en X para centrar las imágenes
    function calculateInitialPosX(docWidth) {
      const totalImagesWidth = imagesPerRow * imgWidth + (imagesPerRow - 1) * (spaceBetweenImages - imgWidth);
      return (docWidth - totalImagesWidth) / 2;
    }

    doc.addPage();
    doc.autoTable({
      startY: 4,
      head: [[{ content: 'Evidencias Antes del Trabajo', styles: { halign: 'left' } }]],
      headStyles: { fillColor: [240, 240, 240], fontSize: font1, textColor: [50, 50, 50] },
      margin: { top: 0, left: marginMain, right: marginMain },
    });

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

    let firstRowTopMargin = 18; // Margen superior personalizado para la primera fila
    let posY = firstRowTopMargin; // Aplicar el margen para la primera fila
    let posX = calculateInitialPosX(doc.internal.pageSize.width)

    imgAntes.forEach((item, index) => {
      if (item.img) {
        doc.addImage(item.img, 'PNG', posX, posY, imgWidth, imgHeight);

        if (item.title) {
          doc.setFontSize(font2);
          doc.setTextColor(0, 0, 0);
          doc.text(item.title, posX + imgWidth / 2, posY + imgHeight + 5, { maxWidth: imgWidth, align: 'center' });
        }
      }

      posX += spaceBetweenImages;

      if ((index + 1) % imagesPerRow === 0) {
        posX = calculateInitialPosX(doc.internal.pageSize.width); // Centrado de nuevo en la siguiente fila
        posY += 62; // Espacio entre filas de imágenes
      }
    })



    // Sección de imágenes "Después"
    doc.addPage();
    doc.autoTable({
      startY: 4,
      head: [[{ content: 'Evidencias Después del Trabajo', styles: { halign: 'left' } }]],
      headStyles: { fillColor: [240, 240, 240], fontSize: font1, textColor: [50, 50, 50] },
      margin: { top: 0, left: marginMain, right: marginMain },
    });

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

    posY = firstRowTopMargin; // Utilizar el mismo margen superior
    posX = calculateInitialPosX(doc.internal.pageSize.width); // Centrado en X

    imgDespues.forEach((item, index) => {
      if (item.img) {
        doc.addImage(item.img, 'PNG', posX, posY, imgWidth, imgHeight);

        if (item.title) {
          doc.setFontSize(font2);
          doc.setTextColor(0, 0, 0);
          doc.text(item.title, posX + imgWidth / 2, posY + imgHeight + 5, { maxWidth: imgWidth, align: 'center' });
        }
      }

      posX += spaceBetweenImages;

      if ((index + 1) % imagesPerRow === 0) {
        posX = calculateInitialPosX(doc.internal.pageSize.width); // Centrado de nuevo en la siguiente fila
        posY += 62; // Espacio entre filas de imágenes
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
