import { BiSolidFilePdf } from 'react-icons/bi'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import QRCode from 'qrcode'
import { formatDate } from '@/helpers'
import styles from './OrdenServicioPDF.module.css'

export function OrdenServicioPDF(props) {

  const { ordenservicio, user, firmaCli, firmaTec, visitatecnica, image, toggle } = props

  const generarPDF = async () => {

    if (!ordenservicio) return

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
    doc.text('ÓRDEN DE SERVICIO', doc.internal.pageSize.width - marginMain - doc.getTextWidth('ÓRDEN DE SERVICIO'), 34)
    doc.setFontSize(`${font1}`)
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "normal")
    doc.text('Folio', doc.internal.pageSize.width - marginMain - doc.getTextWidth('Folio'), 40)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${ordenservicio.folio}`, doc.internal.pageSize.width - marginMain - doc.getTextWidth(`${ordenservicio.folio}`), 43.5)

    doc.setFontSize(`${font1}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Fecha', doc.internal.pageSize.width - marginMain - doc.getTextWidth('Fecha'), 49)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(
      `${formatDate(ordenservicio.date).toUpperCase()}`,
      doc.internal.pageSize.width - marginMain - doc.getTextWidth(`${formatDate(ordenservicio.date)}`),
      52.5
    )

    doc.autoTable({
      startY: 58,
      head: [
        [
          { content: 'Descripción', styles: { halign: 'center' } }
        ]
      ],
      styles: {
        cellPadding: 2.5,
        cellWidth: 'auto',
      },
      body: [[ordenservicio.descripcion || 'Sin descripción']],
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
    const content = ordenservicio.nota === undefined || ordenservicio.nota === null ? (
      ''
    ) : (
      `${ordenservicio.nota}`
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

    if (toggle) {

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
        head: [[{ content: 'Evidencias Antes del Trabajo', styles: { halign: 'center' } }]],
        headStyles: { fillColor: [240, 240, 240], fontSize: font1, textColor: [50, 50, 50] },
        margin: { top: 0, left: marginMain, right: marginMain },
      });

      const imgAntes = [
        { img: visitatecnica.img1, title: visitatecnica.title1 },
        { img: visitatecnica.img2, title: visitatecnica.title2 },
        { img: visitatecnica.img3, title: visitatecnica.title3 },
        { img: visitatecnica.img4, title: visitatecnica.title4 },
        { img: visitatecnica.img5, title: visitatecnica.title5 },
        { img: visitatecnica.img6, title: visitatecnica.title6 },
        { img: visitatecnica.img7, title: visitatecnica.title7 },
        { img: visitatecnica.img8, title: visitatecnica.title8 },
        { img: visitatecnica.img9, title: visitatecnica.title9 },
        { img: visitatecnica.img10, title: visitatecnica.title10 }
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
        head: [[{ content: 'Evidencias Después del Trabajo', styles: { halign: 'center' } }]],
        headStyles: { fillColor: [240, 240, 240], fontSize: font1, textColor: [50, 50, 50] },
        margin: { top: 0, left: marginMain, right: marginMain },
      });

      const imgDespues = [
        { img: visitatecnica.img11, title: visitatecnica.title11 },
        { img: visitatecnica.img12, title: visitatecnica.title12 },
        { img: visitatecnica.img13, title: visitatecnica.title13 },
        { img: visitatecnica.img14, title: visitatecnica.title14 },
        { img: visitatecnica.img15, title: visitatecnica.title15 },
        { img: visitatecnica.img16, title: visitatecnica.title16 },
        { img: visitatecnica.img17, title: visitatecnica.title17 },
        { img: visitatecnica.img18, title: visitatecnica.title18 },
        { img: visitatecnica.img19, title: visitatecnica.title19 },
        { img: visitatecnica.img20, title: visitatecnica.title20 }
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
    }

    doc.save(`${ordenservicio.folio}.pdf`)

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
