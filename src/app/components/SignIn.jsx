import React, { Component } from 'react';

class SignIn extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <form id="form-sign-in">
                <div>
                    <input className='text-sign' placeholder='Email o Usuario' id="user" type="text" />
                </div>
                <div>
                    <input className='text-sign' placeholder='Password' id="password" type="password" />
                </div>
                <button className='button-sign' onClick={
                    (e) =>
                    {
                        e.preventDefault();
                        this.props.logIn();
                    } 
                }>Sign In</button>
            </form>
        );
    }
}

export default SignIn;