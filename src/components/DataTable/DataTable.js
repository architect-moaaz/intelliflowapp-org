import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';

function DataTable(props) {
  const defaultSorted = [
    {
      dataField: "id",
      order: "asc",
    },
  ];

  // const { SearchBar } = Search;

  return (
    <div>
      {props.data && (
        <ToolkitProvider
          bootstrap4
          keyField={"id"}
          data={props.data}
          columns={props.columns}
          search
          exportCSV={true}
          defaultSorted={defaultSorted}
          id="dataTable-ToolkitProvider"
        >
          {(props) => (
            <div>
              {/* <div className="search-box-wrap">
                <SearchBar {...props.searchProps} />
                <select className="tabel-select">
                  <option value="">Sort By</option>
                  <option value="">A to Z</option>
                  <option value="">Z to A</option>
                </select>
              </div> */}
              <div>
                <BootstrapTable
                  className="my-tabel"
                  {...props.baseProps}
                  pagination={paginationFactory()}
                  wrapperClasses="table-responsive"
                  id="dataTable-BootstrapTable"
                />
              </div>
            </div>
          )}
        </ToolkitProvider>
      )}
    </div>
  );
}

export default DataTable;
