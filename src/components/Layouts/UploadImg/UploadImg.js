import { Button, Form, FormField, FormGroup, Image, Loader, Message } from 'semantic-ui-react';
import { useState } from 'react';
import axios from 'axios';
import styles from './UploadImg.module.css';
import { IconClose } from '../IconClose';

export function UploadImg(props) {
  const { reload, onReload, idKey, itemId, onShowSubirImg, endpoint, onSuccess, selectedImageKey } = props;
  const [fileName, setFileName] = useState('No se ha seleccionado ningún archivo');
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (!acceptedTypes.includes(file.type)) {
      setError('Tipo de archivo no permitido. Solo se aceptan imágenes jpg, png y webp.');
      return;
    }

    setError('');
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
  };

  const handleImageUpload = async () => {
    const file = document.querySelector('input[type="file"]').files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', itemId);
    formData.append('imageKey', selectedImageKey);
  
    try {
      setLoading(true);
  
      const res = await axios.post(`/api/${endpoint}/uploadImage`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      const imageUrl = res.data.filePath;
      onSuccess(selectedImageKey, imageUrl);
      onReload()
      onShowSubirImg(); // Cierra el modal
    } catch (error) {
      setError('Error al subir la imagen. Inténtalo de nuevo.');
      console.error('Error al subir la imagen:', error);
    } finally {
      setLoading(false); // Asegúrate de detener el loader siempre
    }
  };
  
  

  return (
    <>
      <IconClose onOpenClose={onShowSubirImg} />
      <div className={styles.main}>
        <div className={styles.img}>
          {selectedImage ? <Image src={selectedImage} width="200px" height="200px" /> : ''}
        </div>
        <Form>
          <FormGroup widths="equal">
            <FormField>
              <label htmlFor="file" className="ui icon button">
                <Button as="span" primary>
                  {!selectedImage ? 'Seleccionar imagen' : 'Cambiar imagen'}
                </Button>
              </label>
              <input
                id="file"
                type="file"
                hidden
                onChange={handleImageSelect}
              />
              <span>{fileName}</span>
              {error && <Message negative>{error}</Message>}
              <h1>Formatos: png, jpg y webp</h1>
              <Button onClick={handleImageUpload} secondary disabled={!selectedImage || loading}>
                {loading ? <Loader active inline size="small" /> : 'Subir Imagen'}
              </Button>
            </FormField>
          </FormGroup>
        </Form>
      </div>
    </>
  );
}
