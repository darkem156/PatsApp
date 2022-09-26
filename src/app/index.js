import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.jsx';
import Sign from './components/Sign.jsx';

let app = document.getElementById("app");
let sign = document.getElementById("sign");

if (app)
{
    const root = ReactDOM.createRoot(app);
    root.render(<App/>);
}
else if (sign)
{
    const root = ReactDOM.createRoot(sign);
    root.render(<Sign/>);
}

