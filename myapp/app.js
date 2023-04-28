const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

const users = [];

// 配置cors中间件
app.use(cors());
// 解析body
app.use(bodyParser.json());

// 验证用户名和密码是否正确
// 如果正确，返回该用户对象，否则返回null
function authenticateUser(username, password) {
    const user = users.find((u) => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
        return user;
    }
    return null;
}

// 生成jwt token
function generateToken(user) {
    const secretKey = "randomSecretKey";
    return jwt.sign({ user }, secretKey);
}

// POST /login 登录
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = authenticateUser(username, password);
    if (user) {
        const token = generateToken({ id: user.id, username: user.username });
        res.json({ success: true, token });
    } else {
        res.json({ success: false, message: '用户名或密码错误' });
    }
});

//POST /register 注册
app.post('/api/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;
    const existingUser = users.find((u) => u.username === username);

    if (existingUser) {
        res.json({ success: false, message: '用户名已存在' });
        return;
    }

    if (password !== confirmPassword) {
        res.json({ success: false, message: '两次输入的密码不一致' });
        return;
    }

    // 创建一个新用户
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = { id: users.length + 1, username, password: hashedPassword };
    users.push(user);

    // 生成jwt token并返回
    const token = generateToken({ id: user.id, username: user.username });
    res.json({ success: true, token });
});

app.listen(8080, () => {
    console.log('Server running on port 8080');
});