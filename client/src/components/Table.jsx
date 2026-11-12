const Table = ({ headings, children, isEmpty, emptyText = "No records found" }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm text-left">
        <thead className="bg-green-100 text-green-900">
          <tr>
            {headings.map((heading) => (
              <th key={heading} className="px-4 py-3 font-semibold whitespace-nowrap">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={headings.length} className="px-4 py-8 text-center text-gray-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
