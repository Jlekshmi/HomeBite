import React from 'react';
import './Table.scss';

const Table = ({ children }) => {
  return (
    <table className="table">
    {children}
  </table>
  );
};

export default Table;
