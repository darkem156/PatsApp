import React, { Component } from 'react';

class Contact extends Component
{
    constructor(props)
    {
        super(props)
    }
    render()
    {
        return(
            <div className='contact'>
                <div className='contact-data'>
                    <p className='contact-user'>@{this.props.contact_user}</p>
                    <p className='contact-name'>{this.props.contact_name}</p>
                </div>
                <div className='msg-data'>
                    <p className='contact-msg'>{this.props.msg}</p>
                    <p className='contact-msg-date'>{this.props.date}</p>
                </div>
            </div>
        );
    }
}

export default Contact;