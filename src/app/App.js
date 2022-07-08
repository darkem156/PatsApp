import React, { Component } from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Contact from './components/Contact';
import Chat from './components/Chat';
import Search from './components/Search';

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
        logged: {"session": false},
        signIn: true,
        chat: 
        {
            "name": "",
            "user_name": ""
        },
        messages: messages,
        error: {
            "state": false,
            "error": 'Error por defecto' 
        }
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

    proofSession = async () =>
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

    componentDidMount()
    {
        this.proofSession();
        socket.on("chat message", data =>
        {
            this.receiveMsg(data);
        });
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
        if(!this.state.logged.session)
        {
            if (this.state.signIn)
            {
                return (
                    <div>
                        <header className="header-container">
                            <h1 className="title">PatsApp</h1>
                        </header>
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
            else
            {
                return (
                    <div>
                        <header className="header-container">
                            <h1 className="title">PatsApp</h1>
                        </header>
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
        else
        {
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
}

export default App;