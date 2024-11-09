const fs = require('fs');
const util = require('util');
const mysql = require('mysql2/promise');
const path = require('path');

const MYSQL_HOST = "database-2.cn01kklpjfrd.ap-southeast-2.rds.amazonaws.com";
const MYSQL_USERNAME = "admin";
const MYSQL_PASSWORD = "tanya1940";
const MYSQL_PORT = "3306";

const pool = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  port: MYSQL_PORT || 3306,
  database: 'cmp175',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const databaseName = 'cmp175'; // Specify your database name here
const modelFolderPath = path.join(__dirname, '..', 'models');

// Function to check if a model file already exists
async function modelExists(tableName) {
  const filePath = `${modelFolderPath}/${tableName}.js`;
  try {
    await util.promisify(fs.access)(filePath);
    return true; // Model file exists
  } catch (error) {
    return false; // Model file does not exist
  }
}
async function generateModels() {
  try {
    console.log('Connecting to the database...');
    // Get all tables in the database
    console.log('Model folder path:', modelFolderPath);

    const [tables] = await pool.query('SHOW TABLES');
    console.log('Retrieved tables from the database:', tables);
    if (!tables || tables.length === 0) {
      console.log('No tables found in the database.');
      return;
    }
    for (const table of tables) {
      const tableName = table[`Tables_in_${databaseName}`];
      if (!tableName) {
        console.log('Invalid table name:', table);
        continue;
      }
      console.log(`Processing table '${tableName}'...`);
      if (!(await modelExists(tableName))) {
        console.log(`Model file for table '${tableName}' does not exist. Generating...`);
        const [columns] = await pool.query(`SHOW COLUMNS FROM ${tableName}`);
        console.log(`Retrieved columns for table '${tableName}':`, columns);
        
        // Construct model content based on columns
        let modelContent = `// Model for ${tableName}\n\n`;
        modelContent += `import mongoose, { model, Schema } from 'mongoose';\n\n`;
        modelContent += `const ${tableName}Schema = new Schema({\n`;
        for (const column of columns) {
          const fieldName = column.Field;
          const dataType = column.Type.toLowerCase(); // Convert data type to lowercase
          let jsDataType = '';
          if (dataType.includes('int')) {
            jsDataType = 'Number';
          } else if (dataType.includes('float') || dataType.includes('double') || dataType.includes('decimal')) {
            jsDataType = 'Number';
          } else {
            jsDataType = 'String';
          }
          modelContent += `  ${fieldName}: { type: ${jsDataType}`;
          if (column.Null === 'NO') {
            modelContent += ', required: true },\n';
          } else {
            modelContent += ' },\n';
          }
        }
        modelContent += `}, { timestamps: true });\n\n`;
        modelContent += `export const ${tableName} = model('${tableName}', ${tableName}Schema);\n\n`;
        
        // Write model file
        const filePath = `${modelFolderPath}/${tableName}.js`;
        console.log(`Writing model file for table '${tableName}' to: ${filePath}`);
        await util.promisify(fs.writeFile)(filePath, modelContent);
        console.log(`Model file for table '${tableName}' generated successfully.`);
      } else {
        console.log(`Model file for table '${tableName}' already exists.`);
      }
    }
    console.log('All model files generated or verified.');
  } catch (error) {
    console.error('Error generating or verifying model files:', error);
  }
}


// Call the function when this file is executed directly
generateModels();

module.exports = generateModels;
