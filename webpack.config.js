module.exports = 
{
    entry: './src/app/index.js',
    output: 
    {
        path: __dirname + '/src/public/js',
        filename: 'index.js'
    },
    module:
    {
        rules:
        [
            {
                use: "babel-loader",
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    }
}