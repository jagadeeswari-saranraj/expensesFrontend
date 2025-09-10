import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { Expense, fetchExpenseById } from '../reducer/expensesReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';



const ExpenseView = () => {

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  
  const expensesById = useSelector((state: RootState) => state.expenses.currentExpense) as Expense | null;

  useEffect(() => {
    if(id) {
        dispatch(fetchExpenseById(id))
    }
  },[id])
  return (
    <div>
    {expensesById ? 

    <Card sx={{ maxWidth: 500, margin: '20px auto', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User: {expensesById.user}
        </Typography>

        <Typography variant="body1" gutterBottom>
          Description: {expensesById.description}
        </Typography>

        <Typography variant="body1" gutterBottom>
          Date: {new Date(expensesById.date).toLocaleDateString()}
        </Typography>

        <Typography variant="body1" gutterBottom>
          Total: {expensesById.total}
        </Typography>

        <Box mt={2}>
          <Typography variant="subtitle1">Categories:</Typography>
          {Object.entries(expensesById.byCategory).map(([category, amount]) => (
            <Typography key={category} variant="body2">
              {category}: {amount}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/')}>Back</Button>
          <Button variant="contained" onClick={() => navigate(`/edit/${id}`)}>Edit</Button>
        </Box>
      </CardContent>
    </Card> : <span>No data in this Id</span>

        }
        </div>
  );
};

export default ExpenseView;
