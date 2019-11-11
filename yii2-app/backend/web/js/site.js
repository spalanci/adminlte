/**
 * Created by kilic on 08.02.2017.
 */
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();

if (dd < 10) {
    dd = '0' + dd
}

if (mm < 10) {
    mm = '0' + mm
}

today = mm + '/' + dd + '/' + yyyy;
var ajax = null;
var ajaxController = function () {
    this.tabLoading = '<div class="loading"><br/><div class="overlay"><i class="fa fa-refresh fa-spin"></i></div><br/></div>';
    this.url = null;
    this.initialize();
    this.eventListener();
    _self = this;
};

//Bu kısım ilk nesne açıldığındaki çağrılması metodu temsil eder
ajaxController.prototype.initialize = function () {
    // autoLoadAjaxView();
    this.initAjax()

};

//Bu kısım ajax veya pjax ile dosya çağrıldığında çağrılması gereken metodu temsil eder.
ajaxController.prototype.initAjax = function () {

    console.warn('init çalıştı;');
    if ($(".select2").length > 0) {
        $(".select2").select2();
    }
    if ($('#arac-bilgisi #oto').length > 0) {

        $('#arac-bilgisi #oto').select2({
            ajax: {
                url: '/olay/ekle?islem=kapiNoTamamla',
                dataType: 'json',

                processResults: function (data) {
                    return {
                        results: data.items
                    };
                }
            }
        });
    }
    if ($('#arac-bilgisi #oto-guncel').length > 0) {

        $('#arac-bilgisi #oto-guncel').select2({
            ajax: {
                url: '/olay/ekle?islem=kapiNoTamamlaGuncel',
                dataType: 'json',

                processResults: function (data) {
                    return {
                        results: data.items
                    };
                }
            }
        });
    }

    if ($('#sicil-bilgisi #sicilNo').length > 0) {

        $('#sicil-bilgisi #sicilNo').select2({
            ajax: {
                url: '/olay/ekle?islem=sicilNoTamamla',
                dataType: 'json',

                processResults: function (data) {
                    return {
                        results: data.items

                    };
                }
            }
        });
    }

    if ($('#hat-bilgisi #guzergahHat').length > 0) {

        $('#hat-bilgisi #guzergahHat').select2({
            ajax: {
                url: '/olay/ekle?islem=guzergahHatNoTamamla',
                dataType: 'json',

                processResults: function (data) {
                    return {
                        results: data.items

                    };
                }
            }
        });
    }
    if ($('.datepicker').length > 0) {
        $('.datepicker').datepicker({
            autoclose: true,
            language: 'tr',
            endDate: today,
            defaultDate: today,
            onClose: function () {
                console.log('CHANGE');
                $(this).trigger('change');
            }

        }).off('change').on('change', function (x, y) {
            console.log(x, y);
            _self.pjax('/olay/filtrele', null, $('form#filtre').serializeArray(),null,'GET')

        })
        //     $(".datepicker").datepicker("setDate", today);
    }


    if ($('input[type="checkbox"].minimal-red, input[type="radio"].minimal-red').length > 0) {
        $('input[type="checkbox"].minimal-red, input[type="radio"].minimal-red').iCheck({
            checkboxClass: 'icheckbox_minimal-red',
            radioClass: 'iradio_minimal-red'
        });
    }

};

ajaxController.prototype.tabLoad = function () {
    $('#olay-detay-tab li.active a').click();
};

ajaxController.prototype.autoLoadAjaxView = function () {
    console.log('url', window.location.href);
    if (!clickToLink(window.location.href)) {
        console.log('Ajax Kaynak : Window.location.href');
        this.pjax(window.location.href, null, null)
    }
};

ajaxController.prototype.loading = function () {

};
ajaxController.prototype.pjax = function (loadurl, targ, data, push, method) {
    console.log('-----PJAX----', loadurl, targ, data, push, '-----/PJAX/------');
    if (loadurl == 'http://iys-test.iett.gov.tr/#') {
        return;
    }
    if (targ == null) {
        targ = '#grid-view';
    }
    if (push == null) {
        push = true;
    }
    if (method == null) {
        method = 'POST';
    }
    if ($(targ).parents('#olay-ajax-detay').length > 0) {
        $(targ).parents('#olay-ajax-detay').prepend(this.tabLoading);
    } else {
        $(targ).prepend(this.tabLoading)
    }
    if (data == null) {
        if ($(targ).length > 0) {
            $.pjax({
                url: loadurl,
                container: targ,
                timeout: false,
                push: push,
            });
        }

    } else {
        $.pjax({
            type: method,
            method: method,
            url: loadurl,
            container: targ,
            timeout: false,
            push: push,
            data: data
        });
    }
};
ajaxController.prototype.eventListener = function () {

    //Genel Filtre kısmındaki li elementlerinin ajax tetiklemesinde yapılacak kısımları içerir
    $('#filtre-genel li').on('click', function () {
        console.log('calisti a');
        $('#filtre-genel li').each(function (key, item) {
            $(this).removeClass('active');
        });
        $(this).addClass('active');
    });


    //Pjaxın çalışması istendiği durumlar
    $(document).on('click', '[data-toggle="datapjax"]', function (e) {
        e.preventDefault();
        loadurl = $(this).attr('href');
        targ = $(this).attr('data-target');
        _self.pjax(loadurl, targ, null);
        return true;
    });

    $(document).on('click', '[data-toggle="tabajax"]', function (e) {
        e.preventDefault();
        loadurl = $(this).attr('href');
        targ = $(this).attr('data-target');
        _self.pjax(loadurl, targ, null, false);
        $(this).tab('show');
        return false;
    });

    $(document).on('submit', '[data-toggle="ajaxform"]', function (e) {
        e.preventDefault();
        console.log('girdi', $(this));
        query = '?' + $(this).serialize();
        loadurl = $(this).attr('action');
        targ = $(this).attr('data-target');
        _self.pjax(loadurl + query, targ, null, false);
        return false;
    });

    $(document).on('click', '[data-toggle="modalajax"]', function (e) {
        e.preventDefault();
        loadurl = $(this).attr('href');
        targ = $(this).attr('data-target');
        _self.pjax(loadurl, targ, null, false);
        $('#modalUrl').modal();
        setTimeout(function () {
            _self.initAjax();
        }, 500);
        return false;
    });

    $(".olaylar .select2").change(function () {
        _self.pjax('/olay/filtrele', null, $('form#filtre').serializeArray(), null, 'GET')
    });

    $("form#searchId").on('submit', function (e) {
        e.preventDefault();
        console.log(_self.pjax('/olay/filtrele', null, $(this).serializeArray(),null, 'GET'));
    });


};

ajaxController.prototype.render = function (url) {
    $('#olay-ajax-detay').prepend(this.tabLoading);
    console.warn('renderAjax çalıştı');
    if (url == null) {
        url = window.location.href;
    }
    $.post(url, $('form#filtre').serializeArray(), function (data) {
        $('#olay-ajax-detay').html(data);
        initialize();
    });
};

var getUrlParameter = function getUrlParameter(sParam, url) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1));
    if (url != null) {
        sPageURL = url;
    }
    var sURLVariables = sPageURL.split('&');
    var sParameterName;
    var i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function renderKazaDetay() {
    $('#olay-ajax-detay').prepend(tabLoading);
    $.post('/kaza/listele', $('form#filtre').serializeArray(), function (data) {
        $('#olay-ajax-detay').html(data);

    });
}

function renderKrizDetay() {
    $('#olay-ajax-detay').prepend(tabLoading);
    $.post('/kriz/listele', $('form#filtre').serializeArray(), function (data) {
        $('#olay-ajax-detay').html(data);

    });
}

function renderArizaDetay() {
    $('#olay-ajax-detay').prepend(tabLoading);
    $.post('/ariza/listele', $('form#filtre').serializeArray(), function (data) {
        $('#olay-ajax-detay').html(data);

    });
}

function renderPuantajDetay() {
    $('#olay-ajax-detay').prepend(tabLoading);
    $.post('/puantaj/listele', $('form#filtre').serializeArray(), function (data) {
        $('#olay-ajax-detay').html(data);
    });
}

function clickToLink(link) {
    var item = $('[href="' + link + '"]');
    console.warn('ClickToLink', item);
    if ($(item).length > 0) {
        console.warn('Click işlemi başlatıldı');
        $(item).click();
        return true
    }
    return false;
}

/**
 * init metodu ajax ile çağırılan sayfalarda document.ready fonksiyonunu tekrar etmesi için yazılmıştır.
 */



$(document).ready(function () {




    //Tümü sayfasındaki özel filtrelerin listeleme sayfasını filtrelemesi
    $(".krizler .select2").change(function () {
        renderKrizDetay();
    });
    /**
     $(".olaylar .select2").change(function () {
        renderOlayDetay();
    });
     **/
    $(".arizalar .select2").change(function () {
        renderArizaDetay();
    });

    $("#filtre [type='checkbox']").on('ifChanged', function (event) {
        renderKazaDetay();
    });

    $(".puantaj input").on('change', function (event) {
        renderPuantajDetay();
    });


    //PJAXın isteğinin bitmesi sonucu loading iconunun kaldırılması
    $(document).on('pjax:complete', '#grid-view', function () {
        console.warn('Pjax Tamamlandı');
        $('.loading').remove();
    });

    //PJAXın isteğinin bitmesi sonucu loading iconunun kaldırılması
    $(document).on('pjax:error', '#grid-view', function (event) {
        alert('Ekran getirilirken hata oluştu. Lütfen tekrar deneyiniz.');
        event.preventDefault();
    });


    $(document).on('submit', '#savunma-yukle', function (e) {
        e.preventDefault();
        $('.modal-content').append(ajax.tabLoading);
        var formData = new FormData($('#savunma-yukle')[0]);
        var form = $(this);
        $.ajax({
            url: '/savunma/savunma-yukle',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                if (data.success == 1) {
                    return window.location.reload();
                } else {
                    $(form).find('.response').html(data.messages).fadeIn();
                    $('.loading').remove();
                }
            }
        });

    });

    $(document).on('submit', '#aciklama-ekle', function (e) {
        e.preventDefault();
        $('.modal-content').append(ajax.tabLoading);
        var formData = new FormData($('#aciklama-ekle')[0]);
        var form = $(this);
        $.ajax({
            url: '/olay/aciklama-ekle',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                if (data.success == 1) {
                    return window.location.reload();
                } else {
                    $(form).find('.response').html(data.messages).fadeIn();
                    $('.loading').remove();
                }
            }
        });

    });

    $(document).on('submit', '#madde-degistir', function (e) {
        e.preventDefault();
        var formData = $(this).serializeArray();
        var form = $(this);
        $.post('/olay/madde-degistir', formData, function (data) {
            if (data.success == 1) {
                return window.location.reload();
            } else {
                $(form).find('.response').html(data.messages).fadeIn();
            }
        }, 'json')

    });
    $(document).on('submit', '#olay-olustur', function (e) {
        e.preventDefault();
        var formData = $(this).serializeArray();
        var form = $(this);
        $.post('/olay/ekle', formData, function (data) {
            if (data.success == 1) {
                return window.location.reload();
            } else {
                $(form).find('.response').html(data.messages).fadeIn();
            }
        }, 'json')

    });
    $(document).on('submit', '#kategori-guncelle', function (e) {
        e.preventDefault();
        var formData = $(this).serializeArray();
        var form = $(this);
        $.post('/olay/kategori-guncelle', formData, function (data) {
            if (data.success == 1) {
                return window.location.reload();
            } else {
                $(form).find('.response').html(data.messages).fadeIn();
            }
        }, 'json')

    });
    $(document).on('submit', '#yetkili-degistir', function (e) {
        e.preventDefault();
        var formData = $(this).serializeArray();
        var form = $(this);
        $.post('/olay/yetkili-degistir', formData, function (data) {
            if (data.success == 1) {
                return window.location.reload();
            } else {
                $(form).find('.response').html(data.messages).fadeIn();
            }
        }, 'json')

    });
    $(document).on('click', '#save-filter', function () {
        var formData = $('form#filtre').serializeArray();
        formData.push({name: 'name', value: $('form#filtre-ekle [name="name"]').val()});
        $.post('/olay/filtre-ekle', formData, function (data) {
            if (data.success == 1) {
                window.location.reload();
            } else {
                $('#filtre-ekle .response').html(data.messages).fadeIn();
            }
        }, 'json')

    });
    $('.remove-filter').on('click', function (e) {
        e.preventDefault();
        $.getJSON($(this).attr('href'), function (data) {
            if (data.success == 1) {
                window.location.reload();
            }
            $('#filtre-ekle .response').html(data.messages).fadeIn();
        }, 'json')

    });
    $(document).on('submit', 'form.asama12', function (e) {
        e.preventDefault();
        var formData = $(this).serialize();
        $.get('/olay/ekle', formData, function (data) {
            $('#asama2').html(data);
        })

    });

    $('#crmform').on('submit', function (e) {
        e.preventDefault();
        if ($('[name="cezamadde"]').val() == 0) {
            var dogrula = confirm('Madde seçimi yapmadan kayıt işlemine devam etmek istiyor musunuz?');
            if (dogrula != true) {
                return false;
            }
        }
        $('.col-md-4').append(ajax.tabLoading);
        var url = $(this).attr("data-target");
        $.ajax({
            type: "POST",
            url: url,
            success: function (result) {
                if (result.success == false) {
                    alert('danger', result.messages, '#messages')
                }
                else{
                    window.location.replace(result.redirect);
                }
                $('.loading').remove();
            },
            data: $(this).serializeArray(),
            dataType: 'json'
        });

    });


    ajax = new ajaxController();
    if (typeof $.pjax != 'undefined') {
        ajax.autoLoadAjaxView();
    }


});


function alert(type, messages, target) {
    var output = '';
    if (typeof messages == 'object') {
        for (var property in messages) {
            output += messages[property] + '\n';
        }
    } else {
        output = messages;
    }
    var element = '<div class="col-md-12 alert alert-' + type + '">' + output + '</div>';
    $(target).html($(element).fadeIn()).fadeIn();
}




