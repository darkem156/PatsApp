import React, { Component } from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

class Sign extends Component
{
    state = 
    {
        signIn: true,
        error: {
            "state": false,
            "error": 'Error por defecto' 
        }
    }

    sendMsg = (sender, msgText, date, receiver) =>
    {
        socket.emit("chat message", {"sender": sender, "msgText": msgText, "msgDate": date, "receiver": receiver});
    }

    logIn = () =>
    {
        let user = document.getElementById('user');
        let password = document.getElementById('password');

        fetch('/signIn',
        {
            method: 'POST',
            body: JSON.stringify({"user": user.value, "password": password.value}),
            headers:
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => 
        {
            if(data.error != '') 
            {
                this.setState({error: {state: true, error: data.error}});
            }
            else if(data.session)
            {
                location.reload();
            }
        })
    }

    signUp = () =>
    {
        let name = document.getElementById('name').value;
        let user_name = document.getElementById('user_name').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        fetch('/signUp',
        {
            method: 'POST',
            body: JSON.stringify({"user_name": user_name, "name": name, "email": email, "password": password}),
            headers:
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => 
        {
            if(data.error != '') 
            {
                this.setState({error: {state: true, error: data.error}});
            }
            else
            {
                this.setState({signIn: true, error: {state: true, error: 'Usuario creado correctamente'}});
            }
        })
    }

    render()
    {
        let error;
        if (this.state.error.state)
        {
            error = <div className='alert alert-danger alert-dismissible fade show' role="alert" id="alert">
                {this.state.error.error}
                <button onClick={() => {this.setState({error: {state: false}})}} type="button" className="close" id="close-alert">
                    <span>&times;</span>
                </button>
            </div>
        }

        if (this.state.signIn)
        {
            return(
                <div>
                    {error}
                    <div id="sign-container">
                        <div>
                            <SignIn logIn={this.logIn}/>
                            <button className='changeForm' onClick={() => this.setState({signIn: !this.state.signIn})}>No tengo una cuenta</button>
                        </div>
                    </div>
                </div>
            );
        }
        return(
            <div>
                {error}
                <div id="sign-container">
                    <div>
                        <SignUp signUp={this.signUp} />
                        <button className='changeForm' onClick={() => this.setState({signIn: !this.state.signIn})}>Ya tengo una cuenta</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sign;