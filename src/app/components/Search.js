import React, { Component } from 'react';

class Search extends Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            user: "",
            users: []
        }
    }

    handleChange = (event) =>
    {
        this.setState({user: event.target.value})
    }

    render()
    {
        return(
            <div>
                <form id="search">
                    <button type="submit" id="search-button" onClick={e => 
                    {
                        e.preventDefault();
                        let resultsContainer = document.getElementById('results-container');
                        resultsContainer.style.display = 'grid';
                        fetch(`/user/${this.state.user}`,
                        {
                            method: 'GET'
                        })
                        .then(res => res.json())
                        .then(data => 
                        {
                            if (!data[0])
                            {
                                this.setState({users: <div className='user-card'>
                                    <p className='user-card-name'>No hay resultados</p>
                                </div>})
                            }
                            else
                            {
                                let results = data.map(user =>
                                {
                                    return (
                                        <div className='user-card' key={user.user_name} onClick={() => 
                                        {
                                            this.props.selectUser(user.name, user.user_name);
                                            let resultsContainer = document.getElementById('results-container');
                                            resultsContainer.style.display = 'none';
                                            let button = document.getElementById('exit-button');
                                            button.style.display = 'none';
                                            button = document.getElementById('search-button');
                                            button.style.display = 'block';
                                        }}>
                                            <p className='user-card-name'>{user.name}</p>
                                            <p className='user-card-user'>{user.user_name}</p>
                                        </div>
                                    )
                                }
                                );
                                let button = document.getElementById('search-button');
                                button.style.display = 'none';
                                button = document.getElementById('exit-button');
                                button.style.display = 'block';
                                this.setState({users: results});
                            }
                        })
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </button>
                    <button type="button" id="exit-button" onClick={() =>
                        {
                            let resultsContainer = document.getElementById('results-container');
                            resultsContainer.style.display = 'none';
                            let button = document.getElementById('exit-button');
                            button.style.display = 'none';
                            button = document.getElementById('search-button');
                            button.style.display = 'block';
                        }
                    }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                        </svg>
                    </button>
                    <input id="search-input" type="search" placeholder='Buscar Usuario' value={this.state.user} onChange={this.handleChange}></input>
                </form>
                <div id="results-container">
                    <div id="results">
                        {this.state.users}
                    </div>
                </div>
            </div>
        );
    }
}

export default Search;