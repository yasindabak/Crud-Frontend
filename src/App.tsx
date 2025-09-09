import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import PostsPage from './pages/PostsPage';

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: '#f8e341',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            width: '100%',
            maxWidth: '100%',
            margin: 0,
            padding: 0
          }}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Frontend Task
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  '& a': {
                    color: 'black',
                    textDecoration: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }
                  },
                  '& a.active': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    fontWeight: 600,
                    border: '1px solid rgba(255, 255, 255, 0.4)'
                  }
                }}>
                  <Link to="/">Home</Link>
                  <Link to="/users">Users</Link>
                  <Link to="/posts">Posts</Link>
                </Box>
              </Toolbar>
            </AppBar>
            <Box sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/users/*" element={<UsersPage />} />
                <Route path="/posts/*" element={<PostsPage />} />
              </Routes>
            </Box>
            <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
              <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                  Frontend Task - {new Date().getFullYear()}
                </Typography>
              </Container>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
