/**
 * Created by kilic on 20.06.2017.
 */

var Cevrimdisi = function () {
    this.map;
    this.timeline = [];
    this.konumVerisi = [];
    this.durakVerisi = [];
    this.infowindow = null;
    this.duraklar = [];
    this.positionCoordinates = [];
    this.hatCoordinates = [];
    this.otobusVerisi;
    this.otobusPosition;
    this.hatPath;
    this.loadingCenter = '';
    this.markers = [];
    this.simulationSpeed = 300;
    this.timeOutList = [];
    this.firstTimeStamp = '';
    this.lastTimeStamp = '';

    var _self = this;

    this.initMap = function () {


        _self.map = new google.maps.Map(document.getElementById("map_canvas"), {
            center: _self.loadingCenter,
            zoom: 14,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            scaleControl: true,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
        });

        //Otobüs Marker
        _self.otobusMarker();

        //Konum Marker
        _self.konumMarker();

        //Konum Çizgisi
        _self.konumCizgisi();

        //Hat Çizgisi
        _self.hatCizgisi();

        //Durak Marker
        _self.durakMarker();

        //Legend
        _self.markerLegend();

        _self.firstTimeStamp = Object.keys(_self.timeline)[0];
        _self.lastTimeStamp = Object.keys(_self.timeline)[Object.keys(_self.timeline).length - 1];
        this._initializeSlider();


        $('.position_marker').on('click', function () {
            google.maps.event.trigger(_self.konumVerisi[$(this).attr('data-id')], 'click');
        });
        $('.durak_marker').on('click', function () {
            durakPosition = new google.maps.LatLng($(this).attr('data-enlem'), $(this).attr('data-boylam'));
            _self.map.setCenter(durakPosition);
            _self.map.setZoom(19)
        });
    };

    this.konumMarker = function () {
        for (key in _self.markers) {
            //<?php $KmS[$key] = mb_split(",", $row->info); ?>
            var konumPosition = new google.maps.LatLng(_self.markers[key].markerY, _self.markers[key].markerX);
            _self.timeline[_self.markers[key].timestamp] = konumPosition;
            var konumSymbol = {
                path: google.maps.SymbolPath.CIRCLE,
                strokeColor: '#60daf6',
                fillOpacity: 1,
                scale: 3
            };
            _self.konumVerisi[key] = new google.maps.Marker({
                position: konumPosition,
                map: _self.map,
                icon: konumSymbol,
                title: key + 'Hello World!'
            });

            _self.infoWindow = new google.maps.InfoWindow({
                content: 'holding...'
            });
            _self.konumVerisi[key].content = "<b>Saat : </b>" + _self.markers[key].zaman + "<br/><b>Km : </b>" + _self.markers[key].mesafe + "<br/><b>Hiz : </b>" + _self.markers[key].hiz + "<br/><b>Koordinat : </b>" + _self.markers[key].markerY + "," + _self.markers[key].markerX + "<br/>";

            var marker = _self.konumVerisi[key];

            google.maps.event.addListener(_self.konumVerisi[key], 'click', function () {
                _self.infoWindow.setContent(this.content);
                _self.infoWindow.open(cevrimdisi.map, this);
            });


        }
    };

    this.durakMarker = function () {
        for (key in _self.duraklar) {
            //<?php $KmS[$key] = mb_split(",", $row->info); ?>
            var konumPosition = new google.maps.LatLng(_self.duraklar[key].NENLEM, _self.duraklar[key].NBOYLAM);
            var konumSymbol = {
                path: google.maps.SymbolPath.CIRCLE,
                strokeColor: '#f60012',
                fillOpacity: 5,
                scale: 10
            };
            _self.durakVerisi[key] = new google.maps.Marker({
                position: konumPosition,
                map: _self.map,
                icon: '/images/durakMarker64.png',
                title: _self.duraklar[key].SNOKTAADI,
            });

  //         _self.infoWindow = new google.maps.InfoWindow({
  //             content: 'holding...'
  //         });
  //         _self.durakVerisi[key].content = "<b>Saat : </b>" + _self.duraklar[0].zaman + "<br/><b>Km : </b>" + _self.duraklar[0].mesafe + "<br/><b>Hiz : </b>" + _self.duraklar[0].hiz + "<br/><b>Koordinat : </b>" + _self.duraklar[0].NBOYLAM + "," + _self.duraklar[0].NENLEM + "<br/>";

  //         var marker = _self.durakVerisi[key];

          google.maps.event.addListener(_self.durakVerisi[key], 'click', function () {
              _self.infoWindow.setContent(this.title);
              _self.infoWindow.open(cevrimdisi.map, this);
          });


        }
    };

    this.konumCizgisi = function () {
        var lineSymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            fillOpacity: 0.0,
            scale: 1
        };
        hatPath = new google.maps.Polyline({
            path: _self.positionCoordinates,
            strokeColor: '#0eb7f6',
            strokeOpacity: 0,
            fillOpacity: 0,
            icons: [{
                icon: lineSymbol,
                offset: '0',
                repeat: '10px'
            }],

        });
        hatPath.setMap(_self.map);
    };

    this.hatCizgisi = function () {
        hatPath = new google.maps.Polyline({
            path: _self.hatCoordinates,
            strokeColor: '#ad1d2b',
            strokeOpacity: 0.8,
            strokeWeight: 4

        });
        hatPath.setMap(_self.map);
    };

    this.otobusMarker = function () {
        //Otobüs Konumu
        _self.OtobusMarker = new google.maps.Marker({
            icon: '/images/busMarker2.png',
        });

        otobusPosition = new google.maps.LatLng(cevrimdisi.markers[Object.keys(cevrimdisi.markers)[0]].markerY, cevrimdisi.markers[Object.keys(cevrimdisi.markers)[0]].markerX);
        _self.otobusVerisi = new SlidingMarker({
            icon: '/images/busMarker2.png',
            title: 'Otobüsün Anlık Konumu!',
            position: otobusPosition,
            map: _self.map,
            duration: 2000,
            easing: 'linear',
            zIndex:99999
        });

    };

    this.markerLegend = function () {
        var legend = document.createElement('div');
        legend.id = 'legend';
        var content = [];
        content.push('<p><div class="markerIcon"><img src="/images/busMarker32.png"> </div>Otobüs</p>');
        content.push('<p><div class="markerIcon"><img src="/images/durakMarker56.png"></div>Durak</p>');
        content.push('<p><div class="markerIcon"><img src="/images/guzergahmarker.png"></div></div>Güzergah</p>');
        content.push('<p><div class="markerIcon"><img src="/images/gpskonum.png"></div>Konum GPS</p>');
        legend.innerHTML = content.join('');
        legend.index = 1;
        _self.map.controls[google.maps.ControlPosition.LEFT_TOP].push(legend);
    };



    this.playBusMarker = function () {
        _self._clearTimeOutList();
        var time = 0;
        var duration = 0;
        var firstTimeStamp = _self.firstTimeStamp;
        // _self.otobusVerisi.setPositionNotAnimated(_self.timeline[_self.firstTimeStamp]);
        _time = _self.firstTimeStamp;
        while (_time <= _self.lastTimeStamp) {
            _self.timeOutList.push(window.setTimeout(function () {
                $('#timeline-slider').trigger('change');
                document.getElementById("timeline-slider").stepUp(1);
            }, time));
            time = time + _self.simulationSpeed;
            _time++;
        }

        //   for (konum in _self.timeline) {
        //       time = konum - firstTimeStamp;
        //       firstTimeStamp = konum;
        //       duration = duration + time;
        //       console.log(_self.timeline[konum], time, duration);
        //       _self._changeBusPosition(_self.timeline[konum], duration * _self.simulationSpeed, time * _self.simulationSpeed)
        //   }
    };

    this.stopBusMarker = function () {
        _self._clearTimeOutList();
    };

    this._changeBusPosition = function (konum, time, timeDuration) {
        _self.timeOutList.push(window.setTimeout(function () {
            _self.otobusVerisi.setDuration(timeDuration);
            _self.otobusVerisi.setPosition(konum);
        }, time));
    };

    this._clearTimeOutList = function () {
        while (_self.timeOutList.length != 0) {
            window.clearTimeout(_self.timeOutList.pop());
        }
    };

    this._initializeSlider = function () {
        $('#timeline-slider').attr('min', _self.firstTimeStamp);
        $('#timeline-slider').attr('max', _self.lastTimeStamp);
        $('#timeline-slider').on('input', function (key, value) {
            var busPosition = _self.timeline[$(this).val()];
            if (typeof busPosition != 'undefined') {
                _self._changeBusPosition(busPosition, 300, 300);
            }
            _self.renderInfoBar();
        });
        $('#timeline-slider').on('change', function (key, value) {
            var busPosition = _self.timeline[$(this).val()];
            if (typeof busPosition != 'undefined') {
                _self._changeBusPosition(busPosition, _self.simulationSpeed * 10, _self.simulationSpeed * 10);
            }
            _self.renderInfoBar();
        });
        $('#timeline-slider').on('onmousedown', function (key, value) {
            _self.stopBusMarker();

        })
    };

    this.renderInfoBar = function () {
        if (typeof cevrimdisi.markers[$('#timeline-slider').val()] != 'undefined') {
            $('#info-hiz').text(cevrimdisi.markers[$('#timeline-slider').val()].hiz);
            $('#info-sure').text(cevrimdisi.markers[$('#timeline-slider').val()].zaman);
            $('#info-mesafe').text(cevrimdisi.markers[$('#timeline-slider').val()].mesafe)
        }
    }


};


