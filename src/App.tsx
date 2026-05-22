import { useState, useEffect } from 'react'

interface Service {
  name: string
  env: string
  port: number
  status: 'active' | 'idle' | 'testing'
  tagClass: string
  description: string
}

interface LogEntry {
  text: string
  type: 'info' | 'success' | 'warn' | 'error'
  time: string
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Read preference or default to dark
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notion-theme')
      if (saved === 'light' || saved === 'dark') return saved
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark'
  })

  const [services, setServices] = useState<Service[]>([
    { name: 'app-dev', env: 'Development', port: 5179, status: 'active', tagClass: 'tag-blue', description: 'Vite dev server with HMR' },
    { name: 'app-prod', env: 'Production', port: 5179, status: 'idle', tagClass: 'tag-green', description: 'Optimized static build served by Vite preview' }
  ])

  const [logs, setLogs] = useState<LogEntry[]>([
    { text: 'Deployment center initialized.', type: 'info', time: new Date().toLocaleTimeString() },
    { text: 'System listening on host 0.0.0.0, port 5179.', type: 'success', time: new Date().toLocaleTimeString() }
  ])

  const [isRunningSim, setIsRunningSim] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark-theme')
      root.classList.remove('light-theme')
    } else {
      root.classList.add('light-theme')
      root.classList.remove('dark-theme')
    }
    localStorage.setItem('notion-theme', theme)
  }, [theme])

  const addLog = (text: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setLogs((prev) => [
      ...prev,
      { text, type, time: new Date().toLocaleTimeString() }
    ])
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const handleVerifyEnv = () => {
    if (isRunningSim) return
    setIsRunningSim(true)
    addLog('Checking local deployment properties...', 'info')
    
    setTimeout(() => {
      addLog(`VITE_PORT detected: ${import.meta.env.VITE_PORT || '5179'}`, 'success')
      addLog(`VITE_DEPLOY_ENV: ${import.meta.env.VITE_DEPLOY_ENV || 'Docker-Local'}`, 'success')
      addLog(`VITE_APP_TITLE: ${import.meta.env.VITE_APP_TITLE || 'Notion Deploy Tester'}`, 'info')
      addLog('Dockerfile configuration matched. Serve preview config checked.', 'success')
      setIsRunningSim(false)
    }, 800)
  }

  const handleHmrCheck = () => {
    if (isRunningSim) return
    setIsRunningSim(true)
    addLog('Initiating Hot Module Replacement (HMR) connection test...', 'info')

    setTimeout(() => {
      addLog('Connecting to WS server on ws://localhost:5179/...', 'info')
      setTimeout(() => {
        addLog('HMR socket handshake successful. Ready to catch updates.', 'success')
        setIsRunningSim(false)
      }, 600)
    }, 600)
  }

  const handleSimulateBuild = () => {
    if (isRunningSim) return
    setIsRunningSim(true)
    
    // Set service to testing status
    setServices(prev => prev.map(s => s.name === 'app-prod' ? { ...s, status: 'testing' } : s))
    
    addLog('Starting production build simulation...', 'info')
    addLog('Running: npm run build', 'info')

    setTimeout(() => {
      addLog('vite v6.2.0 building for production...', 'info')
      addLog('transforming (24) modules...', 'info')
      
      setTimeout(() => {
        addLog('dist/index.html                  0.48 kB │ gzip: 0.32 kB', 'success')
        addLog('dist/assets/index-BtYnLp9Z.css   3.20 kB │ gzip: 1.10 kB', 'success')
        addLog('dist/assets/index-CxP1M91X.js   143.50 kB │ gzip: 46.20 kB', 'success')
        addLog('✓ built in 1.42s', 'success')
        addLog('Docker build stage finished. Launching Vite preview environment...', 'info')

        setTimeout(() => {
          addLog('Starting static preview server on port 5179...', 'info')
          addLog('Vite production build running: listening on 0.0.0.0.', 'success')
          addLog('Container port 5179 is active and ready.', 'success')
          
          setServices(prev => prev.map(s => s.name === 'app-prod' ? { ...s, status: 'active' } : s))
          setIsRunningSim(false)
        }, 800)
      }, 1000)
    }, 600)
  }

  const handleClearLogs = () => {
    setLogs([])
  }

  return (
    <div>
      {/* Cover Image */}
      <img 
        src="/cover.png" 
        className="notion-cover" 
        alt="Deployment cover banner" 
      />

      <div className="notion-container">
        {/* Page Icon */}
        <div className="notion-icon-wrapper">
          <span>🚀</span>
        </div>

        {/* Page Title */}
        <h1 className="notion-title">Vite + Docker Deployment</h1>

        {/* Page Properties */}
        <div className="notion-properties">
          <div className="notion-property-row">
            <div className="property-label">
              <span>📋</span> Status
            </div>
            <div className="property-value">
              <span className="notion-tag tag-green">Healthy</span>
            </div>
          </div>
          <div className="notion-property-row">
            <div className="property-label">
              <span>🔌</span> Port
            </div>
            <div className="property-value">
              <span className="notion-tag tag-orange">5179</span>
            </div>
          </div>
          <div className="notion-property-row">
            <div className="property-label">
              <span>📦</span> Docker Context
            </div>
            <div className="property-value">
              <span className="notion-tag tag-blue">Dockerfile / Compose Ready</span>
            </div>
          </div>
          <div className="notion-property-row">
            <div className="property-label">
              <span>🌐</span> Bind Host
            </div>
            <div className="property-value">
              <code>0.0.0.0</code>
            </div>
          </div>
        </div>

        <div className="notion-divider"></div>

        {/* Callout Box */}
        <div className="notion-callout">
          <div className="notion-callout-icon">💡</div>
          <div className="notion-callout-text">
            <div className="notion-callout-title">Docker Environment Configurations</div>
            <div className="notion-callout-desc">
              This layout demonstrates a fully optimized React-TS application. The ports are bound to <strong>5179</strong> in both development (with volume mapping/HMR) and production (static assets served by Vite preview). Run the simulation tools below to test build configurations.
            </div>
          </div>
        </div>

        {/* Services Database */}
        <div className="notion-db-title">
          <span>📁</span> Deployment Service Directory
        </div>
        <div className="notion-db-table-wrapper">
          <table className="notion-db-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Environment</th>
                <th>Port</th>
                <th>Status</th>
                <th>Mode Details</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.name}>
                  <td>
                    <strong>{service.name}</strong>
                  </td>
                  <td>
                    <span className={`notion-tag ${service.tagClass}`}>{service.env}</span>
                  </td>
                  <td>
                    <code>{service.port}</code>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`pulse-dot ${
                        service.status === 'active' ? '' : service.status === 'testing' ? 'inactive' : 'inactive'
                      }`}></span>
                      <span style={{ textTransform: 'capitalize' }}>{service.status}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {service.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Center */}
        <div className="section-title">
          <span>⚙️</span> Interactive Test Actions
        </div>
        <div className="btn-grid">
          <button 
            className="notion-btn" 
            onClick={handleVerifyEnv}
            disabled={isRunningSim}
          >
            🔍 Verify Environment
          </button>
          <button 
            className="notion-btn" 
            onClick={handleHmrCheck}
            disabled={isRunningSim}
          >
            ⚡ Test HMR Connection
          </button>
          <button 
            className="notion-btn notion-btn-primary" 
            onClick={handleSimulateBuild}
            disabled={isRunningSim}
          >
            🚀 Run Production Build
          </button>
        </div>

        {/* Terminal logs */}
        <div className="section-title">
          <span>🖥️</span> Local Terminal / Pipeline Logger
        </div>
        <div className="code-container">
          <div className="code-header">
            <span>deployment-terminal-session</span>
            <button 
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '11px',
                textDecoration: 'underline'
              }}
              onClick={handleClearLogs}
            >
              Clear Console
            </button>
          </div>
          <div className="code-body">
            {logs.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Terminal is empty. Trigger an action above to log deployment runs.</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className={`log-line ${log.type}`}>
                  <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>[{log.time}]</span>
                  <span>{log.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Floating Controls */}
      <div className="floating-controls">
        <button 
          className="circle-btn" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </div>
  )
}

export default App
