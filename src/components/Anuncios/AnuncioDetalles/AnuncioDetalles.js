import { IconClose, Confirm, DatosRes } from '@/components/Layouts';
import { convertTo12HourFormat, formatDate } from '@/helpers';
import { BasicModal } from '@/layouts';
import { FaCheck, FaEdit, FaInfoCircle, FaTimes, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { AnuncioEditForm } from '../AnuncioEditForm/AnuncioEditForm';
import axios from 'axios';
import styles from './AnuncioDetalles.module.css';
import { useAuth } from '@/contexts/AuthContext';

export function AnuncioDetalles(props) {
  const { reload, onReload, anuncio, onOpenCloseDetalles, onToastSuccessAnuncioMod, onToastSuccessAnuncioDel } = props
  
  const { user } = useAuth()

  const [showEditAnuncio, setShowEditAnuncio] = useState(false)

  const onOpenEditAnuncio = () => setShowEditAnuncio((prevState) => !prevState)

  const [showRes, setShowRes] = useState(false)

  const onOpenCloseRes = () => setShowRes((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const handleDeleteAnuncio = async () => {
    if (anuncio?.id) {
      try {
        await axios.delete(`/api/anuncios/anuncios?id=${anuncio.id}`)
        onReload()
        onToastSuccessAnuncioDel()
        onOpenCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar el anuncio:', error)
      }
    } else {
      console.error('Anuncio o ID no disponible')
    }
  }

  return (
    <>
      <IconClose onOpenClose={onOpenCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Anuncio</h1>
              <h2>{anuncio.anuncio}</h2>
            </div>
            <div>
              <h1>Descripción</h1>
              <h2>{anuncio.descripcion}</h2>
            </div>
            <div className={styles.anuncia}>
              <h1>Anuncia</h1>
              <div onClick={onOpenCloseRes}>
                <h2>{anuncio.usuario_isadmin}</h2>
                <FaInfoCircle />
              </div>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{anuncio.folio}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{formatDate(anuncio.date)}</h2>
            </div>
            <div>
              <h1>Hora</h1>
              <h2>{convertTo12HourFormat(anuncio.hora)}</h2>
            </div>
          </div>
        </div>

        {user.isadmin === 'Admin' || user.isadmin === 'Comité' ? (
          <>

            <div className={styles.iconEdit}>
              <FaEdit onClick={onOpenEditAnuncio} />
            </div>

            {user.isadmin === 'Admin' || user.isadmin === 'Comité' ? (
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

      <BasicModal title='Editar anuncio' show={showEditAnuncio} onClose={onOpenEditAnuncio}>
        <AnuncioEditForm reload={reload} onReload={onReload} anuncio={anuncio} onOpenEditAnuncio={onOpenEditAnuncio} onToastSuccessAnuncioMod={onToastSuccessAnuncioMod} />
      </BasicModal>

      <BasicModal title='datos de residente' show={showRes} onClose={onOpenCloseRes}>
        <DatosRes anuncio={anuncio} onOpenCloseRes={onOpenCloseRes} />
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
        onConfirm={handleDeleteAnuncio}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar el anuncio ?'
      />

    </>
  )
}
