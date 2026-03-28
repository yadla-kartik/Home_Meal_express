const chefAuth = require('../models/chefAuth')
const { generateToken } = require('../utils/jwtAuth')

const signIn = async (req, res) => {
  try {
        const { email, password } = req.body

        let findChef = await chefAuth.findOne({ email })

        if(!findChef){
            return res.status(404).json({message: 'Chef not found'})
        }

        const isMatch = await findChef.comparePassword(password);

        if(!isMatch){
            return res.status(401).json({message: 'Invalid credentials'})
        }

        const token = generateToken({
            id: findChef._id,
            name: findChef.name,
            email: findChef.email,
            phone: findChef.phone,
            isRegistered: findChef.isRegistered,
        })

        res.cookie('chefToken', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            message: 'Login Successful',
            chefUser: findChef,
            token: token,
        })
    }
    catch (err) {
        console.error('Error occurred while signIn file name (chefAuth controller file):', err.message)
        return res.status(500).json({ message: 'Server error'})
    }
}


const signUp = async(req, res) => {
    try {
        const {name, email, phone, password} = req.body;

        const existingChef = await chefAuth.findOne({email})

        if(!existingChef){
            const createChef = await chefAuth.create({
            name,
            email,
            phone, 
            password,
        })

        const token = generateToken({
            id: createChef._id,
            name: createChef.name,
            email: createChef.email,
            phone: createChef.phone,
            isRegistered: createChef.isRegistered,
        })

        res.cookie('chefToken', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            message: 'SignUp Successful',
            chefUser: createChef,
            token: token,
        })}
        else{
            return res.status(409).json({
                message: 'Duplicate entity found',
            })
        }

    } catch (err) {
        console.error('Error occurred while signUp file name (chefAuth controller file):', err.message)
        return res.status(500).json({ message: 'Server error'})
    }
}

const updateProfile = async (req, res) => {
    try {
        const chefId = req.user?.id
        const { name, email, phone, isRegistered } = req.body

        if (!chefId) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const duplicateChef = await chefAuth.findOne({
            email,
            _id: { $ne: chefId },
        })

        if (duplicateChef) {
            return res.status(409).json({ message: 'Email already in use' })
        }

        const updatedChef = await chefAuth.findByIdAndUpdate(
            chefId,
            {
                name,
                email,
                phone,
                isRegistered: Boolean(isRegistered),
            },
            {
                new: true,
                runValidators: true,
            },
        )

        if (!updatedChef) {
            return res.status(404).json({ message: 'Chef not found' })
        }

        const token = generateToken({
            id: updatedChef._id,
            name: updatedChef.name,
            email: updatedChef.email,
            phone: updatedChef.phone,
            isRegistered: updatedChef.isRegistered,
        })

        res.cookie('chefToken', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            message: 'Profile Updated',
            chefUser: updatedChef,
            token,
        })
    } catch (err) {
        console.error('Error occurred while updateProfile in chefAuth controller file:', err.message)
        return res.status(500).json({ message: 'Server error' })
    }
}

module.exports = {signIn, signUp, updateProfile}
