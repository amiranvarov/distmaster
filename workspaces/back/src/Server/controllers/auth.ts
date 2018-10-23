const registeredUser = {
    login: 'admin',
    password: 'admin'
}

export const login = (req, res) => {
    const { login, password} = req.body;

    if (! (login == registeredUser.login && password == registeredUser.password)) {
        res.status(400).send({error: 'Неверный логин или пароль'});
    } else {
        res.sendStatus(200);
    }

}
