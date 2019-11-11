/**
 * Created by kilic on 25.04.2017.
 */



var Notifications = function () {


};

Notifications.prototype.widgetLi = function (title, time, describe, link) {
    var element = '<li><a href="' + link + '"><div class="pull-left"><i class="circle-icon fa fa-list bg-green"></i></div><h4>' + title + '<small><i class="fa fa-clock-o"></i> ' + this.timeAgo(time) + '</small></h4><p>' + describe + '</p></a></li>';
    return element
};

Notifications.prototype.timeAgo = function (timestamp) {

    var seconds = Math.floor((new Date() - timestamp) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
};

function webPushNotification(title, describe, link) {
    if (!("Notification" in window)) {
        alert("Bu tarayıcı web bilgilendirme özelliğini desteklemiyor.");
    }

    // Daha önce kullanıcı izin verdi ise
    else if (Notification.permission === "granted") {
        // Bilgilendirme popup'ını çıkaralım.
        var notification = new Notification(title, {
            body: describe,
            data: link,
            icon: 'http://iys.iett.gov.tr/favicon.ico'
        });
        notification.onclick = function(event) {
           console.log(event,link);
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            window.open(link);
        }
    }

    // Eğer onay yoksa
    else if (Notification.permission !== 'denied') {
        // Kullanıcıdan onay ise
        Notification.requestPermission(function (permission) {
            // Kullanıcı onaylamadı ise tekrar soralım
            if (permission === "granted") {
                // onaylarsa bilgilendirme popup'ı aç
                var notification = new Notification(title, {
                    body: describe,
                    data: link,
                    icon: 'http://iys.iett.gov.tr/favicon.ico'

                });
                notification.onclick = function(event) {
                    console.log(event,link);
                    event.preventDefault(); // prevent the browser from focusing the Notification's tab
                    window.open(link);
                }

            }
        });
    }
}




