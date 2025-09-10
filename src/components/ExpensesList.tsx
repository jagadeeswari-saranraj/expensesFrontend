import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchExpenses, deleteExpenseAPI, addExpenseAPI } from '../reducer/expensesReducer';
import { Expense, Expenses } from '../reducer/expensesReducer';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Button } from '@mui/material';
import { AppDispatch, RootState } from '../store';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import { useNavigate } from 'react-router-dom';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Papa from 'papaparse';

const ExpenseList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const expenses = useSelector((state: RootState) => state.expenses.list || []);
  const navigate = useNavigate();
  const [sortorder, setSortOrder] = useState('asc')
  const [enableImport, setEnableImport] = useState(false)

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

  const exportToCSV = (expenses: Expense[]) => {
    if (!expenses || expenses.length === 0) return;

    // Create CSV headers
    const headers = ['User', 'Description', 'Total', 'Date', 'Category'];

    // Map expenses to rows
    const rows = expenses.map(exp => [
        exp.user,
        exp.description,
        exp.total,
        new Date(exp.date).toLocaleDateString(),
        Object.entries(exp.byCategory)
        .map(([cat, amount]) => `${cat}: ${amount}`)
        .join('; ')
    ]);

    // Combine headers and rows
    const csvContent =
        [headers, ...rows]
        .map(row => row.map(value => `"${value}"`).join(','))
        .join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `expenses_${new Date().toISOString()}.csv`);
    link.click();
  };

  // format date from import data
  const parseDate = (input: string): string => {
    const parsed = new Date(input);
    return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  };

  // format byCategory from import data
  const parseByCategory = (input: string): Record<string, number> => {
    const obj: Record<string, number> = {};

    input.split(';').forEach((part) => {
        const [key, value] = part.split(':').map((s) => s.trim());
        if (key && value && !isNaN(Number(value))) {
        obj[key] = Number(value);
        }
    });

    return obj;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        console.log('Parsed Data:', results.data);

        results.data.forEach((row: any) => {
            const expense: Expenses = {
                user: row.user,
                description: row.description,
                total: Number(row.total),
                date: parseDate(row.date),
                byCategory: parseByCategory(row.byCategory)
            };

            console.log('imported data', expense)

            dispatch(addExpenseAPI(expense));
        });
      },
      error: (error: any) => {
        console.error('CSV Parse Error:', error);
      },
    });
    setEnableImport(false)
  };

  return (
    <Box sx={{ maxWidth: 1000, m: 'auto', mt: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
            <Button color="primary" variant="outlined" onClick={() => exportToCSV(expenses)}>
                Export CSV
            </Button>
            <Button color="primary" variant="contained" onClick={() => setEnableImport(true)}>
                import  CSV
            </Button>
        </Box>

        {enableImport &&
            <Box sx={{ my: 4 }}>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    style={{ display: 'block', marginBottom: '16px' }}
                />
            </Box>
        }

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
            {Array.isArray(expenses) && expenses.map((exp:Expense, index) => (
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
