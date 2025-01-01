import React from 'react';
import './Table.scss';

const TableCell = ({ children }) => {
  return (
    <td className="table-cell">
      {children}
    </td>
  );
};

export default TableCell;
