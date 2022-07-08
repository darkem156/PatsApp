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
            <form>
                <div>
                    <input className='text-sign' placeholder='name' type="text" id="name" />
                </div>
                <div>
                    <input className='text-sign' placeholder='user_name' type="text" id="user_name" />
                </div>
                <div>
                    <input className='text-sign' placeholder='email' type="text" id="email" />
                </div>
                <div>
                    <input className='text-sign' placeholder='password' type="password" id="password" />
                </div>
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