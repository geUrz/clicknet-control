import { IconClose, Confirm, DatosRes } from '@/components/Layouts';
import { formatDate, formatDateIncDet } from '@/helpers';
import { BasicModal } from '@/layouts';
import { FaCheck, FaEdit, FaInfoCircle, FaTimes, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { IncidenciaEditForm } from '../IncidenciaEditForm/IncidenciaEditForm';
import axios from 'axios';
import styles from './IncidenciaDetalles.module.css';
import { useAuth } from '@/contexts/AuthContext';

export function IncidenciaDetalles(props) {
  const { reload, onReload, incidencia, onOpenCloseDetalles, onToastSuccessIncidenciaMod, onToastSuccessIncidenciaMDel } = props
  
  const { user } = useAuth()

  const [showEditIncidencia, setShowEditIncidencia] = useState(false)

  const onOpenEditIncidencia = () => setShowEditIncidencia((prevState) => !prevState)

  const [showRes, setShowRes] = useState(false)

  const onOpenCloseRes = () => setShowRes((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const handleDeleteIncidencia = async () => {
    if (incidencia?.id) {
      try {
        await axios.delete(`/api/incidencias/incidencias?id=${incidencia.id}`)
        onReload()
        onToastSuccessIncidenciaMDel()
        onOpenCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar la incidencia:', error)
      }
    } else {
      console.error('Incidencia o ID no disponible')
    }
  }

  return (
    <>
      <IconClose onOpenClose={onOpenCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Incidencia</h1>
              <h2>{incidencia.incidencia}</h2>
            </div>
            <div>
              <h1>Descripción</h1>
              <h2>{incidencia.descripcion}</h2>
            </div>
            <div className={styles.reporta}>
              <h1>Reporta</h1>
              <div onClick={onOpenCloseRes}>
                <h2>{incidencia.usuario_nombre}</h2>
                <FaInfoCircle />
              </div>
            </div>
            <div>
              <h1>Zona</h1>
              <h2>{incidencia.zona}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{incidencia.folio}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{formatDateIncDet(incidencia.createdAt)}</h2>
            </div>
            <div>
              <h1>Estatus</h1>
              <h2>{incidencia.estado}</h2>
            </div>
          </div>
        </div>

        {user.isadmin === 'Admin' || incidencia.usuario_id === user.id ? (
          <>

            <div className={styles.iconEdit}>
              <FaEdit onClick={onOpenEditIncidencia} />
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

      <BasicModal title='Editar incidencia' show={showEditIncidencia} onClose={onOpenEditIncidencia}>
        <IncidenciaEditForm reload={reload} onReload={onReload} incidencia={incidencia} onOpenEditIncidencia={onOpenEditIncidencia} onToastSuccessIncidenciaMod={onToastSuccessIncidenciaMod} />
      </BasicModal>

      <BasicModal title='datos de residente' show={showRes} onClose={onOpenCloseRes}>
        <DatosRes 
          usuario={incidencia.usuario_nombre} 
          priv={incidencia.usuario_privada} 
          calle={incidencia.usuario_calle} 
          casa={incidencia.usuario_casa} 
          onOpenCloseRes={onOpenCloseRes} />
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
        onConfirm={handleDeleteIncidencia}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar la incidencia ?'
      />

    </>
  )
}
