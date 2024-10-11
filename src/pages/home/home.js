import { BasicLayout } from '@/layouts'
import { useCallback, useEffect, useState } from 'react'
import { Card } from '@/components/Home'
import { FaBuilding, FaBullhorn, FaCarCrash, FaClipboard, FaUserCheck, FaUserCog, FaUserMd } from 'react-icons/fa'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import axios from 'axios'
import { size } from 'lodash'
import { Loading } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import styles from './home.module.css'

export default function Home() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = useCallback(() => setReload((prevState) => !prevState), [])

  const [data, setData] = useState({
    incidencias: null,
    anuncios: null,
    visitatecnica: null,
    reportes: null,
    visitaprovedores: null,
    residenciales: null,
  });

  const fetchData = useCallback(async (endpoint, key) => {
    try {
      const res = await axios.get(endpoint);
      setData((prevData) => ({
        ...prevData,
        [key]: res.data,
      }));
    } catch (error) {
      console.error(`Error fetching ${key}:`, error)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchData(`/api/incidencias/incidencias?residencial_id=${user.residencial_id}`, 'incidencias')
      fetchData(`/api/anuncios/anuncios?residencial_id=${user.residencial_id}`, 'anuncios')
      fetchData(`/api/visitatecnica/visitatecnica?residencial_id=${user.residencial_id}`, 'visitatecnica')
      fetchData(`/api/reportes/reportes?residencial_id=${user.residencial_id}`, 'reportes')
      fetchData(`/api/visitaprovedores/visitaprovedores?residencial_id=${user.residencial_id}`, 'visitaprovedores')
      fetchData('/api/residenciales/residenciales', 'residenciales')
    }
  }, [reload, user, fetchData])

  const countData = {
    incidencias: size(data.incidencias),
    anuncios: size(data.anuncios),
    visitatecnica: size(data.visitatecnica),
    reportes: size(data.reportes),
    visitaprovedores: size(data.visitaprovedores),
    residenciales: size(data.residenciales)
    
  }

  if (loading) {
    return <Loading size={45} loading={0} />
    
  }

  return (
    <ProtectedRoute>
      <BasicLayout title='Panel' onReload={onReload}>
        <div className={styles.main}>
          <div className={styles.section}>
            <Card link='/incidencias' title='Incidencias'
              countIncidencias={countData.incidencias}>
              <FaCarCrash />
            </Card>
            <Card link='/anuncios' title='Anuncios'
              countAnuncios={countData.anuncios}>
              <FaBullhorn />
            </Card>
            <Card link='/visitatecnica' title='Visita Técnica'
              countVisitatecnica={countData.visitatecnica}>
              <FaUserCog />
            </Card>
            <Card link='/reportes' title='Reportes'
              countReportes={countData.reportes}>
              <FaClipboard />
            </Card>
            <Card link='/visitaprovedores' title='Visita Proveedores'
              countVisitaprovedores={countData.visitaprovedores}>
              <FaUserMd />
            </Card>

            {user && (user.isadmin === 'Admin') ? 
              <Card link='/residenciales' title='Residenciales'
              countResidenciales={countData.residenciales}>
                <FaBuilding />
              </Card>
             : null
            }

            {user && (user.isadmin === 'Admin' || user.isadmin === 'Caseta' || user.isadmin === 'Comité') ? 
              <Card link='/validarvisitas' title='Validar Visitas' count={false}>
                <FaUserCheck />
              </Card>
             : null
            }

          </div>
        </div>
      </BasicLayout>
    </ProtectedRoute>
  )
}
