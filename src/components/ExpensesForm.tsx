import { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addExpenseAPI, Expenses, fetchExpenseById, editExpenseAPI } from '../reducer/expensesReducer';
import { useNavigate, useParams } from 'react-router-dom';
import { Add, Remove } from '@mui/icons-material';
import { AppDispatch, RootState } from '../store';
import { Expense } from '../reducer/expensesReducer';

const ExpenseForm = () => {
  const [user, setUser] = useState('');
  const [description, setDescription] = useState('');
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState('');
  const [byCategory, setByCategory] = useState<Record<string, number>>({ '': 0});
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isNew, setIsNew] = useState(true)

  
  const expensesById = useSelector((state: RootState) => state.expenses.currentExpense) as Expense | null;

  useEffect(() => {
    if(id) {
        setIsNew(false);
        dispatch(fetchExpenseById(id))
    }
  },[id])

  useEffect(() => {
    if(!isNew && expensesById) {
        console.log('expensesById', expensesById)
        setUser(expensesById.user); // ✅ safe access
        setDescription(expensesById.description);
        setTotal(expensesById.total);
        setDate(expensesById.date.slice(0, 10)); // format YYYY-MM-DD
        setByCategory(expensesById.byCategory);
    }
  }, [isNew, expensesById])

  useEffect(() => {
    const sum = Object.values(byCategory).reduce((acc, val) => acc + Number(val), 0);
    setTotal(sum);
  }, [byCategory]);


  const handleSubmit = (e:any) => {
    e.preventDefault();
    dispatch(addExpenseAPI({ user, description, total: Number(total), date, byCategory }));
    navigate('/');
  };

  const handleUpdate = (e: any) => {
    e.preventDefault();
    if (!id) return;

    dispatch(
        editExpenseAPI({
        id,
        expense: {
            user,
            description,
            total: Number(total),
            date,
            byCategory,
        },
        })
    );
    navigate('/');
  }

  const handleCategoryChange = (index: number, field: 'type' | 'amount', value: string) => {
    const entries = Object.entries(byCategory);

    if (field === 'type') {
        const amount = entries[index][1];  // Get the amount
        entries[index][0] = value;        // Update type (key)
    } else {
        entries[index][1] = Number(value);  // Update amount
    }

    setByCategory(Object.fromEntries(entries));
  };

  const addCategory = () => setByCategory({ ...byCategory, '': 0 });;
  const removeCategory = (type: string) => {
    const { [type]: _, ...rest } = byCategory;
    setByCategory(rest);
  };

  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, m: 'auto', mt: 5 }}>
        <TextField label="User" value={user} onChange={(e) => setUser(e.target.value)} required />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <TextField type="number" label="Total" value={total} InputProps={{ readOnly: true }} />
        <TextField type="date" label="Date" value={date} onChange={(e) => setDate(e.target.value)} required InputLabelProps={{shrink: true}} />
        <Typography variant="h6">Categories</Typography>
        {Object.entries(byCategory).map(([type, amount], index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
                label="Category Type"
                value={type}
                onChange={(e) => handleCategoryChange(index, 'type', e.target.value)}
                required
            />
            <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => handleCategoryChange(index, 'amount', e.target.value)}
                required
            />
            <IconButton onClick={() => removeCategory(type)} disabled={byCategory.length === 1}>
                <Remove />
            </IconButton>
            </Box>
        ))}
        <Button startIcon={<Add />} onClick={addCategory} variant="outlined">Add Category</Button>

        {isNew ?  
        <Button variant="contained" onClick={(event) => handleSubmit(event)}>Add Expense</Button> :
            <Button variant="contained" onClick={(event) => handleUpdate(event)}>update Expense</Button>
        }
    </Box>
  );
};

export default ExpenseForm;
