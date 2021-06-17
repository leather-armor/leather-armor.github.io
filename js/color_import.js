import { Toast } from './toast.js';
import { showHideMenu, colorPicker } from './index.js';

export function loadColorFromModel() {
    let input = $('#color-import');
    let isRGB = $('.color-model #option1').is(':checked');
    if (isRGB) {
        let rgbRegex = /([0-2]\d{0,2}),\s*([0-2]\d{0,2}),\s*([0-2]\d{0,2})/
        if (input.val().match(rgbRegex)) {
            let [,r,g,b] = input.val().match(rgbRegex);
            $('#color').val(RgbToHex(r,g,b));
            showHideMenu($('.imports-list'));
            colorPicker.color.hexString = RgbToHex(r,g,b);
            input.val('');
            console.log(colorPicker.color.hexString);
        }
        else {
            new Toast({
                message: 'Invalid RGB color format.',
                type: 'error',
            }).show(4000);
        }
    }
    else {
        if (!isNaN(Number(input.val())) && Number(input.val()) <= 16777215 && Number(input.val()) >= 0) {
            $('#color').val(IntToHex(input.val()));
            showHideMenu($('.imports-list'));
            colorPicker.color.hexString = IntToHex(input.val());
            input.val('');
            console.log(colorPicker.color.hexString);
        }
        else {
            new Toast({
                message: 'Invalid color integer value.',
                type: 'error',
            }).show(4000);
        }
    }
}
function RgbToHex(r,g,b) {
    r = Number(r).toString(16);
    g = Number(g).toString(16);
    b = Number(b).toString(16);
    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;
    return `#${r}${g}${b}`.toUpperCase();
}
function IntToHex(int) {
    let ret = Number(int).toString(16);
    while (ret.length < 6) ret = '0' + ret;
    ret = '#' + ret.toUpperCase();
    console.log(ret);
    return ret;
}