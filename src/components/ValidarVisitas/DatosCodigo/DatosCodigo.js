import { size } from 'lodash';
import styles from './DatosCodigo.module.css';
import { Image } from 'semantic-ui-react';
import { FaCheck, FaImage, FaTimes, FaTrash } from 'react-icons/fa';
import { BasicModal } from '@/layouts';
import { Confirm, UploadImg } from '@/components/Layouts';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function DatosCodigo(props) {
  const { visita: initialVisita, reload, onReload } = props
  
  const [visita, setVisita] = useState(initialVisita)

  useEffect(() => {
    setVisita(initialVisita)
  }, [initialVisita])

  const [showSubirImg, setShowSubirImg] = useState(false)
  const [selectedImageKey, setSelectedImageKey] = useState(null)

  const [showConfirmDelImg, setShowConfirmDelImg] = useState(false)
  const [imageToDelete, setImageToDelete] = useState(null)

  const onShowSubirImg = (imgKey) => {
    setSelectedImageKey(imgKey)
    setShowSubirImg(true)
  };

  const onCloseSubirImg = () => {
    setShowSubirImg(false)
    setSelectedImageKey(null)
  };

  const deleteImage = async () => {
    try {
      if (imageToDelete) {
        await axios.put(`/api/visitas/updateImage?id=${visita.id}`, { [imageToDelete]: null })
        
        // Actualizamos la imagen en el estado local de visita
        setVisita({ ...visita, [imageToDelete]: null })
        setShowConfirmDelImg(false)
      }
    } catch (error) {
      console.error('Error al eliminar la imagen:', error)
    }
  };

  const onShowConfirmDelImg = (imgKey) => {
    setImageToDelete(imgKey)
    setShowConfirmDelImg(true)
  };

  const handleImageUploadSuccess = (imageKey, imageUrl) => {
    // Actualizamos la visita localmente con la nueva imagen cargada
    setVisita({ ...visita, [imageKey]: imageUrl })
    setShowSubirImg(false)
  }

  return (
    <div className={styles.main}>
      <div className={styles.section}>
        <h1>Datos del código</h1>

        {size(visita) === 0 ? (
          ''
        ) : (
          <>
            <div className={styles.datos}>
              <div>
                <h2>Residente</h2>
                <h3>{visita.usuario_nombre}</h3>
                <h2>Visita</h2>
                <h3>{visita.visita}</h3>
                <h2>Calle</h2>
                <h3>{visita.usuario_calle}</h3>
                <h2>Tipo de visita</h2>
                <h3>{visita.tipovisita}</h3>
              </div>
              <div>
                <h2>Código acceso</h2>
                <h3>{visita.codigo}</h3>
                <h2>Privada</h2>
                <h3>{visita.usuario_privada}</h3>
                <h2>Casa</h2>
                <h3>#{visita.usuario_casa}</h3>
                <div className={styles.tipoAcc}>
                  <h2>Tipo de acceso</h2>
                  <h3>{visita.tipoacceso}</h3>
                </div>
              </div>
            </div>

            <div className={styles.uploadImg}>
              <div>
                {!visita.img1 ? (
                  <div className={styles.noImg} onClick={() => onShowSubirImg('img1')}>
                    <div>
                      <FaImage />
                    </div>
                  </div>
                ) : (
                  <div className={styles.imgDel}>
                    <Image src={visita.img1} alt="Incidencia imagen 1" onClick={() => onShowSubirImg('img1')} />
                    <FaTrash onClick={() => onShowConfirmDelImg('img1')} />
                  </div>
                )}

                {!visita.img2 ? (
                  <div className={styles.noImg} onClick={() => onShowSubirImg('img2')}>
                    <div>
                      <FaImage />
                    </div>
                  </div>
                ) : (
                  <div className={styles.imgDel}>
                    <Image src={visita.img2} alt="Incidencia imagen 2" onClick={() => onShowSubirImg('img2')} />
                    <FaTrash onClick={() => onShowConfirmDelImg('img2')} />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <BasicModal title="Subir imagen" show={showSubirImg} onClose={onCloseSubirImg}>
        {selectedImageKey && (
          <UploadImg
            reload={reload}
            onReload={onReload}
            itemId={visita.id}
            onShowSubirImg={onCloseSubirImg}
            selectedImageKey={selectedImageKey}
            endpoint="visitas"
            onSuccess={handleImageUploadSuccess}
          />
        )}
      </BasicModal>

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
        content="¿Estás seguro de eliminar la imagen?"
      />
    </div>
  )
}
