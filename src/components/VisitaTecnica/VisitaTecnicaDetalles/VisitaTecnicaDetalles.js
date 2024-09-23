import { IconClose, Confirm, Loading } from '@/components/Layouts';
import { convertTo12HourFormat, formatDate } from '@/helpers';
import { BasicModal } from '@/layouts';
import { FaCheck, FaEdit, FaImage, FaTimes, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { VisitaTecnicaEditForm } from '../VisitaTecnicaEditForm/VisitaTecnicaEditForm';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Image } from 'semantic-ui-react';
import { VisitatecnicaUpImg } from '../VisitatecnicaUpImg';
import styles from './VisitaTecnicaDetalles.module.css';

export function VisitaTecnicaDetalles(props) {

  const { reload, onReload, visitatecnica, onOpenCloseDetalles, onToastSuccessVisitatecnicaMod, onToastSuccessVisitatecnicaDel } = props

  const { user } = useAuth()

  const [showSubirImg, setShowSubirImg] = useState(false);
  const [selectedImageKey, setSelectedImageKey] = useState(null);  // Nuevo estado para controlar la imagen seleccionada

  const [showConfirmDel, setShowConfirmDel] = useState(null)
  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const [showConfirmDelImg, setShowConfirmDelImg] = useState(null)
  const [imageToDelete, setImageToDelete] = useState(null)

  const [showEditVisitatecnica, setShowEditVisitatecnica] = useState(null)
  const onOpenEditVisitatecnica = () => setShowEditVisitatecnica(prevState => !prevState)

  const onShowSubirImg = (imgKey) => {
    if (user.isadmin === 'Admin' || visitatecnica.usuario_id === user.id) {
      setSelectedImageKey(imgKey)
      setShowSubirImg(true)
    } 
  }
  
  const onCloseSubirImg = () => {
    setShowSubirImg(false)
    setSelectedImageKey(null)
  }

  const handleDeleteVisitatecnica = async () => {
    if (visitatecnica?.id) {
      try {
        await axios.delete(`/api/visitatecnica/visitatecnica?id=${visitatecnica.id}`)
        onReload()
        onToastSuccessVisitatecnicaDel()
        onOpenCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar la visitatecnica:', error)
      }
    } else {
      console.error('Visita técnica o ID no disponible')
    }
  }

  const deleteImage = async () => {
    try {
      if (imageToDelete) {
        await axios.put(`/api/visitatecnica/updateImage?id=${visitatecnica.id}`, { [imageToDelete]: null });
        onReload(); // Actualizar la página para reflejar los cambios
        setShowConfirmDelImg(false); // Cerrar la confirmación
      }
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
    }
  }

  const onShowConfirmDelImg = (imgKey) => {
    setImageToDelete(imgKey); // Establece la imagen que se va a eliminar
    setShowConfirmDelImg(true); // Abre el modal de confirmación
  }

  return (
    <>
      <IconClose onOpenClose={onOpenCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Visita técnica</h1>
              <h2>{visitatecnica.visitatecnica}</h2>
            </div>
            <div>
              <h1>Descripción</h1>
              <h2>{visitatecnica.descripcion}</h2>
            </div>
            <div >
              <h1>Técnico</h1>
              <h2>{visitatecnica.usuario_nombre}</h2>
            </div>
            <div>
              <h1>Estatus</h1>
              <h2>{visitatecnica.estado}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{visitatecnica.folio}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{formatDate(visitatecnica.date)}</h2>
            </div>
            <div>
              <h1>Hora</h1>
              <h2>{convertTo12HourFormat(visitatecnica.hora)}</h2>
            </div>
          </div>
        </div>

        <div className={styles.img}>
          <h1>Evidencias</h1>
          <div>
            {!visitatecnica.img1 ? (
              <div className={styles.noImg} onClick={() => onShowSubirImg("img1")}>
                <div>
                  <FaImage />
                </div>
              </div>
            ) : (
              <div className={styles.imgDel}>
                {!visitatecnica.img1 ? (
                  <Loading size={25} loading={2} />
                ) : (
                  <>
                    <Image src={visitatecnica.img1} onClick={() => onShowSubirImg("img1")} />
                    <FaTrash onClick={() => onShowConfirmDelImg("img1")} />
                  </>
                )}
              </div>
            )}
            {!visitatecnica.img2 ? (
              <div className={styles.noImg} onClick={() => onShowSubirImg("img2")}>
                <div>
                  <FaImage />
                </div>
              </div>
            ) : (
              <div className={styles.imgDel}>
                {!visitatecnica.img2 ? (
                  <Loading size={25} loading={2} />
                ) : (
                  <>
                    <Image src={visitatecnica.img2} onClick={() => onShowSubirImg("img2")} />
                    <FaTrash onClick={() => onShowConfirmDelImg("img2")} />
                  </>
                )}
              </div>
            )}
            {!visitatecnica.img3 ? (
              <div className={styles.noImg} onClick={() => onShowSubirImg("img3")}>
                <div>
                  <FaImage />
                </div>
              </div>
            ) : (
              <div className={styles.imgDel}>
                {!visitatecnica.img3 ? (
                  <Loading size={25} loading={2} />
                ) : (
                  <>
                    <Image src={visitatecnica.img3} onClick={() => onShowSubirImg("img3")} />
                    <FaTrash onClick={() => onShowConfirmDelImg("img3")} />
                  </>
                )}
              </div>
            )}
            {!visitatecnica.img4 ? (
              <div className={styles.noImg} onClick={() => onShowSubirImg("img4")}>
                <div>
                  <FaImage />
                </div>
              </div>
            ) : (
              <div className={styles.imgDel}>
                {!visitatecnica.img4 ? (
                  <Loading size={25} loading={2} />
                ) : (
                  <>
                    <Image src={visitatecnica.img4} onClick={() => onShowSubirImg("img4")} />
                    <FaTrash onClick={() => onShowConfirmDelImg("img4")} />
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {user.isadmin === 'Admin' || visitatecnica.usuario_id === user.id ? (
          <>

            <div className={styles.iconEdit}>
              <FaEdit onClick={onOpenEditVisitatecnica} />
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

      <BasicModal title='modificar la visita técnica' show={showEditVisitatecnica} onClose={onOpenEditVisitatecnica}>
        <VisitaTecnicaEditForm reload={reload} onReload={onReload} visitatecnica={visitatecnica} onOpenEditVisitatecnica={onOpenEditVisitatecnica} onToastSuccessVisitatecnicaMod={onToastSuccessVisitatecnicaMod} />
      </BasicModal>

      <BasicModal title='Subir imagen' show={showSubirImg} onClose={onCloseSubirImg}>
        {selectedImageKey && (
          <VisitatecnicaUpImg
            reload={reload}
            onReload={onReload}
            visitatecnica={visitatecnica}
            onShowSubirImg={onCloseSubirImg}
            selectedImageKey={selectedImageKey}
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
        onConfirm={handleDeleteVisitatecnica}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar la visita técnica ?'
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
