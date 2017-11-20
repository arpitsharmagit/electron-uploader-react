
const path = require("path");
const fs = require("fs");
const glob = require("glob");

const getDirectories = (src, callback) => {
    glob(src + '/**/*', callback);
};

const DropCommand = (contentPath, targetSelector) => {
    const isDirectory = fs.lstatSync(contentPath).isDirectory();
    return new Promise((resolve, reject) => {
        let jsStr = "";
        if (!isDirectory) {
            const filename = path.basename(contentPath);
            jsStr = `var files = [{
                size: 0,
                type: "",
                webkitRelativePath: "",
                path: "${contentPath}",
                name: "${filename}"
            }];
            var items = [{
                "webkitGetAsEntry": () => {
                    return {
                        file: (cb) => {
                            setTimeout(function(){cb({
                                type: "",
                                fullPath: "${contentPath}",
                                isDirectory: ${isDirectory},
                                name: "${filename}",
                                path: "${contentPath}"
                            })},1000);
                        },
                        fullPath: "${contentPath}",
                        isDirectory: ${isDirectory},
                        isFile: ${!isDirectory},
                        name: "${filename}"
                    };
                }
            }];`;
            jsStr += `var evt = new Event("drop", { "bubbles": true, "cancelable": false });
            evt.dataTransfer = { files: files, items: items };
            document.querySelector("${targetSelector}").dispatchEvent(evt); `;
            resolve(jsStr);
        } else {
            getDirectories(contentPath, function (err, data) {
                if (err) {
                    jsStr = `var files = []; var items = [];`;
                } else {
                    let files = "", items = "";
                    data.forEach((content) => {
                        const contentname = path.basename(content);
                        const isContentDirectory = fs.lstatSync(content).isDirectory();
                        console.log(`${content} ${isContentDirectory}`);
                        files += `{
                            size: 0,
                            type: "",
                            path: "${content}",
                            name: "${contentname}"
                        },`;
                        items += `{
                            "webkitGetAsEntry": () => {
                                return {
                                    file: (cb) => {                                        
                                        setTimeout(function(){cb({
                                            type: "",
                                            fullPath: "${content}",
                                            isDirectory: ${isContentDirectory},
                                            name: "${contentname}",
                                            path: "${content}"
                                        })},1000);
                                    },
                                    createReader:()=>{
                                        return {
                                            readEntries:(cb)=>{ return []; }
                                        }
                                    }
                                    },
                                    fullPath: "${content}",
                                    isDirectory: ${isContentDirectory},
                                    isFile: ${!isContentDirectory},
                                    name: "${contentname}"
                                };
                            }
                        },`;
                    });
                    jsStr = `var levelOne = false;
                    var leveleTwo = false;
                    var items = [
                        {
                            webkitGetAsEntry: () => {
                                return {
                                    isDirectory: true,
                                    fullPath: './test/test-data/one',
                                    name: "one",
                                    path: './test/test-data/one',
                                    createReader: () => {
                                        return {
                                            readEntries: (cb) => {
                                                setTimeout(function () {
                                                    if (!levelOne) {
                                                        levelOne = true;
                                                        cb([{
                                                            isDirectory: true,
                                                            fullPath: './test/test-data/one/two',
                                                            name: "two",
                                                            path: './test/test-data/one/two',
                                                            createReader: () => {
                                                                return {
                                                                    readEntries: (_cb) => {
                                                                        setTimeout(function () {
                                                                            console.log(leveleTwo);
                                                                            if (!leveleTwo) {
                                                                                leveleTwo = true;
                                                                                _cb([{
                                                                                    fullPath: './test/test-data/one/two/three.txt',
                                                                                    isDirectory: false,
                                                                                    isFile: true,
                                                                                    name: "three.txt",
                                                                                    
                                                                                            file: (_cb2) => {
                                                                                                setTimeout(function () {
                                                                                                _cb2({
                                                                                                    fullPath: './test/test-data/one/two/three.txt',
                                                                                                    isDirectory: false,
                                                                                                    name: "three.txt",
                                                                                                    path: './test/test-data/one/two/three.txt'
                                                                                                });
                                                                                            }, 100);
                                                                                            }
                                                                                }]);
                                                                            } else {
                                                                                _cb([]);
                                                                            }
                                                                            //
                                                                        }, 100);
                                                                    }
                                                                };
                                                            } // end
                                                        }]);
                                                    } else {
                                                        cb([]);
                                                    }
                                                });
                                            }
                                        };
                                    }
                                };
                            }
                        }
                    ];`;
                }
                jsStr += `var evt = new Event("drop", { "bubbles": true, "cancelable": false });
                evt.dataTransfer = { files: items, items: items };
                document.querySelector("${targetSelector}").dispatchEvent(evt); `;
                resolve(jsStr);
            });
        }
    });
};
module.exports = {
    DropCommand
};
