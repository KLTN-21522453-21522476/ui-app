import React from 'react';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

interface PaginationControlsProps {
  page: number;
  rowsPerPage: number;
  pageCount: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onRowsPerPageChange: (value: number) => void;
  rowsPerPageOptions?: number[];
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  rowsPerPage,
  pageCount,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 20, 50],
}) => (
  <Box 
    display="flex" 
    justifyContent="space-between" 
    alignItems="center" 
    sx={{ 
      borderTop: '1px', 
      padding: '16px',
      width: '100%', 
      boxSizing: 'border-box', 
    }}
  >
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="rows-per-page-label">Số dòng/trang</InputLabel>
      <Select
        labelId="rows-per-page-label"
        id="rows-per-page"
        value={rowsPerPage}
        label="Số dòng/trang"
        onChange={e => onRowsPerPageChange(Number(e.target.value))}
      >
        {rowsPerPageOptions.map((size) => (
          <MenuItem key={size} value={size}>{size}</MenuItem>
        ))}
      </Select>
    </FormControl>
    <Pagination
      count={pageCount}
      page={page}
      onChange={onPageChange}
      color="primary"
      showFirstButton
      showLastButton
      size="medium"
      siblingCount={1}
      sx={{
        '& .MuiPagination-ul': {
          flexWrap: 'nowrap', // Ngăn các nút pagination xuống dòng
        }
      }}
    />
  </Box>
);

export default PaginationControls;
