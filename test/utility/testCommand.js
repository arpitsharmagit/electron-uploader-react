var levelOne = false;
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
                                                                name: "1mbword.docx",
                                                                
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
];

var evt = new Event("drop", { "bubbles": true, "cancelable": false });
evt.dataTransfer = { files: items, items: items };
document.querySelector("#main-tab-pane-1 div.node").dispatchEvent(evt);