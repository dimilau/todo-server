import fs from 'fs';
import pkg from 'pg';
import yaml from 'js-yaml';
const { Pool } = pkg;

var getPool = () => {
  const config = yaml.load(fs.readFileSync('./postgresrc.yml', 'utf8'));
  return new Pool(config);
};

export default {
  query: async (text, values) => {
    const pool = getPool();
    const client = await pool.connect();
    const res = await client.query(text, values);
    client.release();
    return res;
  },
};
