import { IconClose, Confirm } from '@/components/Layouts';
import { convertTo12HourFormat, formatDate } from '@/helpers';
import { BasicModal } from '@/layouts';
import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { ReporteEditForm } from '../ResidencialEditForm/ResidencialEditForm';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import styles from './ResidencialDetalles.module.css';

export function ResidencialDetalles(props) {

  const { reload, onReload, reporte, onOpenCloseDetalles, onToastSuccessReportesMod, onToastSuccessReportesDel } = props

  const { user } = useAuth()

  const [showConfirmDel, setShowConfirmDel] = useState(null)
  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const [showEditReporte, setShowEditReporte] = useState(null)
  const onOpenEditReporte = () => setShowEditReporte(prevState => !prevState)

  const handleDeleteReporte = async () => {
    if (reporte?.id) {
      try {
        await axios.delete(`/api/reportes/reportes?id=${reporte.id}`)
        onReload()
        onToastSuccessReportesDel()
        onOpenCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar el reporte:', error)
      }
    } else {
      console.error('Reporte o ID no disponible')
    }
  }

  return (
    <>
      <IconClose onOpenClose={onOpenCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Reporte</h1>
              <h2>{reporte.reporte}</h2>
            </div>
            <div>
              <h1>Descripción</h1>
              <h2>{reporte.descripcion}</h2>
            </div>
            <div >
              <h1>Técnico</h1>
              <h2>{reporte.usuario_nombre}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{reporte.folio}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{formatDate(reporte.date)}</h2>
            </div>
            <div>
              <h1>Estatus</h1>
              <h2>{reporte.estado}</h2>
            </div>
          </div>
        </div>

        {/* <div className={styles.img}>
          <h1>Evidencias</h1>
          <div>
            {!reporte.img1 ? (
              <div className={styles.noImg} onClick={() => onShowSubirImg("img1")}>
                <div>
                  <FaImage />
                </div>
              </div>
            ) : (
              <div className={styles.imgDel}>
                {!reporte.img1 ? (
                  <Loading size={25} loading={2} />
                ) : (
                  <>
                    <Image src={reporte.img1} onClick={() => onShowSubirImg("img1")} />
                    <FaTrash onClick={() => onShowConfirmDelImg("img1")} />
                  </>
                )}
              </div>
            )}
            {!reporte.img2 ? (
              <div className={styles.noImg} onClick={() => onShowSubirImg("img2")}>
                <div>
                  <FaImage />
                </div>
              </div>
            ) : (
              <div className={styles.imgDel}>
                {!reporte.img2 ? (
                  <Loading size={25} loading={2} />
                ) : (
                  <>
                    <Image src={reporte.img2} onClick={() => onShowSubirImg("img2")} />
                    <FaTrash onClick={() => onShowConfirmDelImg("img2")} />
                  </>
                )}
              </div>
            )}
            {!reporte.img3 ? (
              <div className={styles.noImg} onClick={() => onShowSubirImg("img3")}>
                <div>
                  <FaImage />
                </div>
              </div>
            ) : (
              <div className={styles.imgDel}>
                {!reporte.img3 ? (
                  <Loading size={25} loading={2} />
                ) : (
                  <>
                    <Image src={reporte.img3} onClick={() => onShowSubirImg("img3")} />
                    <FaTrash onClick={() => onShowConfirmDelImg("img3")} />
                  </>
                )}
              </div>
            )}
            {!reporte.img4 ? (
              <div className={styles.noImg} onClick={() => onShowSubirImg("img4")}>
                <div>
                  <FaImage />
                </div>
              </div>
            ) : (
              <div className={styles.imgDel}>
                {!reporte.img4 ? (
                  <Loading size={25} loading={2} />
                ) : (
                  <>
                    <Image src={reporte.img4} onClick={() => onShowSubirImg("img4")} />
                    <FaTrash onClick={() => onShowConfirmDelImg("img4")} />
                  </>
                )}
              </div>
            )}
          </div>
        </div> */}

        {user.isadmin === 'Admin' || reporte.usuario_id === user.id ? (
          <>

            <div className={styles.iconEdit}>
              <FaEdit onClick={onOpenEditReporte} />
            </div>

            {user.isadmin === 'Admin' ? (
              <div className={styles.iconDel}>
                <FaTrash onClick={onOpenCloseConfirmDel} />
              </div>
            ) : (
              ''
            )}

          </>
        ) : (
          ''
        )}
      </div>

      <BasicModal title='modificar el reporte' show={showEditReporte} onClose={onOpenEditReporte}>
        <ReporteEditForm reload={reload} onReload={onReload} reporte={reporte} onOpenEditReporte={onOpenEditReporte} onToastSuccessReportesMod={onToastSuccessReportesMod} />
      </BasicModal>

      <Confirm
        open={showConfirmDel}
        cancelButton={
          <div className={styles.iconClose}>
            <FaTimes />
          </div>
        }
        confirmButton={
          <div className={styles.iconCheck}>
            <FaCheck />
          </div>
        }
        onConfirm={handleDeleteReporte}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar el reporte ?'
      />

    </>
  )
}
