import { IconClose, Confirm } from '@/components/Layouts';
import { formatDate } from '@/helpers';
import { BasicModal } from '@/layouts';
import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { ReporteEditForm } from '../ReporteEditForm/ReporteEditForm';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import styles from './ReporteDetalles.module.css';

export function ReporteDetalles(props) {

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

        {user.isadmin === 'Admin' ? (
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
