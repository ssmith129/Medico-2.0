const SimpleDoctorDashboard = () => {
  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="content" style={{ padding: '40px' }}>
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '30px',
          borderRadius: '8px',
          border: '2px solid #2196f3'
        }}>
          <h1 style={{ color: '#1976d2', fontSize: '28px', marginBottom: '20px' }}>
            🏥 Simple Doctor Dashboard
          </h1>
          <p style={{ fontSize: '18px', color: '#333', marginBottom: '15px' }}>
            This is a simplified version to test if the routing and layout are working.
          </p>
          <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#555' }}>Status Check:</h3>
            <ul style={{ margin: 0, color: '#666' }}>
              <li>✅ React Component: Working</li>
              <li>✅ Routing: Working</li>
              <li>✅ Layout Wrapper: Working</li>
              <li>✅ CSS Classes: Applied</li>
              <li>⏰ Timestamp: {new Date().toLocaleString()}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDoctorDashboard;
