import bcryptjs from "bcryptjs";
import { generateJWT } from "../helpers/generate-JWT.js";
import User from "../modules/user/user.model.js";


/**************  Login *****************/
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
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          img: user.img,
          role: user.role,
          accounts: user.accounts,
          status: user.status,
          token: token,
        },
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send( "Please contact the administrator/support.");
  }
};



/**************  Register *****************/
export const register = async (req, res) => {
  const { DPI, name, lastName, userName, email, pass, phone, address, jobName, role } = req.body;

  try {
    const hashedPass = bcryptjs.hashSync(pass, 10);

    //The line under verify if there is a word admin then of the arroba
    //if there is, the rol will be ADMIN else will be CLIENT
    if (email.includes("@") && email.split("@")[1].toLowerCase().includes("admin")) {
      role = "ADMIN";
    }

    const newUser = new User({
      DPI,
      name,
      lastName,
      userName,
      email,
      pass: hashedPass,
      phone,
      address,
      jobName,
      role, 
      accounts: [] 
    });
  
    await newUser.save();

    res.status(201).json({
      msg: "User registered successfully",
      userDetails: {
        id: newUser._id,
        DPI: newUser.DPI,
        name: newUser.name,
        email: newUser.email,
        userName: newUser.userName,
        phone: newUser.phone,
        address: newUser.address,
        jobName: newUser.jobName,
        role: newUser.role,
        status: newUser.status,
        accounts: newUser.accounts, 
            },
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Please contact the administrator/support.",);
  }
};


