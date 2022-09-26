import React, { Component } from 'react';

class SignUp extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <form id="form-sign-in">
              <input className='text-sign' placeholder='name' type="text" id="name" />
              <input className='text-sign' placeholder='user_name' type="text" id="user_name" />
              <input className='text-sign' placeholder='email' type="text" id="email" />
              <input className='text-sign' placeholder='password' type="password" id="password" />
              <button className='button-sign' onClick={
                (e) =>
                {
                  e.preventDefault();
                  this.props.signUp();
                }
              }>Sign Up</button>
            </form>
        );
    }
}

export default SignUp;
