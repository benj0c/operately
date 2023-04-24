import React from 'react';

interface Header {
  id: string;
  label: string;
}

interface Row {
  [key: string]: string | JSX.Element;
}

interface TableHeaderRowProps {
  headers: Header[];
  columnClasses: {[key: string]: string};
}

function TableHeaderRow({headers, columnClasses} : TableHeaderRowProps) : JSX.Element {
  return (
    <div className="w-full flex gap-2 justify-between text-xs px-4 py-2 text-dark-2">
      {headers.map((header: Header, index: number) => (
        <div key={index} className={columnClasses[header.id]}>{header.label}</div>
      ))}
    </div>
  );
}

interface TableRowProps {
  headers: Header[];
  row: Row;
  columnClasses: {[key: string]: string};
}

function TableRow({headers, row, columnClasses} : TableRowProps) : JSX.Element {
  return (
    <div className="w-full flex gap-2 justify-between px-4 py-4 border-t border-dark-8% hover:bg-light-1 transition">
      {headers.map((header: Header) => (
        <div className={columnClasses[header.id]}>{row[header.id]}</div>
      ))}
    </div>
  );
}

interface TableProps {
  headers: Header[];
  columnClasses: {[key: string]: string};
  rows: Row[];
}

export default function Table({headers, columnClasses, rows} : TableProps) : JSX.Element {
  return (
    <div className="mt-4 flex flex-col items-center rounded-lg border border-dark-8% bg-white">
      <TableHeaderRow headers={headers} columnClasses={columnClasses} />

      {rows.map((row: Row, index: number) => {
        return <TableRow key={index} headers={headers} row={row} columnClasses={columnClasses} />
      })}
    </div>
  );
}