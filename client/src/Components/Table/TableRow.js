import React from 'react';
import './Table.scss';

const TableRow = ({ children }) => {
  return (
    <tr className="table-row">
      {children}
    </tr>
  );
};

export default TableRow;
