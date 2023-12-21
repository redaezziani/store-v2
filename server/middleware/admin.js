import jwt from 'jsonwebtoken';
export const onlyAdmin = (req, res, next) => {
    console.log('this is only admin ');
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
      const payload = jwt.verify(token, 'reda');
       if (payload.role === 'admin') {
        next();
       } else {
        res.status(403).json({ error: 'you are not admin' });
       }

    }
     catch (error) {
      console.error('Error decoding token:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}




