import { BasicLayout } from '@/layouts'
import { useCallback, useEffect, useState } from 'react'
import { Card } from '@/components/Home'
import { FaBullhorn, FaCarCrash, FaClipboard, FaUserCheck, FaUserCog, FaUserMd } from 'react-icons/fa'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import axios from 'axios'
import { size } from 'lodash'
import { Loading, LoadingMini } from '@/components/Layouts'
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
    visitaprovedores: null
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
    fetchData('/api/incidencias/incidencias', 'incidencias')
    fetchData('/api/anuncios/anuncios', 'anuncios')
    fetchData('/api/visitatecnica/visitatecnica', 'visitatecnica')
    fetchData('/api/reportes/reportes', 'reportes')
    fetchData('/api/visitaprovedores/visitaprovedores', 'visitaprovedores')
  }, [reload])

  const countData = {
    incidencias: size(data.incidencias),
    anuncios: size(data.anuncios),
    visitatecnica: size(data.visitatecnica),
    reportes: size(data.reportes),
    visitaprovedores: size(data.visitaprovedores)
  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (
    <ProtectedRoute>
      <BasicLayout title='Inicio' onReload={onReload}>
        <div className={styles.main}>
          <div className={styles.section}>
            <Card link='/incidencias' title='Incidencias'
              countIncidencias={
                !countData ? (
                  <LoadingMini />
                ) : (
                  countData.incidencias === 0 ? (
                    '0'
                  ) : (
                    countData.incidencias
                  )
                )
              }>
              <FaCarCrash />
            </Card>
            <Card link='/anuncios' title='Anuncios'
              countAnuncios={
                !countData ? (
                  <LoadingMini />
                ) : (
                  countData.anuncios === 0 ? (
                    '0'
                  ) : (
                    countData.anuncios
                  )
                )
              }>
              <FaBullhorn />
            </Card>
            <Card link='/visitatecnica' title='Visita Técnica'
              countVisitatecnica={
                !countData ? (
                  <LoadingMini />
                ) : (
                  countData.visitatecnica === 0 ? (
                    '0'
                  ) : (
                    countData.visitatecnica
                  )
                )
              }>
              <FaUserCog />
            </Card>
            <Card link='/reportes' title='Reportes'
              countReportes={
                !countData ? (
                  <LoadingMini />
                ) : (
                  countData.reportes === 0 ? (
                    '0'
                  ) : (
                    countData.reportes
                  )
                )
              }>
              <FaClipboard />
            </Card>
            <Card link='/visitaprovedores' title='Visita Provedores'
              countVisitaprovedores={
                !countData ? (
                  <LoadingMini />
                ) : (
                  countData.visitaprovedores === 0 ? (
                    '0'
                  ) : (
                    countData.visitaprovedores
                  )
                )
              }>
              <FaUserMd />
            </Card>

            {user && (user.isadmin === 'Admin' || user.isadmin === 'Caseta' || user.isadmin === 'Comité') ? (
              <Card link='/validarvisitas' title='Validar Visitas' count={false}>
                <FaUserCheck />
              </Card>
            ) : null}


          </div>
        </div>
      </BasicLayout>
    </ProtectedRoute>
  )
}
