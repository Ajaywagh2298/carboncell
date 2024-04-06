const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { Web3 } = require('web3');

const { generateToken, authenticateToken , clearToken} = require('./auth');
const web3 = new Web3('https://mainnet.infura.io/v3/e6343b5cf4604223beeb8481b01e361e');

const users = [];

module.exports = {
    register: async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = { id: users.length + 1, username: req.body.username, password: hashedPassword };
            users.push(user);
            console.log(user);
            res.status(201).send('User registered successfully');
        } catch {
            res.status(500).send();
        }
    },
    login: async (req, res) => {
        const user = users.find(user => user.username === req.body.username);
        if (user == null) return res.status(400).send('User not found');
        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                const token = generateToken(user);
                res.json({ token });
            } else {
                res.status(401).send('Incorrect password');
            }
        } catch {
            res.status(500).send();
        }
    },
    logOut: (req, res) => {
        clearToken(res);
        res.status(200).send('User logged out successfully');
    },
    securityCode: (req, res) => {
        res.status(200).send('Protected route accessed successfully');
    },
    dataSync: async (req, res) => {
        try {
            const { data } = await axios.get('https://api.publicapis.org/entries');
            res.json(data);
        } catch (error) {
            res.status(500).send('Error fetching data from the API');
        }
    },
    getBalances : async ( req, res ) => {
        try {
            const balance = await web3.eth.getBalance(req.params.address);
            res.json({ balance: web3.utils.fromWei(balance, 'ether') });
        } catch (error) {
            res.status(500).send('Error fetching balance');
        }
    }
};
