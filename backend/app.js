var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
const axios = require('axios');
require('dotenv').config()

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const UserInfoSchema = new mongoose.Schema({
    clientId: String,
    secretKey: String,
    accessKey: String
});
const UserInfo = mongoose.model('userinfo', UserInfoSchema);

app.post("/api/connect", async (req, res) => {
    await mongoose.connect(process.env.MONGODB_KEY, {
        dbName: "BankHubTest"
    });

    const redirectUri = req.body.redirectUri;
    const userId = req.body.userId;
    
    const userInfo = await UserInfo.findById(userId).exec();
    let data = JSON.stringify({
        "scopes": "transaction",
        "redirectUri": redirectUri,
        "language": "vi"
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://sandbox.bankhub.dev/grant/token',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-client-id': userInfo.clientId,
            'x-secret-key': userInfo.secretKey
        },
        data: data
    };
    axios(config)
        .then((response) => {
            const urlBankHub = `https://dev.link.bankhub.dev?grantToken=${response.data.grantToken}&redirectUri=${redirectUri}&iframe=false`
            res.status(200).json({ urlBankHub })
        })
        .catch((error) => {
            res.status(500).json(error)
        })
})

app.post("/api/exchange", async (req, res) => {
    await mongoose.connect(process.env.MONGODB_KEY, {
        dbName: "BankHubTest"
    });
    const userId = req.body.userId;
    const userInfo = await UserInfo.findById(userId).exec();
    let data = JSON.stringify({
        "publicToken": req.body.publicToken
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://sandbox.bankhub.dev/grant/exchange',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-client-id': userInfo.clientId,
            'x-secret-key': userInfo.secretKey
        },
        data: data
    };

    axios(config)
        .then(async (response) => {
            try {
                await UserInfo.updateOne({ _id: userId }, { accessKey: response.data.accessToken }).exec();
                res.status(200).json({ message: "Thành công!" })
            }
            catch {
                res.status(500).json({})
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json(error.response)
        })
})

app.get("/api/transactions", async (req, res) => {
    await mongoose.connect(process.env.MONGODB_KEY, {
        dbName: "BankHubTest"
    });
    const userId = req.query.userId;
    const userInfo = await UserInfo.findById(userId).exec();
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://sandbox.bankhub.dev/transactions',
        headers: {
            'Accept': 'application/json',
            'x-client-id': userInfo.clientId,
            'x-secret-key': userInfo.secretKey,
            'Authorization': userInfo.accessKey
        }
    };

    axios(config)
        .then((response) => {
            res.status(200).json(response.data)
        })
        .catch((error) => {
            res.status(500).json(error)
        });
})

app.listen(8080);