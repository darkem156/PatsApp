import React, { Component } from 'react';

class Msg extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        if (this.props.sender === this.props.sessionData.user_name)
        {
            return(
                <div className='msg-row'>
                    <div className='msg-container received'></div>
                    <div className='msg-container send'>
                            <div className='msg-text-container'>
                                <p className='msg-text'>{this.props.msgText}</p>
                                <p className='msg-date'>{this.props.msgDate.substr(15, 6)}</p>
                            </div>
                    </div>
                </div>
            );
        }
        else
        {
            return(
                <div className='msg-row'>
                    <div className='msg-container received'>
                            <div className='msg-text-container'>
                                <p className='msg-text'>{this.props.msgText}</p>
                                <p className='msg-date'>{this.props.msgDate.substr(15, 6)}</p>
                            </div>
                    </div>
                    <div className='msg-container send'></div>
                </div>
            );
        }
    }
}

export default Msg;