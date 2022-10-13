//<![CDATA[
//Function for print icon link
// JavaScript Document

function printable(b) {
    var top = '<html><head><!-- PageID 786 - published by RedDot 7.5 - 7.5.2.17 - 18957 --><!-- PageID 786 - published by RedDot 7.5 - 7.5.2.17 - 18956 --><title>Printer Version - Board of Governors of the Federal Reserve System</title><link rel="stylesheet" href="' + b + '" type="text/css"/><\/head><body leftmargin="10" topmargin="10" marginwidth="10" marginheight="10">';
    var bottom = '</body></html>';
    getthis = document.all ? document.all['printThis'] : document.getElementById('printThis');
    var popurl = "/printable.htm";
    winpops = window.open(popurl, "", "width=625,height=480,status,scrollbars,menubar,resizable,");
    //original code
    //winpops.document.write(top + getthis.innerHTML + bottom);
    //code to strip out second year select and disable button
    //alternative to button -- var temp = getthis.replace(/<input[^>]*>/gi, "Change Year");
    getthis = getthis.innerHTML.replace(/<\/?SCRIPT[^>]*>/gi, "");
    var temp = getthis.replace(/<input[^>]*>/gi, "<input name=\"Submit\" type=\"button\" value=\"Change Year\" id=\"button\" />");
    //only works for Change Year - var temp = getthis.replace(/<input[^>]*>/gi, "<input name=\"Submit\" type=\"button\" value=\"Change Year\" id=\"button\" />");
    //back reference works, but following line better - var temp = getthis.replace(/<input[^>]*value=[\"]?([^>]*)[\"]?[^>]*>/gi, "<input name=\"Submit\" type=\"button\" value=\"$1\" id=\"button\" />");
    var temp = getthis.replace(/onclick[^\s]*/gi, "");
    winpops.document.write(top + temp + bottom);
    winpops.document.close();
}
function checkEmail(sender, args) {
    var emailRegEx = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    args.IsValid = (String(args.Value).search(emailRegEx) != -1);
}
function checkDate(sender, args) {
    var dateRegEx = /^([1-9]|0[1-9]|1[012])[\/|-]([1-9]|0[1-9]|[12][0-9]|3[01])[\/|-](19|20)\d{2}$/;
    args.IsValid = (String(args.Value).search(dateRegEx) != -1);
}
function checkSSN(sender, args) {
    var ssnVal = getSsn();
    var pptVal = getPpt();

    if (ssnVal != undefined && pptVal != undefined) {
        if ((ssnVal.length == 0) && (pptVal.length == 0)) {
            args.IsValid = false;
        }
    }

    var ssnRegEx = /^\d{3}-\d{2}-\d{4}$/;
    if (pptVal != undefined) {
        if (pptVal.length == 0) {
            args.IsValid = (String(args.Value).search(ssnRegEx) != -1);
        }
        else {
            args.IsValid = true;
        }
    }
    else {
        args.IsValid = (String(args.Value).search(ssnRegEx) != -1);
    }
}
function checkPpt(sender, args) {
    var ssnVal = getSsn();
    var pptVal = getPpt();

    if (ssnVal != undefined && pptVal != undefined) {
        if ((ssnVal.length == 0) && (pptVal.length == 0)) {
            args.IsValid = false;
        }
    }

    if (ssnVal != undefined && pptVal != undefined) {
        if ((ssnVal.length == 0) && (pptVal.length == 0)) {
            args.IsValid = false;
            return;
        }
    }

    if (ssnVal != undefined) {
        if (ssnVal.length == 0) {
            args.IsValid = args.Value.toString().trim().length >= 6;
        }
        else {
            args.IsValid = true;
        }
    }
    else {
        args.IsValid = args.Value.toString().trim().length >= 6;
    }
}
function formatSSN(args) {
    var txt = document.getElementById(String(args));
    if ((txt.value.length == 3) || (txt.value.length == 6)) {
        txt.value = txt.value + "-";
    }
    txt.value = txt.value.replace("--", "-");
}
function formatDate(args) {
    var txt = document.getElementById(String(args));
    if ((txt.value.length == 2) || (txt.value.length == 5)) {
        txt.value = txt.value + "/";
    }
    txt.value = txt.value.replace("//", "/");
}
function checkCount(sender, args) {
    txt = String(args.Value);
    if (isNaN(txt)) {
        args.IsValid = false;
    } else {
        var num = parseInt(txt);
        if ((num > 0) && (num <= 40)) {
            args.IsValid = true;
        } else {
            args.IsValid = false;
        }
    }
}
function checkCurrency(sender, args) {
    if (String(args.Value).length > 0) {
        var moneyRegEx = /^((\d{1,6})((\.\d{1,2})?)){1}$/;
        args.IsValid = (String(args.Value).search(moneyRegEx) != -1);
    } else
        args.IsValid = false;
}
//]]>