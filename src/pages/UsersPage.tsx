import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, 
  Button, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import type { User } from '../services/api';

// User Form Component
const UserForm = ({ 
  user, 
  onClose, 
  onSave 
}: { 
  user?: User; 
  onClose: () => void; 
  onSave: (data: Omit<User, 'id'>) => void; 
}) => {
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              required
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              type="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {user ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Users Page Component
const UsersPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const queryClient = useQueryClient();

  // Fetch users
  const { data: users, isLoading, isError } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newUser: Omit<User, 'id'>) => createUser(newUser),
    onSuccess: (newUser) => {
      queryClient.setQueryData<User[]>(['users'], (oldUsers) => {
        if (!oldUsers) return [newUser];
        return [...oldUsers, newUser];
      });
      setSnackbar({ open: true, message: 'User created successfully!', severity: 'success' });
      setIsDialogOpen(false);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Error creating user', severity: 'error' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (updatedUser: User) => updateUser(updatedUser.id, updatedUser),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<User[]>(['users'], (oldUsers) => {
        if (!oldUsers) return [];
        return oldUsers.map(user => user.id === updatedUser.id ? updatedUser : user);
      });
      setSnackbar({ open: true, message: 'User updated successfully!', severity: 'success' });
      setEditingUser(undefined);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Error updating user', severity: 'error' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSnackbar({ open: true, message: 'User deleted successfully!', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Error deleting user', severity: 'error' });
    }
  });

  const handleCreate = () => {
    setEditingUser(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (userData: Omit<User, 'id'>) => {
    if (editingUser) {
      updateMutation.mutate({ ...editingUser, ...userData });
    } else {
      createMutation.mutate(userData);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        Error loading users. Please try again later.
      </Alert>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      p: { xs: 2, sm: 3, md: 4 },
      overflow: 'hidden',
      margin: 0,
      '& .MuiTableContainer-root': {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%'
      }
    }}>
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }} 
        gap={2}
        mb={3}
        width='100%'
      >
        <Typography variant="h4" component="h1" sx={{ mb: { xs: 2, sm: 0 } }}>
          <PersonIcon fontSize="large" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Users
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          fullWidth
          sx={{ 
            width: { xs: '100%', sm: 'auto' },
            maxWidth: { sm: '200px' } 
          }}
        >
          Add User
        </Button>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          flex: 1,
          width: '100%',
          maxWidth: '100%',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': {
            height: '6px',
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          boxShadow: 'none',
          border: '1px solid rgba(224, 224, 224, 1)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}
      >
        <Table 
          sx={{ 
            width: '100%',
            tableLayout: 'fixed',
            '& .MuiTableCell-root': {
              py: 1.5,
              px: { xs: 1, sm: 2 },
              '&:first-of-type': {
                pl: { xs: 2, sm: 3 },
                width: '10%'  // ID column
              },
              '&:nth-of-type(2)': {
                width: '30%'  // Name column
              },
              '&:nth-of-type(3)': {
                width: '20%'  // Username column
              },
              '&:nth-of-type(4)': {
                width: '30%', // Email column
                display: { xs: 'none', md: 'table-cell' }
              },
              '&:last-child': {
                pr: { xs: 2, sm: 3 },
                width: '10%',  // Actions column
                textAlign: 'right'
              }
            }
          }} 
          aria-label="users table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '60px', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ minWidth: '120px', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ minWidth: '120px', fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ 
                display: { xs: 'none', md: 'table-cell' },
                minWidth: '200px',
                fontWeight: 'bold'
              }}>
                Email
              </TableCell>
              <TableCell align="right" sx={{ width: '120px', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  {user.email}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Tooltip title="Edit">
                      <IconButton 
                        onClick={() => handleEdit(user)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={() => handleDelete(user.id)} 
                        color="error"
                        disabled={deleteMutation.isPending}
                        size="small"
                      >
                        {deleteMutation.isPending ? (
                          <CircularProgress size={20} />
                        ) : (
                          <DeleteIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {(isDialogOpen || editingUser) && (
        <UserForm 
          user={editingUser} 
          onClose={() => {
            setIsDialogOpen(false);
            setEditingUser(undefined);
          }} 
          onSave={handleSave} 
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: { xs: 'calc(100% - 32px)', sm: '400px' },
            mx: { xs: 2, sm: 0 },
            mb: { xs: 2, sm: 3 }
          }
        }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersPage;
