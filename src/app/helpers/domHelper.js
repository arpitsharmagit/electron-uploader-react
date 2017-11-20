const preventDragDrop = () => {
    // prevent default behavior of app on drag drop
    document.addEventListener('dragover', function (event) {
        event.preventDefault();
        return false;
    }, false);

    document.addEventListener('drop', function (event) {
        event.preventDefault();
        return false;
    }, false);
};

module.exports = { preventDragDrop };
