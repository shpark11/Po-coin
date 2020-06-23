var express = require("express");  

const https = require("https");
const http = require("http");
const fs = require("fs");

const options = {
  key: fs.readFileSync( '../../../OpenSSL-Win64/bin/ca.key'),
  cert: fs.readFileSync( '../../../OpenSSL-Win64/bin/ca.crt')
};


// 패스워드 암호화 관련 부분
//var crypto = require('crypto');
//var salt = '';
//var pw = '';
//crypto.randomBytes(64, (err, buf) => {
//	if (err) throw err;
//	salt = buf.toString('hex');
//});
//crypto.pbkdf2('password', salt, 100000, 64, 'sha512', (err, derivedKey) => {
//	if (err) throw err;
//	pw = derivedKey.toString('hex');
//});

var mysql = require('mysql');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var crypto = require('crypto');
var dbConfig = require('./dbConfig');

var app = express(); //원래 있었던 부분

var dbOptions = {
	host: dbConfig.host,
	port: dbConfig.port,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database
};

var conn = mysql.createConnection(dbOptions);
conn.connect();

// var server = require("http").createServer(app);
//var bodyParser = require('body-parser');
var session = require('express-session');

app.engine(".html", require('ejs').renderFile);
app.set('views', __dirname + '/public/html');
app.set("view engine", 'html');


var server = https.createServer(options, app).listen(443);
// server.listen(3000, function(){
// 	console.log("Express server has started on port 3000.");
// });

app.use(express.static("public"));
var Web3 = require("web3");
web3 = new Web3(new Web3.providers.HttpProvider("http://141.223.85.142:8070"));

var tokenAbi = [
	{
		"constant": false,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transferPoInt",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_symbol",
				"type": "string"
			},
			{
				"name": "_totalPoCoins",
				"type": "uint256"
			},
			{
				"name": "_tokenAddress",
				"type": "address"
			}
		],
		"name": "poCoin",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "poInt",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "TransferPoInt",
		"type": "event"
	}
];

var poIntAbi = [
	{
		"constant": false,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "accumulate",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "spend",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_symbol",
				"type": "string"
			},
			{
				"name": "_totalPoInt",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	}
];

var tokenAddress = "0x1740343EEA053C740A7D73780eF1CB16eA839e26";
var tokenContract = web3.eth.contract(tokenAbi);
var tokenContractInstance  = tokenContract.at(tokenAddress);

var poIntAddress = "0x55Df1E0B6e169Addc17ffd6f0b87c1c6d31C6b8B";
var poIntContract = web3.eth.contract(poIntAbi);
var poIntContractInstance  = poIntContract.at(poIntAddress);

// 이 부분은 향후에 계정관리 기능 추가 필요


var userAddress = "0x1F3456D7a3FBeD4c781dfb9c3cce0eB795AEeb77"
var merchantAddress = "0x1a4c3F33275f7A444338AC282a343A8272a2E09E"
var obj = new Array();

function refresh(currentUserAddress){
	obj["sendingDone"] = false;
	obj["userAddress"] = userAddress;
	obj["userBalance"] = parseFloat(web3.fromWei(web3.eth.getBalance(obj["userAddress"]), 'ether'));;
	obj["userToken"] = parseFloat(tokenContractInstance.balanceOf.call(obj["userAddress"]));
	obj["userPoint"] = parseFloat(poIntContractInstance.balanceOf.call(obj["userAddress"]));
	obj["merchantAddress"] = merchantAddress;
	obj["merchantBalance"] = parseFloat(web3.fromWei(web3.eth.getBalance(obj["merchantAddress"]), 'ether'));
	obj["merchantToken"] = parseFloat(tokenContractInstance.balanceOf.call(obj["merchantAddress"]));
	obj["merchantPoint"] = parseFloat(poIntContractInstance.balanceOf.call(obj["merchantAddress"]));
}

function createNewAccount(password){
	var newAccount = web3.eth.personal.newAccount(password).then(console.log);
	return newAccount;
}

//라우팅 설정
app.get('/index', function(req, res){
	res.render(__dirname + "/public/html/index.html", obj);
})

app.get('/login', function(req, res) {
    var id = req.query.username;
    var pw = req.query.password;
    var sql = 'SELECT * FROM tb_user WHERE app_id=?';
    conn.query(sql, [id], function(err, results){
      if(err)
        console.log(err);
 
      if(!results[0])
        return res.send('please check your id.');
 
      var user = results[0];
      //crypto.pbkdf2(pw, user.salt, 100000, 64, 'sha512', function(err, derivedKey){
        if(err)
          console.log(err);
        //if(derivedKey.toString('hex') === user.app_pw){
        if(pw === user.app_pw){
        	refresh(user.bc_address);
        	console.log(obj);		
        	if("U"==user.user_dv){
				return res.render(__dirname + "/public/html/user.html", obj);
			}else if("M"==user.user_dv){
				return res.render(__dirname + "/public/html/merchant.html", obj);
			}else{
				return res.send('please check your user account.');
			}
        }else {
          return res.send('please check your password.');
        }
      //});//pbkdf2
    });//query
  }
);

app.get('/signup', function(req, res){
	res.render(__dirname + "/public/html/signup.html", obj);
})

app.get('/confirm', function(req, res){
	console.log(req.query);
	//블록체인 계좌생성 요청
	var user_dv = req.query.userType;
	var user_nm = req.query.userNm;
	var app_id = req.query.appId;
	var app_pw = req.query.appPw;
	var bc_address = "";
	//var bc_address = createNewAccount('class');
	var bank_code = req.query.bankCode;
	var bank_account_no = req.query.bankAccountNo;

	var sql = 'INSERT INTO tb_user (user_dv, user_nm, app_id, app_pw, bc_address, bank_code, bank_account_no) VALUES ?';
	var values =[[user_dv, user_nm, app_id, app_pw, bc_address, bank_code, bank_account_no]];
	conn.query(sql, [values], function(err, results){
    	if(err)
        	console.log(err);    	
        return res.send('successfully registered.');
        //return res.render(__dirname + "/public/html/index.html", obj);
    });//query

	
})

app.get('/user', function(req, res){
	refresh(userAddress);
	console.log(obj);
	res.render(__dirname + "/public/html/user.html", obj);
})

app.get("/send", function(req, res){
	refresh(userAddress);
	console.log("get!!-/Send");
	console.log(req.query);
	var fromAddress = obj["userAddress"];
	var toAddress = req.query.toAddress;
 	var sendAmount = parseFloat(req.query.sendAmount);
 	var sendUnit = req.query.sendUnit;
 	console.log(fromAddress);
 	console.log(toAddress);
 	console.log(sendAmount);

	web3.personal.unlockAccount(fromAddress, "class");
	if(sendUnit == 'PO'){
		tokenContractInstance.transfer(fromAddress, toAddress, sendAmount, {from: fromAddress, gas:200000});
	}else if(sendUnit == 'PT'){
		tokenContractInstance.transferPoInt(fromAddress, toAddress, sendAmount, {from: fromAddress, gas:200000});
	}
	//console.log(txResult);
	obj["sendingDone"] = true;
	res.render(__dirname + "/public/html/user.html", obj);
})

app.get('/merchant', function(req, res){
	refresh(merchantAddress);
	console.log(obj);
	res.render(__dirname + "/public/html/merchant.html", obj);
})



