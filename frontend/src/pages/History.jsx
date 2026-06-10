import { useState, useEffect } from 'react'
import axios from 'axios'

function History() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/assignments')
      setAssignments(response.data.data)
    } catch (err) {
      console.error('Failed to fetch assignments:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter by RM name
  const filtered = assignments.filter((a) =>
    a.rmName.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h1 style={styles.title}>Assignment History</h1>
        <p style={styles.subtitle}>All client to RM assignments are listed below</p>
      </div>

      <div style={styles.card}>
        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{assignments.length}</div>
            <div style={styles.statLabel}>Total Assignments</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>
              {[...new Set(assignments.map((a) => a.rmName))].length}
            </div>
            <div style={styles.statLabel}>Unique RMs</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{filtered.length}</div>
            <div style={styles.statLabel}>Showing</div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by RM name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          {search && (
            <button onClick={() => setSearch('')} style={styles.clearBtn}>
              ✕
            </button>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div style={styles.loadingBox}>
            <div style={styles.spinner}></div>
            <p>Loading assignments...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={{ fontSize: '2rem' }}>🔍</p>
            <p>No assignments found for "<strong>{search}</strong>"</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Client Name</th>
                  <th style={styles.th}>Assigned RM</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((assignment, index) => (
                  <tr
                    key={assignment._id}
                    style={{
                      background: index % 2 === 0 ? 'white' : '#F9FAFB',
                    }}
                  >
                    <td style={styles.td}>{index + 1}</td>
                    <td style={{ ...styles.td, fontWeight: '500', color: '#111827' }}>
                      {assignment.clientName}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.rmBadge}>{assignment.rmName}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.successBadge}>✓ {assignment.status}</span>
                    </td>
                    <td style={{ ...styles.td, color: '#6B7280' }}>
                      {formatDate(assignment.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#F3F4F6',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6B7280',
    margin: 0,
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
  },
  statsRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statBox: {
    flex: 1,
    background: '#F3F4F6',
    borderRadius: '12px',
    padding: '1rem',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#4F46E5',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#6B7280',
    marginTop: '0.25rem',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    border: '1.5px solid #E5E7EB',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    marginBottom: '1.5rem',
    background: '#F9FAFB',
  },
  searchIcon: { fontSize: '1rem' },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    fontSize: '0.95rem',
    outline: 'none',
    color: '#111827',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9CA3AF',
    fontSize: '1rem',
  },
  loadingBox: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6B7280',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #E5E7EB',
    borderTop: '3px solid #4F46E5',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 1rem auto',
  },
  emptyBox: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6B7280',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
  },
  th: {
    background: '#F3F4F6',
    padding: '0.875rem 1rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#374151',
    border: '1px solid #E5E7EB',
  },
  td: {
    padding: '0.875rem 1rem',
    border: '1px solid #E5E7EB',
    color: '#374151',
  },
  rmBadge: {
    background: '#EEF2FF',
    color: '#4F46E5',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  successBadge: {
    background: '#ECFDF5',
    color: '#065F46',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
}

export default History