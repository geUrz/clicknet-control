import { size } from 'lodash'
import styles from './DatosCodigo.module.css'

export function DatosCodigo(props) {

  const { visita } = props

  return (


    <div className={styles.main}>
      <div className={styles.section}>

        <h1>Datos del código</h1>

        {size(visita) === 0 ? (
          ''
        ) : (

          <div className={styles.datos}>
            <div>
              <div>
                <h2>Residente</h2>
                <h3>{visita.usuario_nombre}</h3>
              </div>
              <div>
                <h2>Visita</h2>
                <h3>{visita.visita}</h3>
              </div>
              <div>
                <h2>Calle</h2>
                <h3>{visita.usuario_calle}</h3>
              </div>
              <div>
                <h2>Tipo de visita</h2>
                <h3>{visita.tipovisita}</h3>
              </div>
            </div>
            <div>
              <div>
                <h2>Código acceso</h2>
                <h3>{visita.codigo}</h3>
              </div>
              <div>
                <h2>Privada</h2>
                <h3>{visita.usuario_privada}</h3>
              </div>
              <div>
                <h2>Casa</h2>
                <h3>#{visita.usuario_casa}</h3>
              </div>
              <div className={styles.tipoAcc}>
                <h2>Tipo de acceso</h2>
                <h3>{visita.tipoacceso}</h3>
              </div>
            </div>
          </div>

        )
        }

      </div>
    </div>

  )
}
