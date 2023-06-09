// dependencies
const fs = require('fs');
const path = require('path');

// module scaffolding
const crud = {};

// base directory of the data folder
crud.basedir = path.join(__dirname, '/../.file/');

// write data to file
crud.create = (dir, file, data, callback) => {
    // open file for writing
    fs.open(`${crud.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to stirng
            const stringData = JSON.stringify(data);

            // write data to file and then close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback('Error closing the new file!');
                        }
                    });
                } else {
                    callback('Error writing to new file!');
                }
            });
        } else {
            callback('There was an error, file may already exists!');
        }
    });
};


// read data from file
crud.read = (dir, file, callback) => {
    fs.readFile(`${crud.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    });
};

// update existing file
crud.update = (dir, file, data, callback) => {
    // file open for writing
    fs.open(`${crud.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert the data to string
            const stringData = JSON.stringify(data);

            // truncate the file
            fs.ftruncate(fileDescriptor, (err1) => {
                if (!err1) {
                    // write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err2) => {
                        if (!err2) {
                            // close the file
                            fs.close(fileDescriptor, (err3) => {
                                if (!err3) {
                                    callback(false);
                                } else {
                                    callback('Error closing file!');
                                }
                            });
                        } else {
                            callback('Error writing to file!');
                        }
                    });
                } else {
                    callback('Error truncating file!');
                }
            });
        } else {
            console.log(`Error updating. File may not exist`);
        }
    });
};

// delete existing file
crud.delete = (dir, file, callback) => {
    // unlink file
    fs.unlink(`${crud.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback(`Error deleting file`);
        }
    });
};

// list all the items in a directory
crud.list = (dir, callback) => {
    fs.readdir(`${crud.basedir + dir}/`, (err, fileNames) => {
        if (!err && fileNames && fileNames.length > 0) {
            const trimmedFileNames = [];
            fileNames.forEach((fileName) => {
                trimmedFileNames.push(fileName.replace('.json', ''));
            });
            callback(false, trimmedFileNames);
        } else {
            callback('Error reading directory!');
        }
    });
};


module.exports = crud;