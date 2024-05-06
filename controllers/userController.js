const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      res.render("register", {
        message: "Usuário já existe",
        csrfToken: req.csrfToken(),
      });
      return;
    }

    //const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, username, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res.redirect("login");
  } catch (err) {
    res.status(500).render("register", {
      message: "Erro ao registrar usuário",
      csrfToken: req.csrfToken(),
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.render("/users/login"),
        {
          message: "Usuário não encontrado",
          csrfToken: req.csrfToken(),
        };
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      //TODO: criar uma pagina de erro descente.
      res.render("/users/fail", {
        message: "Credenciais inválidas",
        csrfToken: req.csrfToken(),
      });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res.redirect("/users/dashboard");
  } catch (err) {
    res.status(500).render("login", {
      message: "Erro interno do servidor",
      csrfToken: req.csrfToken(),
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email obrigatorio" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Nao existe conta com esse email" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hr

    await user.save();

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "60d586856858bd",
        pass: "6fec4d59ed65ea",
      },
    });

    const mailOptions = {
      from: '"Support Team" <support@example.com>',
      to: user.email,
      subject: "Redefinição de Senha",
      text: `Você está recebendo este e-mail porque você (ou alguém) solicitou a redefinição da senha da sua conta.\n\n
        Por favor, clique no link a seguir ou cole-o no seu navegador para completar o processo dentro de uma hora de recebimento:\n\n
        http://${req.headers.host}/users/reset/${token}\n\n
        Se você não solicitou isso, por favor ignore este e-mail e sua senha permanecerá inalterada.\n`,
      html: `<p>Você está recebendo este e-mail porque você (ou alguém) solicitou a redefinição da senha da sua conta.</p>
        <p>Por favor, clique no link a seguir ou cole-o no seu navegador para completar o processo dentro de uma hora de recebimento:</p>
        <a href="http://${req.headers.host}/users/reset/${token}">Redefinir Senha</a>
        <p>Se você não solicitou isso, por favor ignore este e-mail e sua senha permanecerá inalterada.</p>`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Não foi possível enviar o e-mail.", error: err });
      }
      res.status(200).json({
        //TODO: criar uma pagina de sucesso descente
        message:
          "Um e-mail foi enviado para " + user.email + " com mais instruções.",
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao redefinir a senha.", error: err });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res
      .status(400)
      .json({ message: "Token e uma nova senha e necessário" });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "O token de redefinição de senha é inválido ou expirou.",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Sua senha foi alterada com sucesso." });
  } catch (err) {
    res.status(500).json({ message: "Erro ao redefinir a senha.", error: err });
  }
};

exports.displayResetPasswordForm = async (req, res) => {
  let { token } = req.params;

  try {
    let user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Token inválido ou expirado");
    }

    res.render("resetPasswordForm", {
      token: token,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    res
      .status(500)
      .send("Erro ao exibir o formulário de redefinição de senha.");
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.redirect("/users/login");
};
