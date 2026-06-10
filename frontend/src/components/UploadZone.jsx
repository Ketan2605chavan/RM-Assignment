import { useDropzone } from 'react-dropzone'
import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import toast, { Toaster } from 'react-hot-toast'

// Connect to backend socket
const socket = io('http://localhost:5000')

function UploadZone() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  // Listen for real-time socket events
  useEffect(() => {
    socket.on('assignment_success', (data) => {
      toast.success(data.message, {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#065F46',
          color: 'white',
          fontWeight: '500',
          borderRadius: '10px',
          padding: '16px',
          fontSize: '14px',
        },
        icon: '🎉',
      })
    })

    return () => {
      socket.off('assignment_success')
    }
  }, [])

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0])
    setResult(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  })

  const handleUpload = async () => {
    if (!file) return alert('Please drop a CSV file first!')

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setResult(null)

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData)
      setResult({ success: true, message: response.data.message })
    } catch (err) {
      const data = err.response?.data
      const errors = data?.errors ? data.errors.join('\n') : ''
      setResult({
        success: false,
        message: data?.message || 'Upload failed',
        errors: errors,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      {/* Toast container */}
      <Toaster />

      <div style={styles.header}>
        <h1 style={styles.title}>RM Assignment Engine</h1>
        <p style={styles.subtitle}>Upload a CSV file to assign clients to Relationship Managers</p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Bulk Client Upload</h2>

        <div
          {...getRootProps()}
          style={{
            ...styles.dropzone,
            background: isDragActive ? '#EEF4FF' : '#F9FAFB',
            borderColor: isDragActive ? '#4F46E5' : '#D1D5DB',
          }}
        >
          <input {...getInputProps()} />
          <div style={styles.dropzoneInner}>
            <div style={styles.uploadIcon}>📂</div>
            {isDragActive ? (
              <p style={styles.dropText}>Drop your CSV file here...</p>
            ) : (
              <>
                <p style={styles.dropText}>Drag & drop your CSV file here</p>
                <p style={styles.dropSubtext}>or click to browse files</p>
              </>
            )}
            <p style={styles.dropHint}>Only .csv files are accepted</p>
          </div>
        </div>

        {file && (
          <div style={styles.fileInfo}>
            <span style={styles.fileIcon}>📄</span>
            <span style={styles.fileName}>{file.name}</span>
            <span style={styles.fileSize}>({(file.size / 1024).toFixed(1)} KB)</span>
            <button
              onClick={() => { setFile(null); setResult(null) }}
              style={styles.removeBtn}
            >
              ✕
            </button>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          style={{
            ...styles.uploadBtn,
            background: loading || !file ? '#9CA3AF' : '#4F46E5',
            cursor: loading || !file ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? (
            <span style={styles.btnContent}>
              <span style={styles.spinner}></span>
              Processing...
            </span>
          ) : (
            'Upload CSV'
          )}
        </button>

        {loading && (
          <p style={styles.loadingMsg}>
            ⏳ Parsing and saving your data to database...
          </p>
        )}

        {result && (
          <div style={{
            ...styles.result,
            background: result.success ? '#ECFDF5' : '#FEF2F2',
            borderColor: result.success ? '#6EE7B7' : '#FCA5A5',
            color: result.success ? '#065F46' : '#991B1B',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={styles.resultIcon}>
                {result.success ? '✅' : '❌'}
              </span>
              <strong>{result.message}</strong>
            </div>
            {result.errors && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', whiteSpace: 'pre-line' }}>
                {result.errors}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={styles.guide}>
        <h3 style={styles.guideTitle}>Expected CSV Format</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Client Name</th>
              <th style={styles.th}>Assigned RM Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>Mihir Banerjee</td>
              <td style={styles.td}>Deepika Patel</td>
            </tr>
            <tr style={{ background: '#F9FAFB' }}>
              <td style={styles.td}>Ritika Lobo</td>
              <td style={styles.td}>Vikram Bose</td>
            </tr>
            <tr>
              <td style={styles.td}>Suresh Gupta</td>
              <td style={styles.td}>Preethi Nair</td>
            </tr>
          </tbody>
        </table>
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
    whiteSpace: 'nowrap',
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
    maxWidth: '580px',
    margin: '0 auto 2rem auto',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    marginTop: 0,
    marginBottom: '1.5rem',
  },
  dropzone: {
    border: '2px dashed',
    borderRadius: '12px',
    padding: '2.5rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '1rem',
  },
  dropzoneInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  uploadIcon: { fontSize: '3rem', marginBottom: '0.5rem' },
  dropText: { fontSize: '1rem', fontWeight: '500', color: '#374151', margin: 0 },
  dropSubtext: { fontSize: '0.875rem', color: '#6B7280', margin: 0 },
  dropHint: { fontSize: '0.75rem', color: '#9CA3AF', margin: '0.5rem 0 0 0' },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  fileIcon: { fontSize: '1.25rem' },
  fileName: { fontSize: '0.875rem', fontWeight: '500', color: '#166534', flex: 1 },
  fileSize: { fontSize: '0.75rem', color: '#6B7280' },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0 4px',
  },
  uploadBtn: {
    width: '100%',
    padding: '0.875rem',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background 0.2s',
  },
  btnContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid white',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.8s linear infinite',
  },
  loadingMsg: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: '0.875rem',
    marginTop: '0.75rem',
  },
  result: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid',
    marginTop: '1rem',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  resultIcon: { fontSize: '1.25rem' },
  guide: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    maxWidth: '580px',
    margin: '0 auto',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
  },
  guideTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#111827',
    marginTop: 0,
    marginBottom: '1rem',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' },
  th: {
    background: '#F3F4F6',
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#374151',
    border: '1px solid #E5E7EB',
  },
  td: { padding: '0.75rem 1rem', color: '#6B7280', border: '1px solid #E5E7EB' },
}

export default UploadZone