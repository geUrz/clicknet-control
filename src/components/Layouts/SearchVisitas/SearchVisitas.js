import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { VisitasListSearch } from '../VisitasListSearch';
import { FaSearch, FaTimesCircle } from 'react-icons/fa';
import styles from './SearchVisitas.module.css';

export function SearchVisitas(props) {

  const {reload, onReload, onResults, onOpenCloseSearch, onToastSuccessVisitaMod} = props

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [visitas, setVisitas] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setVisitas([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const response = await axios.get(`/api/visitas/visitas?search=${query}`)
        setVisitas(response.data)
      } catch (err) {
        setError('No se encontraron visitas')
        setVisitas([])
      } finally {
        setLoading(false)
      }
    };

    fetchData()
  }, [query])

  return (
    <div className={styles.main}>

      <div className={styles.input}>
        <Input
          type="text"
          placeholder="Buscar visita..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          loading={loading}
        />
        <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
          <FaTimesCircle />
        </div>
      </div>

      <div className={styles.visitaLista}>
        {error && <p>{error}</p>}
        {visitas.length > 0 && (
          <div className={styles.resultsContainer}>
            <VisitasListSearch visitas={visitas} reload={reload} onReload={onReload} onToastSuccessVisitaMod={onToastSuccessVisitaMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
