const User = require('../models/User')

const bcrypt = require('bcrypt')


const createUserToken = require('../helpers/create-user-token')



module.exports = class UserController {

    static async register(req, res) {

        const { name, email, phone, password, confirmpassword } = req.body

        //  validações
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' })
            return
        }
        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatório' })
            return
        }
        if (!confirmpassword) {
            res.status(422).json({ message: 'A confimação de senha é  obrigatório' })
            return
        }

        if (password !== confirmpassword) {
            res.status(422).json({ message: 'A senha ea confirmação de senha precisam ser iguais!' })
            return
        }

        //  checando se o usuario existe
        const userExiste = await User.findOne({ email: email })

        if (userExiste) {
            res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
            return
        }


        // criando uma senha

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //  criando um  usuario

        const user = new User({
            name,
            email,
            phone,
            passaword: passwordHash
        })


        try {
            const newUser = await user.save()

            await createUserToken(newUser, req, res)

        } catch (error) {
            res.status(500).json({ message: error })
        }

    }

    static async login(req, res) {

        const { email, password } = req.body

        if (!email) {
            res.status(422).json({ message: 'O Email é obrigatório' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'O senha é obrigatório' })
            return
        }
        const user = await User.findOne({ email: email })

        if (!user) {
            res.status(422).json({ message: 'Não há usuário cadastrado com este  e-mail!' })
            return
        }

        // checando se a senha combina com a senha do banco de dados

        const checkPassword = await bcrypt.compare(password, user.passaword)

        if (!checkPassword) {
            res.status(422).json({
                message: 'Senha inválida',
            })
            return
        }

        await createUserToken(user, req, res)
    }


    static async checkUser(req, res) {

        let currentUser

        console.log(req.headers.authorization)


        if (req.headers.authorization) {

        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)

    }

}