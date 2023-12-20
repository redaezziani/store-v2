import mysql from 'mysql2/promise';

const createConnection = async () => {
  const connectionDetails = {
    host: 'localhost',
    user: 'klaus',
    password: 'redareda',
    database: 'store',
  };

  const connection = await mysql.createConnection(connectionDetails);
  await connection.query(`USE ${connectionDetails.database}`);
  return connection;
};

export default createConnection;


