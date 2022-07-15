import React, {useState, useEffect} from 'react';
import { Button, Paper, Typography, Grid, Avatar, Container } from '@material-ui/core';
import useStyles from './styles.js';
import { GoogleLogin } from 'react-google-login';
import LockOutlinedBody from '@material-ui/icons/LockOutlined';
import Input from './Input.js';
import Icon from './icon.js';
import { gapi } from 'gapi-script';
import { useDispatch } from 'react-redux';
import { AUTH } from '../../constants/actionTypes';
import { useNavigate } from 'react-router-dom';
import { signup, signin } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const navigate = useNavigate();
    const classes=useStyles();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        function start() {
        gapi.client.init({
        clientId:"285793690196-jbk00j132ji0lisnplb8p0ueobin92qf.apps.googleusercontent.com",
        scope: 'email',
          });
           }
          gapi.load('client:auth2', start);
           }, []);

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)

    const handleSubmit = (e) => {
        e.preventDefault();

        if(isSignup){
            dispatch(signup(formData, navigate));
        } else {
            dispatch(signin(formData, navigate));
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]:e.target.value });
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    }

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            dispatch({ type : AUTH, data : { result, token } });

            navigate('/');
        } catch (error) {
            console.warn(error);
        }
    }
    
    const googleFailure = (error) => {
        console.warn('Google SignIn was unsuccessful.Try Again Later', error);
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedBody />
                </Avatar>
                <Typography variant="h5">{ isSignup ? 'SignUp' : 'SignIn' }</Typography>
                <form className={classes.form} onSubmit={handleSubmit} >
                    <Grid container spacing={2} >
                        { isSignup && (
                                <>
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                    <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                                </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={ showPassword ? "text" : "password" } handleShowPassword={handleShowPassword} />
                        { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} >
                        { isSignup ? 'Sign Up' : 'Sign In' }
                    </Button>
                    <GoogleLogin 
                        clientId='285793690196-jbk00j132ji0lisnplb8p0ueobin92qf.apps.googleusercontent.com'
                        render={(renderProps) => (
                            <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained" >
                                Google login
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy="single_host_origin"
                    />
                    <Grid container justify='flex-end' >
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignup ? 'Already have an account ? Sign In' : 'Dont have an account ? Sign Up' }
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default Auth;