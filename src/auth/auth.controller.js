import bcryptjs from "bcryptjs";
import { generateJWT } from "../helpers/generate-JWT.js";
import User from "../modules/user/user.model.js";

export const login = async (req, res) => {
  const { email, pass } = req.body;
  
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .send("Upss!, email or password are incorrect.");
    }

    if (!user.status) {
      return res.status(400).send("Upss!, user is not active. Contact the administrator.");
    }

    const validPassword = await bcryptjs.compareSync(pass, user.pass);

    if (!validPassword) {
      return res.status(400).send("Upss!, email or password are incorrect.");
    } else {
      const token = await generateJWT(user.id, user.email);

      res.status(200).json({
        msg: "Login ok",
        userDetails: {
          id: user._id,
          name: user.name,
          email: user.email,
          img: user.img,
          role: user.role,
          status: user.status,
          token: token,
        },
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Please contact the administrator/support.",
    });
  }
};

export const register = async (req, res) => {
  const { DPI, name, lastName, userName, email, pass, phone, address, jobName } = req.body;

  try {
    // Crear una nueva instancia de User
    const newUser = new User({
      DPI,
      name,
      lastName,
      userName,
      email,
      pass: bcryptjs.hashSync(pass, 10),  // Encriptar la contraseña
      phone,
      address,
      jobName,
      accounts: []  // Inicializar el campo accounts como un array vacío
    });

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();

    // Generar un token
    const token = await generateJWT(newUser.id, newUser.email);

    // Enviar la respuesta exitosa con los detalles del usuario
    res.status(201).json({
      msg: "User registered successfully",
      userDetails: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userName: newUser.userName,
        phone: newUser.phone,
        address: newUser.address,
        jobName: newUser.jobName,
        role: newUser.role,
        status: newUser.status,
        accounts: newUser.accounts,  // Incluir el campo accounts en la respuesta
        token: token,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Please contact the administrator/support.",
    });
  }
};


/*
export const register = async (req, res) => {
  const { DPI, name, lastName, userName, email, pass, phone, address, jobName }
}
*/
