import { IconClose, Confirm } from '@/components/Layouts';
import { formatDateIncDet } from '@/helpers';
import { BasicModal } from '@/layouts';
import { FaCheck, FaEdit, FaImage, FaTimes, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { IncidenciaEditForm } from '../IncidenciaEditForm/IncidenciaEditForm';
import axios from 'axios';
import { UploadImg } from '@/components/Layouts/UploadImg';
import styles from './IncidenciaDetalles.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { Image } from 'semantic-ui-react';

export function IncidenciaDetalles(props) {
  const { reload, onReload, incidencia: initialIncidencia, onOpenCloseDetalles, onToastSuccessIncidenciaMod, onToastSuccessIncidenciaDel } = props;

  const { user } = useAuth()

  const [incidencia, setIncidencia] = useState(initialIncidencia)
  const [showEditIncidencia, setShowEditIncidencia] = useState(false)
  const [showSubirImg, setShowSubirImg] = useState(false)
  const [selectedImageKey, setSelectedImageKey] = useState(null)

  const onOpenEditIncidencia = () => setShowEditIncidencia((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const onShowSubirImg = (imgKey) => {
    setSelectedImageKey(imgKey)
    setShowSubirImg(true)
  }

  const onCloseSubirImg = () => {
    setShowSubirImg(false)
    setSelectedImageKey(null)
  }

  const [showConfirmDelImg, setShowConfirmDelImg] = useState(null)
  const [imageToDelete, setImageToDelete] = useState(null)

  const handleDeleteIncidencia = async () => {
    if (incidencia?.id) {
      try {
        await axios.delete(`/api/incidencias/incidencias?id=${incidencia.id}`)
        onReload()
        onToastSuccessIncidenciaDel()
        onOpenCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar la incidencia:', error)
      }
    } else {
      console.error('Incidencia o ID no disponible')
    }
  }

  const deleteImage = async () => {
    try {
      if (imageToDelete) {
        await axios.put(`/api/incidencias/updateImage?id=${incidencia.id}`, { [imageToDelete]: null })
        setIncidencia({ ...incidencia, [imageToDelete]: null })
        setShowConfirmDelImg(false)
      }
    } catch (error) {
      console.error('Error al eliminar la imagen:', error)
    }
  }

  const onShowConfirmDelImg = (imgKey) => {
    setImageToDelete(imgKey) 
    setShowConfirmDelImg(true) 
  }

  const handleImageUploadSuccess = (imageKey, imageUrl) => {
    setIncidencia({ ...incidencia, [imageKey]: imageUrl });
    setShowSubirImg(false);
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

        <div className={styles.img}>
          <h1>Evidencias</h1>
          <div>
            {!incidencia.img1 ? (
              <div className={styles.noImg} onClick={() => onShowSubirImg("img1")}>
                <div>
                  <FaImage />
                </div>
              </div>
            ) : (
              <div className={styles.imgDel}>
                <Image src={incidencia.img1} alt="Incidencia imagen 1" onClick={() => onShowSubirImg("img1")} />
                <FaTrash onClick={() => onShowConfirmDelImg("img1")} />
              </div>
            )}

            {!incidencia.img2 ? (
              <div className={styles.noImg} onClick={() => onShowSubirImg("img2")}>
                <div>
                  <FaImage />
                </div>
              </div>
            ) : (
              <div className={styles.imgDel}>
                <Image src={incidencia.img2} alt="Incidencia imagen 2" onClick={() => onShowSubirImg("img2")} />
                <FaTrash onClick={() => onShowConfirmDelImg("img2")} />
              </div>
            )}
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

      <BasicModal title='Subir imagen' show={showSubirImg} onClose={onCloseSubirImg}>
        {selectedImageKey && (
          <UploadImg
            reload={reload}
            onReload={onReload}
            itemId={incidencia.id}
            onShowSubirImg={onCloseSubirImg}
            selectedImageKey={selectedImageKey}
            endpoint="incidencias"
            onSuccess={handleImageUploadSuccess}
          />
        )}
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

      <Confirm
        open={showConfirmDelImg}
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
        onConfirm={deleteImage}
        onCancel={() => setShowConfirmDelImg(false)}
        content='¿ Estás seguro de eliminar la imagen ?'
      />

    </>
  )
}
