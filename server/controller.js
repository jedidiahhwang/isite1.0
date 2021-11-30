// require("dotenv").config()
// const {CONNECTION_STRING} = process.env;
const db = process.env.DATABASE_URL 
const Sequelize = require("sequelize")
const bcrypt = require('bcrypt')

const sequelize = new Sequelize(db, {
	dialect:"postgres",
	dialectOptions: {
		ssl: {
			rejectUnauthorized: false
		}
	}
});

module.exports = {
	
	createTables: (req,res) => {
    	sequelize.query(` 
		DROP TABLE IF EXISTS users;
		CREATE TABLE users (
			user_id SERIAL PRIMARY KEY,
			fname VARCHAR(100),
			username VARCHAR(20) UNIQUE,
			regEmail VARCHAR(100),
			regPswd VARCHAR(100)
		);`).then(()=> {
			console.log("tables created")
			res.sendStatus(200)
		}).catch(err => console.log('error creating DB', err))
    },
	getAllUsers: (req,res) => {
		sequelize.query(`SELECT * FROM users AS u;`)
		.then((dbResult) => {
			res.status(200).send(dbResult[0])
		})
		.catch((err)=> console.log(err))
	},
	deleteUser: (req,res) => {
		let index = req.params.user_id
			sequelize.query(`
			DELETE FROM users
			WHERE user_id = ${index}
			`)
			.then((dbResult) => {
				res.status(200).send(dbResult[0])
			}).catch(err => console.log('error deleting user',err))
		},
	registerUser: async (req,res) => {
		console.log("reg user hit")
		try {
			const hashedPassword = await bcrypt.hash(req.body.regPswd, 10)
			let {fname,username, regEmail} = req.body

		sequelize.query(`
		INSERT INTO users(fname,username,regEmail,regPswd)
		VALUES ('${fname}','${username}','${regEmail}','${hashedPassword}')`)
		.then((dbResult) => {
			console.log('user added')
			res.status(200).send(dbResult)
		})		
		.catch(err => {if (err){
			res.status(200).send(false)
		}}).catch(err=> console.log(err))
		}
		catch {
			res.status(500).send()
		}
	},
	loginUser: (req,res) => {
		console.log("hit login user")
		let {uname,upsw} = req.body;
			if(uname === ''){
				return res.send(false)
			}
		sequelize.query(`SELECT username,regPswd FROM users
		WHERE username = '${uname}'`).then(async(dbResult) => {
			let [{regpswd}] = dbResult[0]
			try {
                if (dbResult[1].rowCount === 0){
                    res.send(false)
                } else if (await bcrypt.compare(upsw, regpswd)){
					res.send(dbResult)
				} else {
					res.send(false)
				}
			}
			catch {
				res.status(500).send()
			}
		}).catch(err => {if (err){
			res.status(200).send(false)
		}}).catch(err=> console.log(err))
	},
    getUser:(req,res)=> {
        sequelize.query(`SELECT fname,username,regemail FROM users
		`).then((dbResult) => {
            res.send(dbResult)
        }).catch(err =>console.log(err))
    }
}