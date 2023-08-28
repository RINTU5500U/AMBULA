const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const moment = require('moment')


module.exports = {
    createUser : async (req, res) => {
        try {
            let {phone, email} = req.body
            let uniqueData = await userModel.find({$or: [{ phone: phone }, { email: email }] })
            let arr = []
            uniqueData.map((i) => { arr.push(i.phone, i.email) })

            if (arr.includes(phone)) {
                return res.status(409).send({ status: false, msg: "phone is already exsit" })
            }
            if (arr.includes(email)) {
                return res.status(409).send({ status: false, msg: "email is already exsit" })
            }
            let saveData = await userModel.create(req.body)
            return res.status(201).send({ status: true, msg: "Data created successfully", Data: saveData })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    login : async (req, res) => {
        try {
            let { email, password } = req.body
            let findUser = await userModel.findOne({ email: email, password: password });
            if (!findUser) {
                return res.status(404).send({ status: false, message: "emailId or password is incorrect" })
            }
            let token = jwt.sign({ userId: findUser._id }, "Secret-key")        
            res.setHeader("token", token)
            return res.status(200).send({ Message: "LoggedIn successfully", Token: token })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    updateUser : async (req, res) => {
        try {
            let userId = req.params.userId
            let data = req.body
            let {phone, email} = data
            if (Object.keys(data).length < 1) {
                return res.status(400).send({ status: false, message: "Please enter data whatever you want to update" })
            }
            let uniqueData = await userModel.find({$or: [{ phone: phone }, { email: email }] })
            let arr = []
            uniqueData.map((i) => { arr.push(i.phone, i.email) })
    
            if (arr.includes(phone)) {
                return res.status(409).send({ status: false, msg: "phone is already exsit" })
            }
            if (arr.includes(email)) {
                return res.status(409).send({ status: false, msg: "email is already exsit" })
            }
     
            data['updatedAt'] = moment().format("DD-MM-YYYY  h:mm:ss a")
            let updateData = await userModel.findByIdAndUpdate(userId,data,{new: true})
            if (!updateData) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            return res.status(200).send({ status: true, Data: updateData })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    getUser : async (req, res) => {
        try {
            let {userId} = req.decodedToken
            let number = req.params.number
            let pincode = await userModel.findById(userId).select({latitude: 1, longitude: 1})
            let nearestUser = await UserLocation.aggregate([
                // Match non-excluded users
                { $match: { excluded: false } },
                
                // Calculate distance using geoNear
                {
                  $geoNear: {
                    near: { type: 'Point', coordinates: [pincode.latitude, pincode.longitude] },
                    distanceField: 'distance',
                    spherical: true
                  }
                },
                // Limit to N users
                { $limit: number }
              ]);
              return res.status(200).send({ status: true, Data: nearestUser })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
}


