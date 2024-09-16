var allText = getAllText();
var activeTooltip = 0;
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.getElementsByClassName('day-element');
    const popup = document.getElementById('popup');
    const messageStr = document.getElementById('messageStr');
    const overlay = document.getElementById('overlay');
    const saveButton = document.getElementById('saveButton');
    const popupText = document.getElementById('popupText');
    const tooltip = document.getElementById('tooltip');

    for (idx = 0; idx < buttons.length; idx++) {
        button = buttons[idx];
        button.addEventListener('click', function (e) {
            console.log(e.target);
            if (e.target.classList.contains('day-element') === false) {
                target = e.target.parentNode;
            } else {
                target = e.target;
            }
            dateStr = target.attributes['fulldate'].value;
            if (allText.hasOwnProperty(dateStr)) {
                savedText = allText[dateStr];
            } else {
                savedText = "";
            }
            messageStr.innerHTML = "شما در حال ثبت برای تاریخ " + dateStr + " هستید:";
            popup.style.display = 'block';
            popup.setAttribute('fulldate', dateStr);
            popupText.value = savedText;
            overlay.style.display = 'block';
        });
        button.addEventListener('mouseenter', function (e) {
            activeTooltip++;
            console.log(e.target);
            if (e.target.classList.contains('day-element') === false) {
                target = e.target.parentNode;
            } else {
                target = e.target;
            }
            dateStr = target.attributes['fulldate'].value;
            if (allText.hasOwnProperty(dateStr)) {
                savedText = allText[dateStr];
            } else {
                savedText = "بدون رویداد";
            }
            tooltip.innerHTML = savedText;
            tt = this;
            alltop = 0;
            allleft = 0;
            while (tt !== null) {
                alltop += tt.offsetTop;
                allleft += tt.offsetLeft;
                tt = tt.offsetParent;
            }
            tooltipMargin = 70;
            tooltip.style.top = (alltop + tooltipMargin) + "px";
            tooltip.style.left = (allleft + tooltipMargin) + "px";
            console.log({alltop: alltop, allleft: allleft});
            window.setTimeout(function () {
                tooltip.style.display = "block";
            }, 500);
        });
        button.addEventListener('mouseout', function (e) {
            activeTooltip--;
            if (activeTooltip < 0) {
                tooltip.style.display = "none";
            }
        });
    }

    overlay.addEventListener('click', function () {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    });

    saveButton.addEventListener('click', function (e) {
        console.log(e.target);
        const text = popupText.value;
        console.log('متن ذخیره شده:', text);
        popup.style.display = 'none';
        overlay.style.display = 'none';
        dateStr = popup.attributes['fulldate'].value;
        submitText(text, dateStr);

    });
});
function submitText(textString, dateString) {
    document.getElementById("showResult").innerHTML += textString + " => " + dateString + "<br>";
    allText[dateString] = textString;
    textString = encodeURI(textString);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById("showResult").innerHTML += this.responseText + "<br>";
        }
    };
    xhttp.open("POST", "/postText");
    xhttp.setRequestHeader("data", JSON.stringify({text: textString, date: dateString}));
    xhttp.send();

}
function getAllText() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            data = this.responseText;
            if (data !== '') {
                allText = JSON.parse(data);
                for (var a in allText) {
                    allText[a] = decodeURI(allText[a]);
                    console.log(a);
                }
            }
        }
    };
    xhttp.open("POST", "/getText");
    xhttp.send();
    return {};
}