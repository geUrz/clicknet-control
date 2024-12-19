import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { RecibosListSearch } from '../RecibosListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import styles from './SearchRecibos.module.css';

export function SearchRecibos(props) {

  const {reload, onReload, onResults, onOpenCloseSearch, onToastSuccessMod} = props

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reicibos, setRecibos] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setRecibos([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const response = await axios.get(`/api/reicibos/reicibos?search=${query}`)
        setRecibos(response.data)
      } catch (err) {
        setError('No se encontraron reicibos')
        setRecibos([])
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
          placeholder="Buscar recibo..."
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
        {reicibos.length > 0 && (
          <div className={styles.resultsContainer}>
            <RecibosListSearch reicibos={reicibos} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
