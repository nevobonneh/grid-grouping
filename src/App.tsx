import * as React from 'react';
import {
  DataGridPro,
  GridApiRef,
  GridColumns,
  gridColumnVisibilityModelSelector,
  GridEvents,
  GridRowGroupingModel,
  useGridApiRef,
  LicenseInfo
} from '@mui/x-data-grid-pro';
import { Chip, Stack } from '@mui/material';

const INITIAL_GROUPING_COLUMN_MODEL = [''];

LicenseInfo.setLicenseKey('6239d8e4e4e446a3d208d638ff7603bdT1JERVI6Um9tLVRlc3QsRVhQSVJZPTIyMjMwNjEyMDAwMDAsS0VZVkVSU0lPTj0x')

const rows: any = [
  { id: 1, col1: true, col2: true, col3: true },
  { id: 2, col1: true, col2: true, col3: false },
  { id: 3, col1: true, col2: false, col3: true },
  { id: 4, col1: true, col2: false, col3: false },
  { id: 5, col1: false, col2: true, col3: true },
  { id: 6, col1: false, col2: true, col3: false },
  { id: 7, col1: false, col2: false, col3: true },
  { id: 8, col1: false, col2: false, col3: false },
];

const columns: GridColumns = [
  { field: 'col1', headerName: 'Column 1', width: 150, type: 'boolean' },
  { field: 'col2', headerName: 'Column 2', width: 150, type: 'boolean' },
  { field: 'col3', headerName: 'Column 3', width: 150, type: 'boolean' },
];

const useKeepGroupingColumnsHidden = (
  apiRef: GridApiRef,
  columns: GridColumns,
  initialModel: GridRowGroupingModel,
  leafField?: string,
) => {
  const prevModel = React.useRef(initialModel);

  React.useEffect(() => {
    apiRef.current.subscribeEvent(GridEvents.rowGroupingModelChange, (newModel: any[]) => {
      const columnVisibilityModel = {
        ...gridColumnVisibilityModelSelector(apiRef.current.state),
      };
      newModel.forEach((field: any) => {
        if (!prevModel.current.includes(field)) {
          columnVisibilityModel[field] = false;
        }
      });
      prevModel.current.forEach((field: string | number) => {
        if (!newModel.includes(field)) {
          columnVisibilityModel[field] = true;
        }
      });
      apiRef.current.setColumnVisibilityModel(columnVisibilityModel);
      prevModel.current = newModel;
    });
  }, [apiRef]);

  return React.useMemo(
    () =>
      columns.map((colDef: { field: string; }) =>
        initialModel.includes(colDef.field) ||
          (leafField && colDef.field === leafField)
          ? { ...colDef, hide: false }
          : colDef,
      ),
    [columns, initialModel, leafField],
  );
};

const App = () => {
  const apiRef = useGridApiRef();
  const [rowGroupingModel, setRowGroupingModel] = React.useState<GridRowGroupingModel>(INITIAL_GROUPING_COLUMN_MODEL);
  const rowGroupingModelStr = rowGroupingModel.join('');
  const gridColumns = useKeepGroupingColumnsHidden(
    apiRef,
    columns,
    INITIAL_GROUPING_COLUMN_MODEL,
  );
  return (
    <div style={{ height: 400, width: '100%' }}>
      <Stack
        sx={{ width: '100%', mb: 1 }}
        direction="row"
        alignItems="flex-start"
        columnGap={1}
      >
        <Chip
          label="Group by Column 1"
          onClick={() => setRowGroupingModel(['col1'])}
          variant="outlined"
          color={rowGroupingModelStr === 'col1' ? 'success' : undefined}
        />
        <Chip
          label="Group by Column 2"
          onClick={() => setRowGroupingModel(['col2'])}
          variant="outlined"
          color={rowGroupingModelStr === 'col2' ? 'success' : undefined}
        />
        <Chip
          label="Group by Column 3"
          onClick={() => setRowGroupingModel(['col3'])}
          variant="outlined"
          color={rowGroupingModelStr === 'col3' ? 'success' : undefined}
        />
      </Stack>
      <DataGridPro
        apiRef={apiRef}
        rows={rows}
        columns={gridColumns}
        rowGroupingColumnMode="single"
        rowGroupingModel={rowGroupingModel}
        experimentalFeatures={{
          rowGrouping: true,
        }}
      />
    </div>
  );
}

export default App;