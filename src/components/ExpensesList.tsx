import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchExpenses, deleteExpenseAPI } from '../reducer/expensesReducer';
import { Expense } from '../reducer/expensesReducer';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@mui/material';
import { AppDispatch, RootState } from '../store';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import { useNavigate } from 'react-router-dom';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const ExpenseList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const expenses = useSelector((state: RootState) => state.expenses.list);
  const navigate = useNavigate();
  const [sortorder, setSortOrder] = useState('asc')

  useEffect(() => {
    dispatch(fetchExpenses({
        sortField: "date", sortOrder: "asc"
    }));
  }, [dispatch]);

  const handleEdit = (expense: Expense) => {
    navigate(`/edit/${expense._id}`);  // Navigate to edit form page
  };

  const handleview = (id:string) => {
    navigate(`/view/${id}`); //Navigate to view page
  } 

  const handleDelete = (id: string) => {
    dispatch(deleteExpenseAPI(id));
  };

  const handlesort = (field: string, sort: string) => {
    dispatch(fetchExpenses({
        sortField: field, sortOrder: sort
    }));
    setSortOrder(sortorder === 'asc' ? 'desc' : 'asc');
  }

  return (
    <Box sx={{ maxWidth: 1000, m: 'auto', mt: 5 }}>
        <TableContainer component={Paper}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell><strong>User</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Total</strong>
                    <IconButton onClick={() => handlesort('total', sortorder)} color="error">
                        <SwapVertIcon />
                    </IconButton>
                </TableCell>
                <TableCell><strong>Date</strong>
                    <IconButton onClick={() => handlesort('date', sortorder)} color="error">
                        <SwapVertIcon />
                    </IconButton>
                </TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
            </TableRow>
            </TableHead>

            <TableBody>
            {expenses && expenses.map((exp:Expense, index) => (
                <TableRow key={index}>
                <TableCell>{exp.user}</TableCell>
                <TableCell>{exp.description}</TableCell>
                <TableCell>{exp.total}</TableCell>
                <TableCell>{new Date(exp.date).toLocaleDateString()}</TableCell>
                <TableCell>
                    {Object.entries(exp.byCategory).map(([cat, amount], i) => (
                    <Typography key={i}>
                        {cat}
                    </Typography>
                    ))}
                </TableCell>
                <TableCell>                    
                    <IconButton onClick={() => handleview(exp._id)} color="primary">
                        <PreviewIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(exp)} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(exp._id)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </Box>
  );
};

export default ExpenseList;
