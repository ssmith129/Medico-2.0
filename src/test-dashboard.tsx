const TestDashboard = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'red', 
      color: 'white', 
      fontSize: '24px',
      minHeight: '100vh'
    }}>
      <h1>TEST DASHBOARD IS WORKING!</h1>
      <p>This confirms the routing and React are working properly.</p>
      <p>Current timestamp: {new Date().toISOString()}</p>
    </div>
  );
};

export default TestDashboard;
