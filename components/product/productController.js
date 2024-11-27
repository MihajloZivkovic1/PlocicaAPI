
const { Product } = require('../../models/index.js')
const error = require('../../middlewares/errorHandling/errorConstants');
const { Profile } = require('../../models')
const { User } = require('../../models')

exports.getAllProducts = async (req, res) => {
  const products = await Product.findAll()
  return res.json(products);
}

exports.getProductData = async (req, res) => {
  const { qrCode } = req.params;

  console.log(qrCode);
  const product = await Product.findOne({
    where: {
      qrCode: qrCode
    }
  })

  console.log(product);
  if (!product) {
    throw new Error(error.NOT_FOUND);
  }

  return res.send({
    message: "Returned prodcuct",
    product
  })
}

// exports.activateProduct = async (req, res) => {
//   try {

//     const { qrCode, activationCode, profileName, userId } = req.body

//     const validQrCode = await Product.findOne({ where: { qrCode: qrCode } });

//     const validActivationCode = await Product.findOne({ where: { activationCode: activationCode } });

//     if (!validQrCode || !validActivationCode) {
//       throw new Error(error.INVALID_VALUE);
//     }

//     const product = await Product.findOne({ where: { activationCode: activationCode } })

//     if (!product) {
//       throw new Error(error.NOT_FOUND);
//     }

//     if (product.status === "active") {
//       throw new Error(error.ALREADY_ACTIVATED_PROFILE);
//     }

//     product.status = "active"

//     const profile = await Profile.create({
//       profileName: profileName,
//       userId: userId
//     });

//     product.profileId = profile.id

//     await profile.save();
//     await product.save();

//     return res.json({ message: 'Profile activated and created.', profile });
//   } catch (error) {
//     console.error(error)
//   }
// }



//USER ID NE MOZE DA BUDE NULL ZBOG VEZE KOJU SAM NAPRAVIO TREBA TO PROMENITI
//PROMENITI MODEL TAKO DA PRIMA IME PROFILA POKOJNIKA

//treba da nadjem za taj qr kod koji je skreniran da li se poklapa sa qr kodom koji dobijam iz bodija, 
//takodje treba da poredim aktivacioni kod koji je korisnik uneo, i treba da upisem u tabelu ime pokojnika koji ce da bude kao alijas
//tek nakon kreiranja plocice treba ubaciti usera koji ga je kreirao ili uopste ne ubacivati id usera?????
//da li treba ostaviti idProfila nakon aktivacije plocice?
//nameOfProfile ne postiji u bazi to takodje promeniti
//kroz params dobiti usera?
//previse poziva ka bazi