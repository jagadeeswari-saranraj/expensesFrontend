import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Button } from '@mui/material';
import ExpensesForm from './components/ExpensesForm';
import ExpensesList from './components/ExpensesList';
import ExpenseView from './components/ExpenseView';

function App() {
  return (
    <div className="App">
      <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/add">Add Expense</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<ExpensesList />} />
          <Route path="/add" element={<ExpensesForm />} />
          <Route path="/edit/:id" element={<ExpensesForm />} />
          <Route path="/view/:id" element={<ExpenseView />} />
        </Routes>
      </Container>
    </Router>
    </div>
  );
}

export default App;
