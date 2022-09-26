import React, { Component } from 'react';
import Contact from './Contact.jsx';
import Chat from './Chat.jsx';
import Search from './Search.jsx';

const socket = io();

socket.on("connect", () =>
{
})

let messages = JSON.parse(localStorage.getItem("messages"));
if(messages === null)
{
    localStorage.setItem("messages", JSON.stringify({}));
    messages = JSON.parse(localStorage.getItem("messages"));
}

class App extends Component
{
    state =
    {
        logged: {},
        chat: 
        {
            "name": "",
            "user_name": ""
        },
        messages: messages
    }

    sendMsg = (sender, msgText, date, receiver) =>
    {
        socket.emit("chat message", {"sender": sender, "msgText": msgText, "msgDate": date, "receiver": receiver});
    }

    receiveMsg = (data) =>
    {
        if (data.sender === this.state.logged.sessionData.user_name)
        {
            if (this.state.messages[data.receiver])
            {
                this.state.messages[data.receiver].push(data);
                this.setState({messages: this.state.messages});
            }
            else
            {
                let messages = this.state.messages;
                messages[data.receiver] = [data];
                this.setState({messages: messages});
            }
        }
        else
        {
            if (this.state.messages[data.sender])
            {
                this.state.messages[data.sender].push(data);
                this.setState({messages: this.state.messages});
            }
            else
            {
                let messages = this.state.messages;
                messages[data.sender] = [data];
                this.setState({messages: messages});
            }
        }
        localStorage.setItem("messages", JSON.stringify(this.state.messages));
    }

    getData = async () =>
    {
        let resp = await fetch('/signIn',
        {
            method: 'POST',
            body: JSON.stringify({"user": "proof"}),
            headers:
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let res = await resp.json();
        this.setState({logged: res});
    }

    selectUser = (name, user_name) =>
    {
        this.setState(
            {
                chat:
                {
                    "name": name,
                    "user_name": user_name
                }
            })
    }

    async componentDidMount()
    {
        this.getData();
        socket.on("chat message", data =>
        {
            this.receiveMsg(data);
        });
    }

    render()
    {
        if (!this.state.logged.sessionData) return;
        let contactos = []
        for (let contacto in this.state.messages) 
        {
            contacto = this.state.messages[contacto];
            let msg = contacto[contacto.length-1];
            if (msg.sender === this.state.logged.sessionData.user_name)
            {
                if (this.state.chat.user_name === msg.receiver)
                {
                    contactos.push(
                        <div className='contact-container selected' key={msg.receiver} onClick={() => {this.setState({chat: {"name": msg.receiver_name, "user_name": msg.receiver}})}}>
                            <Contact contact_user={msg.receiver} contact_name={msg.receiver_name} msg={`Tú: ${msg.msgText}`} msgDate={msg.msgDate} date={msg.msgDate.substr(15, 6)} />
                        </div>
                    )
                }
                else
                {
                    contactos.push(
                        <div className='contact-container' key={msg.receiver} onClick={() => {this.setState({chat: {"name": msg.receiver_name, "user_name": msg.receiver}})}}>
                            <Contact contact_user={msg.receiver} contact_name={msg.receiver_name} msg={`Tú: ${msg.msgText}`} msgDate={msg.msgDate} date={msg.msgDate.substr(15, 6)} />
                        </div>
                    )
                }
            }
            else
            {
                if (this.state.chat.user_name === msg.sender)
                {
                    contactos.push(
                        <div className='contact-container selected' key={msg.sender} onClick={() => {this.setState({chat: {"name": msg.sender_name, "user_name": msg.sender}})}}>
                            <Contact contact_user={msg.sender} contact_name={msg.sender_name} msg={msg.msgText} msgDate={msg.msgDate} date={msg.msgDate.substr(15, 6)} />
                        </div>
                    )
                }
                else
                {
                    contactos.push(
                        <div className='contact-container' key={msg.sender} onClick={() => {this.setState({chat: {"name": msg.sender_name, "user_name": msg.sender}})}}>
                            <Contact contact_user={msg.sender} contact_name={msg.sender_name} msg={msg.msgText} msgDate={msg.msgDate} date={msg.msgDate.substr(15, 6)} />
                        </div>
                    )
                }
            }
        }
        contactos.sort((a, b) =>
        {
            if (Date.parse(a.props.children.props.msgDate) > Date.parse(b.props.children.props.msgDate)) return -1;
            else return 1;
        });

        let userChat = this.state.chat.user_name != "" ? `@${this.state.chat.user_name}` : "";
        
        return ( 
            <div className='app-container'>
                <div className='user-chats-container'>
                    <div className='user-data'>
                        <h3>@{this.state.logged.sessionData.user_name}</h3>
                        <h3>{this.state.logged.sessionData.name}</h3>
                    </div>
                    <div className='chats-container'>
                        <Search selectUser={this.selectUser} />
                        <div className='chats'>
                            {contactos}
                        </div>
                    </div>
                </div>
                <div className='chat-container'>
                    <div className='chat-data'>
                        <p id="user-name">{this.state.chat.name}</p>
                        <p id="user-user_name">{userChat}</p>
                    </div>
                    <Chat messages={this.state.messages} chat={this.state.chat.user_name} sendMsg={this.sendMsg} sessionData={this.state.logged.sessionData} />
                </div>
            </div>
        );
    }
}

export default App;
