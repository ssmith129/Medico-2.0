import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const SimpleTest = () => {
  return (
    <div style={{ 
      padding: '50px',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', fontSize: '32px', marginBottom: '20px' }}>
        ✅ REACT IS WORKING!
      </h1>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>
        Current timestamp: {new Date().toISOString()}
      </p>
      <p style={{ fontSize: '16px', color: '#666' }}>
        This confirms React app is mounting and rendering correctly.
      </p>
      <div style={{
        padding: '20px',
        backgroundColor: '#e7f3ff',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h3 style={{ color: '#0066cc', margin: '0 0 10px 0' }}>Next steps:</h3>
        <ul style={{ color: '#333', margin: 0 }}>
          <li>React mounting: ✅ Working</li>
          <li>CSS styles: ✅ Working (inline)</li>
          <li>TypeScript: ✅ Working</li>
        </ul>
      </div>
    </div>
  );
};

// Test without complex routing/redux
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimpleTest />
  </StrictMode>
)
