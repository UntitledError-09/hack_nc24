import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Link, Grid } from '@mui/material';
import { Autocomplete } from '@mui/material'; // Import Autocomplete
import { makeStyles } from '@mui/styles';

const interestsList = [
    'Art', 'Music', 'Sports', 'Travel', 'Reading', 'Cooking', 'Fitness', 'Photography', 'Movies', 'Fashion',
    'Technology', 'Gaming', 'Writing', 'Dancing', 'Nature', 'History', 'Science', 'Food', 'Health', 'Education',
    'Animals', 'Crafts', 'Shopping', 'Cars', 'Politics', 'Finance'
];

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '20px',
        width: '300px',
        margin: 'auto',
        marginTop: '100px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
}));

const LoginSignup = ({ setIsLoggedIn, isLogin, setIsLogin }) => {
    const classes = useStyles();
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [interests, setInterests] = useState([]);
    const [age, setAge] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            // Perform login
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: displayName, password })
            });
            if (response.ok) {
                // If login is successful
                const data = await response.json();
                sessionStorage.setItem('username', displayName); // Save username in localStorage
                setIsLoggedIn(true); // Set isLoggedIn to true
                
                // Call get-all-users and store data.users in the session
                const usersResponse = await fetch('/get-all-users');
                if (usersResponse.ok) {
                    const userData = await usersResponse.json();
                    sessionStorage.setItem('userData', JSON.stringify(userData.users));
                }
            } else {
                alert('Login failed. Please try again.'); // Show error message
            }
        } else {
            // Perform signup
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: displayName,
                    interests,
                    age: parseInt(age),
                    strengths: [location], // Assuming "strengths" represent location
                    password,
                    matched_users: [],
                    pending_invites: []
                })
            });
            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('username', displayName); // Save username in localStorage
                setIsLoggedIn(true); // Set isLoggedIn to true
                
                // Call get-all-users and store data.users in the session
                const usersResponse = await fetch('/get-all-users');
                if (usersResponse.ok) {
                    const userData = await usersResponse.json();
                    sessionStorage.setItem('userData', JSON.stringify(userData.users));
                }
            } else {
                alert('Signup failed. Please try again.'); // Show error message
            }
        }
    };

    return (
        <Container>
            <Paper elevation={3} className={classes.paper}>
                <Typography variant="h5" gutterBottom>
                    {isLogin ? 'Login' : 'Sign Up'}
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <Autocomplete
                                multiple
                                options={interestsList}
                                value={interests}
                                onChange={(event, newValue) => setInterests(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Interests"
                                        placeholder="Select Interests"
                                    />
                                )}
                            />
                            <TextField
                                label="Age"
                                variant="outlined"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                required
                                type="number" // Set the type to "number"
                            />
                            <TextField
                                label="Location"
                                variant="outlined"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </>
                    )}
                    <TextField
                        label="Display Name"
                        variant="outlined"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default LoginSignup;