/**
 *  clock-timer.js - a basic animated clock in JavaScript.
 *  v0.0.1
 *  (c) 2013 Miguel Mota [www.miguelmota.com]
 *  Released under the MIT license.
 */

(function( root ) {

    "use strict";

    // Clock constructor
    var ClockTimer = function ( options ) {

        // Shallow object merging
        this.mergeObj = function ( obj1, obj2 ){

            var obj3 = {};

            for ( var attrname in obj1 ) {
                obj3[attrname] = obj1[attrname];
            }

            for ( var attrname in obj2) {
                obj3[attrname] = obj2[attrname];
            }

            return obj3;
        };

        // Set _this to global `this`
        var _this = this;

        // Settings
        this.settings = {

            // Set border width
            lineWidth: 15,

            // Set circle radius
            radius: 100,

            secondsCanvas: true,
            minutesCanvas: true,
            hoursCanvas: true,
            daysCanvas: true,

            // Set stroke style
            secondsStrokeStyle: "#000",
            minutesStrokeStyle: "#000",
            hoursStrokeStyle: "#000",
            daysStrokeStyle: "#000",

            // Set fill style
            secondsFillStyle: null,
            minutesFillStyle: null,
            hoursFillStyle: null,
            daysFillStyle: null,

            // Set shadow color
            minutesShadowcolor: null,
            secondsShadowColor: null,
            hoursShadowColor: null,
            daysShadowColor: null,

            // Set shaodow blur
            shadowBlur: 0,

            // Set time
            now: new Date(Date.now()),
            startDate: null,
            endDate: null,

            // Set selectors
            daysCanvasSelector: "#days-canvas",
            hoursCanvasSelector: "#hours-canvas",
            minutesCanvasSelector: "#minutes-canvas",
            secondsCanvasSelector: "#seconds-canvas",

            daysCountSelector: "#days-count",
            hoursCountSelector: "#hours-count",
            minutesCountSelector: "#minutes-count",
            secondsCountSelector: "#seconds-count"

        };

        // Merge user settings with default settings
        this.settings = this.mergeObj( this.settings, options );

        // Get numerical values of border width and radius
        this.settings.lineWidth = parseInt(this.settings.lineWidth);
        this.settings.radius = parseInt(this.settings.radius);

        // Grab selector canvas DOM elements
        this.canvasDays = document.querySelector( this.settings.daysCanvasSelector );
        this.canvasHours = document.querySelector( this.settings.hoursCanvasSelector );
        this.canvasMinutes = document.querySelector( this.settings.minutesCanvasSelector );
        this.canvasSeconds = document.querySelector( this.settings.secondsCanvasSelector );

        // Grab selector counter DOM elements
        this.daysCountElement = document.querySelector( this.settings.daysCountSelector );
        this.hoursCountElement = document.querySelector( this.settings.hoursCountSelector );
        this.minutesCountElement = document.querySelector( this.settings.minutesCountSelector );
        this.secondsCountElement = document.querySelector( this.settings.secondsCountSelector );

        var clock = false;

        // Regular clock
        if (!this.settings.startDate && !this.settings.endDate) {
            this.settings.now = new Date(Date.now());
            this.settings.startDate = null;
            this.settings.endDate = null;

            clock = true;
        }

        var between = false;

        // Between two dates
        if (this.settings.startDate < this.settings.endDate) {
            this.settings.now = ( ( new Date( this.settings.now ) ).getTime() / 1000 );

            var datetime = this.settings.startDate.split(' ');
            var dateValues = datetime[0].split('/');
            var timeValues = datetime[1].split(':');

            for (var i = 0; i < dateValues.length; i++) {
                dateValues[i] = parseInt(dateValues[i], 10);
            }

            for (var i = 0; i < timeValues.length; i++) {
                timeValues[i] = parseInt(timeValues[i], 10);
            }

            var month   = dateValues[0];
            var day     = dateValues[1];
            var year    = dateValues[2];

            var hours   = timeValues[0];
            var minutes = timeValues[1];
            var seconds = timeValues[2];

            this.settings.startDate = ( Date.UTC( year, month, day, hours, minutes, seconds ) / 1000 );


            var datetime = this.settings.endDate.split(' ');
            var dateValues = datetime[0].split('/');
            var timeValues = datetime[1].split(':');

            for (var i = 0; i < dateValues.length; i++) {
                dateValues[i] = parseInt(dateValues[i], 10);
            }

            for (var i = 0; i < timeValues.length; i++) {
                timeValues[i] = parseInt(timeValues[i], 10);
            }

            var month   = dateValues[0];
            var day     = dateValues[1];
            var year    = dateValues[2];

            var hours   = timeValues[0];
            var minutes = timeValues[1];
            var seconds = timeValues[2];

            this.settings.endDate = ( Date.UTC( year, month, day, hours, minutes, seconds ) / 1000 );

            between = true;
        }

        var countdown = false;

        // Countdown
        if (!this.settings.startDate && this.settings.endDate) {
            this.settings.now = ( ( new Date() ).getTime() / 1000 );
            this.settings.startDate = this.settings.now;

            var datetime = this.settings.endDate.split(' ');
            var dateValues = datetime[0].split('/');
            var timeValues = datetime[1].split(':');

            for (var i = 0; i < dateValues.length; i++) {
                dateValues[i] = parseInt(dateValues[i], 10);
            }

            for (var i = 0; i < timeValues.length; i++) {
                timeValues[i] = parseInt(timeValues[i], 10);
            }

            var month   = dateValues[0];
            var day     = dateValues[1];
            var year    = dateValues[2];

            var hours   = timeValues[0];
            var minutes = timeValues[1];
            var seconds = timeValues[2];

            this.settings.endDate = ( Date.UTC( year, month - 1, day, hours, minutes, seconds ) / 1000 );

            countdown = true;
        }

        // Calculate clock time
        if (clock) {
            this.settings.now = new Date();
            this.settings.total = null;

            this.settings.hours = this.settings.now.getHours();
            this.settings.minutes = this.settings.now.getMinutes();
            this.settings.seconds = this.settings.now.getSeconds();

            this.settings.modeClock = true;
        }

        // Calculate times in between
        if (between) {
            this.settings.total = ( Math.floor( ( this.settings.endDate - this.settings.startDate ) / 86400 ) );
            this.settings.days = ( Math.floor( ( this.settings.endDate - this.settings.startDate ) / 86400 ) );
            this.settings.hours = ( 24 - Math.floor( ( ( this.settings.endDate - this.settings.now ) % 86400) / 3600 ) );
            this.settings.minutes = ( 60 - Math.floor( ( ( ( this.settings.endDate - this.settings.now ) % 86400 ) % 3600) / 60 ) );
            this.settings.seconds = ( Math.floor( this.settings.now % 60 ) );

            this.settings.modeClock = false;
        }

        // Calculate countdown times
        if (countdown) {
            this.settings.total = ( Math.floor( ( this.settings.endDate - this.settings.startDate ) / 86400 ) );
            this.settings.days = ( Math.floor( ( this.settings.endDate - this.settings.now ) / 86400 ) );

            this.settings.hours = ( 24 - Math.floor( ( ( this.settings.endDate - this.settings.now ) % 86400) / 3600 ) );
            this.settings.minutes = ( 60 - Math.floor( ( ( ( this.settings.endDate - this.settings.now ) % 86400 ) % 3600) / 60 ) );
            this.settings.seconds = ( 60 - Math.floor( ( ( ( ( this.settings.endDate - this.settings.now ) % 86400 ) % 3600) % 60 ) / 60 ) );
            // this.settings.seconds = ( Math.floor( this.settings.now % 60 ) );
            this.settings.modeClock = false;
            _this.settings.seconds = 60;
        };

        // Get Degree method
        this.getDeg = function(deg) {
            return ( ( Math.PI / 180 ) * 270 - ( Math.PI / 180 ) * deg );
        };

        // Canvas circle constructor
        this.circle = function( canvas, strokeStyle, arcArgs, fillStyle ) {

            // Set variables
            this.canvas = canvas;
            this.arcArgs = arcArgs;
            this.strokeStyle = strokeStyle;

            // Set canvas width and height
            this.canvas.width =  this.canvas.height = ( ( _this.settings.radius * 2 ) + ( _this.settings.lineWidth ) );

            // Grab the canvas context
            this.context = this.canvas.getContext("2d");

            // Clear out the context
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Begin stroke
            this.context.beginPath();
            this.context.strokeStyle = this.strokeStyle;

            // Set shadows
            this.context.shadowBlur    = 1;
            this.context.shadowOffsetX = 0;
            this.context.shadowOffsetY = 0;
            this.context.shadowColor = "black";

            // Set context arc
            // Ex. context.arc( x, y, radius, startAngle, endAngle, counterclockwise )
            this.context.arc.call(this.context, (  this.canvas.width / 2 ), ( this.canvas.height / 2 ), _this.settings.radius, this.arcArgs, _this.getDeg(0), false );

            // Set fill styles
            if (this.fillStyle) {
                this.context.fillStyle = this.fillStyle;
                this.context.fill();
            }

            // Set stroke width
            this.context.lineWidth = _this.settings.lineWidth;

            // Draw it on the canvas
            this.context.stroke();

        };

        // Set count selector value
        this.setCount = function( value ) {

            this.value = value;

            this.textContent = this.value;

        }

        // Run Days
        this.runDays = function() {

            if ( _this.canvasDays && this.settings.daysCanvas === true ) {

                this.strokeStyle = _this.settings.daysStrokeStyle;
                this.fillStyle = _this.settings.daysFillStyle;

                //this.arcArgs = _this.getDeg( ( 360 / _this.settings.total ) * ( _this.settings.total - _this.settings.days ) );
                this.arcArgs = _this.getDeg( ( 360 / _this.settings.total ) * ( _this.settings.days ) );

                _this.circle.call( this, _this.canvasDays, this.strokeStyle, this.arcArgs, this.fillStyle );

            }

            this.textValue = _this.settings.days;

            _this.setCount.call( _this.daysCountElement, this.textValue );

        };

        // Run Hours
        this.runHours = function() {

            if ( _this.canvasHours && this.settings.hoursCanvas === true ) {

                this.strokeStyle = _this.settings.hoursStrokeStyle;
                this.fillStyle = _this.settings.hoursFillStyle;

                this.arcArgs = _this.getDeg( 15 * _this.settings.hours );

                _this.circle.call( this, _this.canvasHours, this.strokeStyle, this.arcArgs, this.fillStyle );

            }

            this.textValue = 24 - _this.settings.hours;

            if ( _this.settings.modeClock === true ) {
                this.textValue = _this.settings.hours;
            }

            _this.setCount.call( _this.hoursCountElement, this.textValue );

        };

        // Run Minutes
        this.runMinutes = function() {

            if ( _this.canvasMinutes && this.settings.minutesCanvas === true ) {

                this.strokeStyle = _this.settings.minutesStrokeStyle;
                this.fillStyle = _this.settings.minutesFillStyle;

                this.arcArgs = _this.getDeg( 6 * _this.settings.minutes );

                _this.circle.call( this, _this.canvasMinutes, this.strokeStyle, this.arcArgs, this.fillStyl );

            }

            this.textValue = 60 - _this.settings.minutes;

            if ( _this.settings.modeClock === true ) {
                this.textValue = _this.settings.minutes;
            }

            _this.setCount.call( _this.minutesCountElement, this.textValue );

        };

        // Run Seconds
        this.runSeconds = function() {

            if ( _this.canvasSeconds && this.settings.secondsCanvas === true ) {

                this.strokeStyle = _this.settings.secondsStrokeStyle;
                this.fillStyle = _this.settings.secondsFillStyle;

                this.arcArgs = _this.getDeg( 6 * _this.settings.seconds );

                _this.circle.call( this, _this.canvasSeconds, this.strokeStyle, this.arcArgs, this.fillStyle );

            }

            this.textValue = _this.settings.seconds;
            console.log(this.textValue);

            if ( _this.settings.modeClock === true ) {
                this.textValue = _this.settings.seconds;
            }

            _this.setCount.call( _this.secondsCountElement, this.textValue );

        };

        // Start Clock
        this.start = function() {

            // Return immediately if invalid dates
            if ( _this.settings.now >= _this.settings.endDate ) {
                //return;
            }

            // Begin running clocks
            _this.runSeconds();
            _this.runMinutes();
            _this.runHours();

            // if ( _this.settings.modeClock === false ) {
            //  _this.runDays();
            // }

            // if ( _this.settings.modeClock === true ) {

            //     this.run = function() {

            //         _this.settings.now = new Date();

            //         _this.settings.hours = _this.settings.now.getHours();
            //         _this.settings.minutes = _this.settings.now.getMinutes();
            //         _this.settings.seconds = _this.settings.now.getSeconds();

            //         //_this.settings.hours = ( _this.settings.hours > 12 ) ? _this.settings.hours - 12 : _this.settings.hours;

            //         //_this.settings.hours = ( _this.settings.hours === 0 ) ? 12 : _this.settings.hours;

            //         //_this.settings.minutes = (  _this.settings.minutes < 10 ? "0" : "" ) +  _this.settings.minutes;

            //         //_this.settings.seconds = (  _this.settings.seconds < 10 ? "0" : "" ) +  _this.settings.seconds;

            //         _this.runSeconds();
            //         _this.runMinutes();
            //         _this.runHours();

            //     };

            // } else {

                // The gears of the Clock
                this.run = function(){
                    if (_this.settings.seconds === 0) {
                        clearInterval(_this.interval);
                    }
                    // if ( _this.settings.seconds > 59 ) {

                    //     if ( 60 - _this.settings.minutes === 0 && 24 - _this.settings.hours === 0 && _this.settings.days === 0 ) {

                    //         // Countdown complete

                    //         clearInterval(this.interval);

                    //         return;
                    //     }

                    //     _this.settings.seconds = 1;

                    //     if ( _this.settings.minutes > 59 ) {

                    //         _this.settings.minutes = 1;

                    //         _this.runMinutes();

                    //         if ( _this.settings.hours > 23 ) {

                    //             _this.settings.hours = 1;

                    //             if ( _this.settings.days > 0 ) {

                    //                 _this.settings.days--;

                    //                 _this.runDays();
                    //             }

                    //         } else {

                    //             _this.settings.hours++;

                    //         }

                    //         _this.runHours();

                    //     } else {

                    //         _this.settings.minutes++;

                    //     }

                    //     _this.runMinutes();

                    // } else {

                        _this.settings.seconds--;

                    // }

                    _this.runSeconds();

                };

            // }

            // Run every second
            this.interval = setInterval( this.run, 1000 );

        };

        // Initialize
        this.start();

        return this;
    };

    // Export
    if (typeof exports !== 'undefined') {
      if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = ClockTimer;
      }
      exports.ClockTimer = ClockTimer;
    } else if (typeof define === 'function' && define.amd) {
      define([], function() {
        return ClockTimer;
      });
    } else {
      root.ClockTimer = ClockTimer;
    }

})( this );