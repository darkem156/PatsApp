import React, { Component } from 'react';
import Msg from './Msg';

class Chat extends Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            msg: '',
            messages: this.props.messages
        }
    }

    handleChange = (event) =>
    {
        this.setState({msg: event.target.value})
    }

    componentDidMount()
    {
    }

    render()
    {
        if (this.props.chat === "")
        {
            return (
                <div id="bienvenida">
                    <h1>Bienvenido a PatsApp.</h1>
                    <h2>Selecciona o inicia un chat para empezar a hablar</h2>
                </div>
            );
        }
        else
        {
            let messages = this.state.messages[this.props.chat];
            if (messages)
            {
                messages = messages.map(msg =>
                    {
                        return <Msg key={msg.msgDate} sessionData={this.props.sessionData} sender={msg.sender} msgText={msg.msgText} msgDate={msg.msgDate} />
                    }
                )
            }
            else
            {
                messages = <div></div>
            }
            return(
                <div className='chat'>
                    <div id='chat-msg-container' className='chat-msg-container'>
                        <div>
                            {messages}
                        </div>
                    </div>
                    <form className='write-msg'>
                        <input id="msg" type="text" value={this.state.msg} onChange={this.handleChange} placeholder='Escribe tu mensaje'></input>
                        <button id="send" onClick={(e) => {e.preventDefault();this.props.sendMsg("ola", this.state.msg, (new Date()).toString(), this.props.chat); this.setState({msg: ''})}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="4vw" height="4vh" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            );
        }
    }
}

export default Chat;