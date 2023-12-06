

import React from 'react';

const styles = {
  employeeInfoContainer: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    marginTop: '20px',
    width: '50%',
    height: '35%'
  },
  employeeName: {
    color: '#333',
    marginBottom: '15px',

  },
  employeeLevel: {
    color: '#ec6608',
    marginTop: '35px',
    fontSize: '1.5rem'
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