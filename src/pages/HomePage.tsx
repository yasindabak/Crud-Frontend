import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Paper)(({ theme }) => ({
  height: '100%',
  minHeight: '300px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '250px'
  }
}));

const HomePage = () => {
  return (
    <Container 
      maxWidth={false} 
      disableGutters
      sx={{
        width: '100vw',
        minHeight: '100vh',
        py: { xs: 3, sm: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        margin: 0,
        overflowX: 'hidden'
      }}>
      <Container 
        maxWidth="md" 
        sx={{ 
          textAlign: 'center', 
          mb: { xs: 4, sm: 6 },
          width: '100%',
          px: { xs: 2, sm: 3 }
        }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          fontWeight: 700,
          color: 'primary.main',
          mb: 2
        }}>
          Welcome to Frontend Task
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ 
          fontSize: { xs: '1rem', sm: '1.25rem' },
          lineHeight: 1.6
        }}>
          A simple CRUD application using React, TypeScript, and Material-UI
        </Typography>
      </Container>

      <Container 
        maxWidth="lg" 
        sx={{ 
          width: '100%',
          px: { xs: 2, sm: 3 },
          boxSizing: 'border-box'
        }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, minmax(300px, 1fr))'
          },
          gap: { xs: 3, sm: 4 },
          width: '100%',
          '& > div': {
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0
          },
          '@media (max-width: 600px)': {
            gridTemplateColumns: '1fr',
            gap: '24px'
          }
        }}>
          <Box>
            <StyledCard elevation={3}>
              <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 2
                }}>
                  Users
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ flexGrow: 1, mb: 3 }}>
                  View, create, update, and delete user records.
                </Typography>
                <Button 
                  component={Link} 
                  to="/users" 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  fullWidth
                  sx={{ mt: 'auto' }}
                >
                  Manage Users
                </Button>
              </Box>
            </StyledCard>
          </Box>

          <Box>
            <StyledCard elevation={3}>
              <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 2
                }}>
                  Posts
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ flexGrow: 1, mb: 3 }}>
                  View, create, update, and delete blog posts.
                </Typography>
                <Button 
                  component={Link} 
                  to="/posts" 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  fullWidth
                  sx={{ mt: 'auto' }}
                >
                  Manage Posts
                </Button>
              </Box>
            </StyledCard>
          </Box>
        </Box>
      </Container>
    </Container>
  );
};

export default HomePage;
