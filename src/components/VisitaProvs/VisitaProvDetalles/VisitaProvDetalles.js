import { IconClose, Confirm, DatosRes } from '@/components/Layouts';
import { formatDate, formatDateInc, formatDateIncDet, formatDateVT } from '@/helpers';
import { BasicModal } from '@/layouts';
import { FaCheck, FaEdit, FaInfoCircle, FaTimes, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { IncidenciaEditForm, VisitaProvEditForm } from '../VisitaProvEditForm/VisitaProvEditForm';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import styles from './VisitaProvDetalles.module.css';

export function VisitaProvDetalles(props) {
  const { reload, onReload, visitaprov, onOpenCloseDetalles, onToastSuccessVisitaprovMod, onToastSuccessVisitaprovDel } = props
  
  const { user } = useAuth()

  const [showEditVisitaprov, setShowEditVisitaprov] = useState(false)

  const onOpenEditVisitaprov = () => setShowEditVisitaprov((prevState) => !prevState)

  const [showRes, setShowRes] = useState(false)

  const onOpenCloseRes = () => setShowRes((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const handleDeleteVisitaprov = async () => {
    if (visitaprov?.id) {
      try {
        await axios.delete(`/api/visitaprovedores/visitaprovedores?id=${visitaprov.id}`)
        onReload()
        onToastSuccessVisitaprovDel()
        onOpenCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar el visita provedor:', error)
      }
    } else {
      console.error('Visita provedor o ID no disponible')
    }
  }

  return (
    <>
      <IconClose onOpenClose={onOpenCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Visita provedor</h1>
              <h2>{visitaprov.visitaprovedor}</h2>
            </div>
            <div>
              <h1>Descripción</h1>
              <h2>{visitaprov.descripcion}</h2>
            </div>
            <div className={styles.reporta}>
              <h1>Autorizó</h1>
              <div onClick={onOpenCloseRes}>
                <h2>{visitaprov.usuario_nombre}</h2>
                <FaInfoCircle />
              </div>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{visitaprov.folio}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{formatDateVT(visitaprov.createdAt)}</h2>
            </div>
          </div>
        </div>

        {user.isadmin === 'Admin' || visitaprov.usuario_id === user.id ? (
          <>

            <div className={styles.iconEdit}>
              <FaEdit onClick={onOpenEditVisitaprov} />
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

      <BasicModal title='Editar visita provedor' show={showEditVisitaprov} onClose={onOpenEditVisitaprov}>
        <VisitaProvEditForm reload={reload} onReload={onReload} visitaprov={visitaprov} onOpenEditVisitaprov={onOpenEditVisitaprov} onToastSuccessVisitaprovMod={onToastSuccessVisitaprovMod} />
      </BasicModal>

      <BasicModal title='datos de residente' show={showRes} onClose={onOpenCloseRes}>
        <DatosRes visitaprov={visitaprov} onOpenCloseRes={onOpenCloseRes} />
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
        onConfirm={handleDeleteVisitaprov}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar la visita provedor ?'
      />

    </>
  )
}
