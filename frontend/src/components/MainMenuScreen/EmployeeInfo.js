import React from 'react';

const styles = {
  employeeInfoContainer: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  employeeName: {
    color: '#333',
    marginBottom: '8px',
  },
  employeeLevel: {
    color: '#ec6608',
  },
};

const EmployeeInfo = ({ name, level }) => {
  return (
    <div style={styles.employeeInfoContainer}>
      <h2 style={styles.employeeName}>{name}</h2>
      <p style={styles.employeeLevel}>Level: {level}</p>
    </div>
  );
};

export default EmployeeInfo;