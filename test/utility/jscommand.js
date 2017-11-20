
const getDropCommand = (name) => {
    var dropCommand = `var filepath = './test/test-data/${name}';
var files = [
    {
        size: 979,
        type: "",
        webkitRelativePath: "",
        path: filepath,
        name: "1mbword.docx"
    }
];
var items = [
    {
        "webkitGetAsEntry": () => {
            return {
                file: (cb) => {
                    cb({
                        fullPath: filepath,
                        isDirectory: false,
                        name: "1mbword.docx",
                        path: filepath
                    });
                },
                fullPath: filepath,
                isDirectory: false,
                isFile: true,
                name: "1mbword.docx"
            };
        }
    }
];

var evt = new Event("drop", { "bubbles": true, "cancelable": false }); evt.dataTransfer = { files: files, items: items }
document.querySelector(".uploadPlaceholder").dispatchEvent(evt);`;
    return dropCommand;
};
const minimizeCommand = "CommandOrControl+M";
const commands = {
    getDropCommand,
    minimizeCommand
};
module.exports = commands;
