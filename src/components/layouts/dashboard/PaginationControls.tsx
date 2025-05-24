import React from 'react';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

interface PaginationControlsProps {
  page: number;
  rowsPerPage: number;
  pageCount: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onRowsPerPageChange: (value: number) => void;
  rowsPerPageOptions?: number[];
  containerSx?: object;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  rowsPerPage,
  pageCount,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 20, 50],
  containerSx = {},
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: '100%', ...containerSx }}
      direction={isSmall ? 'column' : 'row'}
    >
      <Grid>
        <FormControl size="small" fullWidth sx={{ minWidth: 150 }}>
          <InputLabel id="rows-per-page-label">Số dòng/trang</InputLabel>
          <Select
            labelId="rows-per-page-label"
            id="rows-per-page"
            value={rowsPerPage}
            label="Số dòng/trang"
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          >
            {rowsPerPageOptions.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid>
        <Box
          sx={{
            display: 'flex',
            justifyContent: isSmall ? 'center' : 'flex-end',
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            width: '100%',
          }}
        >
          <Pagination
            count={pageCount}
            page={page}
            onChange={onPageChange}
            color="primary"
            showFirstButton
            showLastButton
            size="medium"
            siblingCount={0}
            boundaryCount={0}
            sx={{
              '& .MuiPagination-ul': {
                flexWrap: 'nowrap',
                gap: '4px',
              },
              '& .MuiPaginationItem-root': {
                minWidth: { xs: '32px', sm: '36px' },
                height: { xs: '32px', sm: '36px' },
              },
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default PaginationControls;
