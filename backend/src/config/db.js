const env = require("./env");
const { mysqlPool } = require("./db.mysql");

const usePostgres = Boolean(env.DATABASE_URL);
const pgPool = usePostgres ? require("./db.pg").pgPool : null;

function normalizeSql(sql) {
  let text = String(sql || "");
  text = text.replace(/`([^`]+)`/g, '"$1"');
  text = text.replace(/\bCURDATE\(\)/gi, "CURRENT_DATE");
  text = text.replace(/\bNOW\(\)/gi, "CURRENT_TIMESTAMP");

  const startsWithInsertIgnore = /^\s*INSERT\s+IGNORE\s+INTO\s+/i.test(text);
  if (startsWithInsertIgnore) {
    text = text.replace(/^\s*INSERT\s+IGNORE\s+INTO\s+/i, "INSERT INTO ");
    if (!/\bON\s+CONFLICT\b/i.test(text)) {
      text = text.trim().replace(/;$/, "");
      text += " ON CONFLICT DO NOTHING";
    }
  }

  return text;
}

function buildPgQuery(sql, params) {
  let text = normalizeSql(sql);
  const values = [];

  if (Array.isArray(params)) {
    let i = 0;
    text = text.replace(/\?/g, () => {
      i += 1;
      return `$${i}`;
    });
    values.push(...params);
  } else if (params && typeof params === "object") {
    const nameToIndex = new Map();
    text = text.replace(/(^|[^:]):([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, prefix, name) => {
      if (!Object.prototype.hasOwnProperty.call(params, name)) {
        throw new Error(`Missing SQL parameter :${name}`);
      }
      if (!nameToIndex.has(name)) {
        values.push(params[name]);
        nameToIndex.set(name, values.length);
      }
      return `${prefix}$${nameToIndex.get(name)}`;
    });
  }

  if (
    /^\s*INSERT\s+INTO\s+/i.test(text) &&
    /\bVALUES\s*\(/i.test(text) &&
    !/\bRETURNING\b/i.test(text)
  ) {
    text = `${text.trim().replace(/;$/, "")} RETURNING id`;
  }

  return { text, values };
}

async function queryWithPostgres(sql, params) {
  const { text, values } = buildPgQuery(sql, params);
  const result = await pgPool.query(text, values);
  const rows = Array.isArray(result.rows) ? result.rows : [];
  const insertId = rows[0] && Object.prototype.hasOwnProperty.call(rows[0], "id") ? rows[0].id : null;

  return {
    rows,
    rowCount: result.rowCount || 0,
    command: result.command,
    insertId,
  };
}

const db = {
  async query(sql, params) {
    if (usePostgres) {
      const result = await queryWithPostgres(sql, params);
      return { rows: result.rows, rowCount: result.rowCount, insertId: result.insertId };
    }
    const [rows, fields] = await mysqlPool.query(sql, params);
    return {
      rows: Array.isArray(rows) ? rows : [],
      rowCount: typeof rows?.affectedRows === "number" ? rows.affectedRows : Array.isArray(rows) ? rows.length : 0,
      insertId: rows?.insertId ?? null,
      fields,
      raw: rows,
    };
  },

  async end() {
    if (usePostgres) return pgPool.end();
    return mysqlPool.end();
  },
};

const pool = {
  async query(sql, params) {
    if (usePostgres) {
      const result = await queryWithPostgres(sql, params);
      if (/^\s*(SELECT|WITH)\b/i.test(String(sql || ""))) {
        return [result.rows, []];
      }
      return [{
        affectedRows: result.rowCount,
        changedRows: result.rowCount,
        insertId: result.insertId,
      }, []];
    }
    return mysqlPool.query(sql, params);
  },

  async end() {
    if (usePostgres) return pgPool.end();
    return mysqlPool.end();
  },
};

module.exports = { db, pool, usePostgres };
