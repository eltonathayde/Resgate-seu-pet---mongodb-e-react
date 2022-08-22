const User = require('../models/User')



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


    }

}