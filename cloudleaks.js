/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/*
* Post some pee info
*
* Based on code by:
* 
* Author: Zion Orent <zorent@ics.com>
* Copyright (c) 2015 Intel Corporation.
*
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var toiletkey = 'jaeceifaexoonahsohgheCheiludaSeebaey2IiZaeCh1Zaph0aiveec4hohph3j';

// requests
var request = require('request');

// Load lcd module on I2C
var LCD = require('jsupm_i2clcd');

// Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS) 
var myLcd = new LCD.Jhd1313m1 (0, 0x3E, 0x62);

// RGB Red
myLcd.setColor(255, 0, 0);
myLcd.setCursor(0,0);
myLcd.write('Hello World');  
myLcd.setCursor(1,0);
myLcd.write('Starting up');

// Load Grove module
var groveSensor = require('jsupm_grove');

// Create the light sensor object using AIO pin 0
var light = new groveSensor.GroveLight(0);

var temp = new groveSensor.GroveTemp(1);

var digitalAccelerometer = require('jsupm_mma7660');

// Instantiate an MMA7660 on I2C bus 0
var myDigitalAccelerometer = new digitalAccelerometer.MMA7660(
					digitalAccelerometer.MMA7660_I2C_BUS, 
					digitalAccelerometer.MMA7660_DEFAULT_I2C_ADDR);

// place device in standby mode so we can write registers
myDigitalAccelerometer.setModeStandby();

// enable 64 samples per second
myDigitalAccelerometer.setSampleRate(digitalAccelerometer.MMA7660.AUTOSLEEP_64);

// place device into active mode
myDigitalAccelerometer.setModeActive();

var x, y, z;
x = digitalAccelerometer.new_intp();
y = digitalAccelerometer.new_intp();
z = digitalAccelerometer.new_intp();

var outputStr;

var myInterval = setInterval(function()
{
	myDigitalAccelerometer.getRawValues(x, y, z);
	console.log(light.raw_value(), light.value());
	myLcd.setColor(36, 202, 254);
	myLcd.setCursor(0,0);
	myLcd.write('x: '+digitalAccelerometer.intp_value(x)+' y: '+digitalAccelerometer.intp_value(y)+'   ');  
	myLcd.setCursor(1,0);
	myLcd.write('z: '+digitalAccelerometer.intp_value(z)+' t: '+temp.value()+' l: '+light.raw_value()+'  ');

	data = {};
	data.toiletkey = toiletkey;
	data.profilekey = 'anus';
	data.volume = light.raw_value();
	data.duration = digitalAccelerometer.intp_value(x);
	data.temperature = temp.value();
	data.salinity = digitalAccelerometer.intp_value(y);
	data.acidity = digitalAccelerometer.intp_value(z);
	data.pregnant = 0;

	request.post('https://cloudleaks.org/sample/create', {form: data}, function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            console.log(body)
		} else {
	            console.log(body)
		}	
        });
}, 5000);

// round off output to match C example, which has 6 decimal places
function roundNum(num, decimalPlaces)
{
	var extraNum = (1 / (Math.pow(10, decimalPlaces) * 1000));
	return (Math.round((num + extraNum) 
		* (Math.pow(10, decimalPlaces))) / Math.pow(10, decimalPlaces));
}

// When exiting: clear interval and print message
process.on('SIGINT', function()
{
	clearInterval(myInterval);

	// clean up memory
	digitalAccelerometer.delete_intp(x);
	digitalAccelerometer.delete_intp(y);
	digitalAccelerometer.delete_intp(z);

	myDigitalAccelerometer.setModeStandby();

	console.log("Exiting...");
	process.exit(0);
});


