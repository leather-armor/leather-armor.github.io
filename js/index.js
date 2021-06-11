import { updateColorsList } from './color_models.js';

let canvasH = document.querySelector("#helmet");
let ctxH = canvasH.getContext("2d");

let canvasC = document.querySelector("#chestplate");
let ctxC = canvasC.getContext("2d");

let canvasL = document.querySelector("#leggings");
let ctxL = canvasL.getContext("2d");

let canvasB = document.querySelector("#boots");
let ctxB = canvasB.getContext("2d");

var colorPicker, colorElem, colorDigit, colorHash, assets, state;

function updateColor(c, mode = "") {
    c = c.toUpperCase().replace("#", "");
    colorHash = "#" + c;
    if (mode !== "p") colorElem.value = colorHash;
    if (mode !== "e") colorPicker.color.hexString = colorHash;
}

$('#color').on('input', e => {
    let caretPosition = e.target.selectionStart;
    let el = $('#color');
    if (!el.val().match(/#/)) {
        el.val(el.val().replace(/(.*)/, '#$1'));
        caretPosition++;
    }
    if (el.val().match(/#.*#/)) {
        el.val(el.val().replace(/(#.*)#/, '$1'));
        caretPosition--;
    }
    let disallowedCharacters = /[^0-9#a-fA-F]/;
    if (el.val().match(disallowedCharacters)) {
        el.val((el.val().replace(disallowedCharacters, '')));
        caretPosition--;
    }
    el.val((el.val().toUpperCase()));
    el[0].setSelectionRange(caretPosition, caretPosition);
});

const ITEM_SCALE = 10;
const IMAGE = {
    helmet: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAT0lEQVQ4jWNgGJ4gODj4f3Bw8H9cfIKa3759i6F427Zt/01NTfEbAtOMywCChlDVAGQ/m5qa/ifJAGwBBjOEPgZgU0SUATBDcBlAUPMIBQCmcXrRa5Y27gAAAABJRU5ErkJggg==",
    chestplate: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAfUlEQVQ4jc2QwRHAIAgEaYpKrkKbuK6ogbx0iIrR5BNm/MDewijyuwLgAHy3PwBm5iRvcO2bmQNwVfUhTLJBJG9QFMzmAxC3zWZTQbwggrPeIMiu6AVpOJOUUprkMZx91vZ2ERFV/XZBL+jD24IK1wuOBBE+FlTJ6i3Db+oCbcOJaq/MgTUAAAAASUVORK5CYII=",
    leggings: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXElEQVQ4jc2R0QkAIQxDXSqTdNds1RnqV6EnVqnnh4FACe0DTWvPSURs5e2xqqYmaQByyFUAyY9LAD8CYABqAJ/jYpY/qN9PiJ84AsotHANihbt8CvDuR8Asv6IOLXjlEnbx8xQAAAAASUVORK5CYII=",
    boots: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOUlEQVQ4jWNgGH4gODj4PwzjE8Op+e3bt/+3bdv239TU9D8h8VEDsIC3b9/+f/v2LU4FhORHwUABAHqxg8s2FvqIAAAAAElFTkSuQmCC",

    // Overlays
    helmet_overlay: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANElEQVQ4jWNgGN7ARFH0v4mi6H+yNRd56P0v8tAjz5CBNwBmCNma2VmY/yPjIWjAKCAeAAC9XiYhM+Id/gAAAABJRU5ErkJggg==",
    chestplate_overlay: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAEklEQVQ4jWNgGAWjYBSMAggAAAQQAAF/TXiOAAAAAElFTkSuQmCC",
    leggings_overlay: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOUlEQVQ4jWNgGAXDEZgoiv43URT9T6w4hqKpcdb/izz0/iuK8v4nJI7VgCIPPawGYBOnvhdGAXkAAA+nJbnHlRzjAAAAAElFTkSuQmCC",
    boots_overlay: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAASElEQVQ4jWNgGAWjgJrARFH0PzJbUZQXhY8uj6F5apz1f5jCIg89DAOKPPRwysMVwDCKJBQoivLiVgNzMgzj8iayGnzqhhgAAAgFNfwN37/qAAAAAElFTkSuQmCC",
};

function _allLoadingFinished() {
    state = "active";

    colorElem = document.querySelector("#color");
    draw();
    colorElem.onchange = function () {
        var tColor = this.value;
        tColor = tColor.toUpperCase();
        if (tColor.match(/[A-Fa-f0-9]{6}/g)) {
            this.value = tColor;
            updateColor(tColor, "p");
            updateColorsList();
            colorElem.classList.remove('invalid');
            draw();
        } else {
            colorElem.classList.add('invalid');
        }
    };
    colorElem.oninput = colorElem.onchange;

    colorPicker = new iro.ColorPicker('#picker', {
        width: 180,
    });
    colorPicker.on('color:change', function (color) {
        updateColor(color.hexString, "e");
        updateColorsList();
        draw();
        state = "timeout";
        setTimeout(function () {
            state = "active";
        }, 50);
    });
    colorPicker.on('input:end', function (color) {
        state = "active";
        draw();
    });
    updateColor("FF0000");
}

function draw() {
    if (state != "active") {
        return;
    }

    const color = colorHash;

    _drawPiece(canvasH, ctxH, "helmet", color);
    _drawPiece(canvasC, ctxC, "chestplate", color);
    _drawPiece(canvasL, ctxL, "leggings", color);
    _drawPiece(canvasB, ctxB, "boots", color);
}

function _drawPiece(canvas, ctx, name, color) {
    let {
        file,
        x,
        y,
        scale
    } = {
        x: 0,
        y: 0,
        scale: ITEM_SCALE,
        file: assets.files[name]
    };
    let {
        asset,
        width,
        height
    } = file;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Prevents blur
    ctx.imageSmoothingEnabled = false;

    // https://stackoverflow.com/a/45201094/1411473
    // step 1: draw in original image
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(asset, x, y, width * scale, height * scale);

    // step 2: multiply color
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width * scale, height * scale);

    // step 4: in our case, we need to clip as we filled the entire area
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(asset, x, y, width * scale, height * scale);

    // step 5: reset comp mode to default
    ctx.globalCompositeOperation = "source-over";

    let {
        file2,
        x2,
        y2,
        scale2
    } = {
        x2: 0,
        y2: 0,
        scale2: ITEM_SCALE,
        file2: assets.files[name + "_overlay"]
    };
    let {
        asset: asset2,
        width: width2,
        height: height2
    } = file2;
    ctx.drawImage(asset2, x2, y2, width2 * scale2, height2 * scale2);

    document.querySelector("#" + name + "_img").src = canvas.toDataURL("image/png");
    document.querySelector("#" + name + "_lnk").href = canvas.toDataURL("image/png");
    document.querySelector("#" + name + "_lnk").download = "Dyed " + name + " " + color + ".png";
}

window.onload = function () {
    assets = new AssetManager();

    state = "loading";

    assets.loadUris([
            ["helmet", IMAGE.helmet],
            ["chestplate", IMAGE.chestplate],
            ["leggings", IMAGE.leggings],
            ["boots", IMAGE.boots],

            ["helmet_overlay", IMAGE.helmet_overlay],
            ["chestplate_overlay", IMAGE.chestplate_overlay],
            ["leggings_overlay", IMAGE.leggings_overlay],
            ["boots_overlay", IMAGE.boots_overlay],
        ])
        .then(_allLoadingFinished);
}

var AssetManager = (function () {
    function AssetManager() {
        this.files = {};
    }
    AssetManager.prototype.load = function (pArray) {
        return Promise.all(pArray.map(([url]) => {
            let [, tName, tType] = /(?:\/+)(?!.*\/)(.*)\.(.*)/g.exec(url);
            return this._addFile(tName, url);
        }));
    };
    AssetManager.prototype.loadUris = function (pArray, pCallback) {
        return Promise.all(pArray.map(([name, uri]) => this._addFile(name, uri)));
    };
    AssetManager.prototype._addFile = function (name, src) {
        return new Promise((resolve, reject) => {
            let tImg = new Image();
            tImg.onload = (e) => {
                this.files[name] = {
                    name,
                    asset: tImg,
                    width: tImg.width,
                    height: tImg.height
                };
                tImg = null;
                resolve(this.files[name]);
            };
            tImg.src = src;
        });
    }
    return AssetManager;
})();