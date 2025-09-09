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
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Article as ArticleIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { 
  getPosts, 
  getUsers, 
  createPost, 
  updatePost, 
  deletePost
} from '../services/api';
import type { Post, User } from '../services/api';

// Post Form Component
const PostForm = ({ 
  post, 
  users,
  onClose, 
  onSave 
}: { 
  post?: Post; 
  users: User[];
  onClose: () => void; 
  onSave: (data: Omit<Post, 'id'>) => void; 
}) => {
  const [formData, setFormData] = useState<Omit<Post, 'id'>>({
    userId: post?.userId || 1,
    title: post?.title || '',
    body: post?.body || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'userId' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{post ? 'Edit Post' : 'Add New Post'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="user-select-label">Author</InputLabel>
              <Select
                labelId="user-select-label"
                name="userId"
                value={formData.userId}
                label="Author"
                onChange={handleChange}
                required
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} (@{user.username})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              required
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            
            <TextField
              required
              name="body"
              label="Content"
              value={formData.body}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {post ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Posts Page Component
const PostsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const queryClient = useQueryClient();

  // Fetch data
  const { data: posts, isLoading, isError } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newPost: Omit<Post, 'id'>) => createPost(newPost),
    onSuccess: (newPost) => {
      // Optimistic update: Add new post to cache
      queryClient.setQueryData<Post[]>(['posts'], (oldPosts) => {
        if (!oldPosts) return [newPost];
        return [...oldPosts, newPost];
      });
      setSnackbar({ open: true, message: 'Post created successfully!', severity: 'success' });
      setIsDialogOpen(false);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Error creating post', severity: 'error' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (updatedPost: Post) => updatePost(updatedPost.id, updatedPost),
    onSuccess: (updatedPost) => {
      // Optimistic update: Update post in cache
      queryClient.setQueryData<Post[]>(['posts'], (oldPosts) => {
        if (!oldPosts) return [];
        return oldPosts.map(post => post.id === updatedPost.id ? updatedPost : post);
      });
      setSnackbar({ open: true, message: 'Post updated successfully!', severity: 'success' });
      setEditingPost(undefined);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Error updating post', severity: 'error' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setSnackbar({ open: true, message: 'Post deleted successfully!', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Error deleting post', severity: 'error' });
    }
  });

  const handleCreate = () => {
    setEditingPost(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (postData: Omit<Post, 'id'>) => {
    if (editingPost) {
      updateMutation.mutate({ ...editingPost, ...postData });
    } else {
      createMutation.mutate(postData);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getUserName = (userId: number) => {
    const user = users?.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
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
        Error loading posts. Please try again later.
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
          <ArticleIcon fontSize="large" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Posts
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
          Add Post
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
                width: '60%'  // Title column takes more space
              },
              '&:nth-of-type(2)': {
                width: '20%'  // Author column
              },
              '&:last-child': {
                pr: { xs: 2, sm: 3 },
                width: '20%',  // Actions column
                textAlign: 'right'
              }
            }
          }} 
          aria-label="posts table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: '200px', fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ 
                display: { xs: 'none', md: 'table-cell' },
                minWidth: '150px',
                fontWeight: 'bold'
              }}>
                Author
              </TableCell>
              <TableCell align="right" sx={{ width: '140px', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts?.map((post) => (
              <TableRow key={post.id} hover>
                <TableCell>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      maxWidth: { xs: '200px', sm: 'none' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <ArticleIcon color="action" sx={{ flexShrink: 0 }} />
                    <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {post.title}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Link to={`/users/${post.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {getUserName(post.userId)}
                  </Link>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton 
                        component={Link}
                        to={`/posts/${post.id}`}
                        color="info"
                        size="small"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton 
                        onClick={() => handleEdit(post)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={() => handleDelete(post.id)} 
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

      {users && (isDialogOpen || editingPost) && (
        <PostForm 
          post={editingPost} 
          users={users}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingPost(undefined);
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

export default PostsPage;
