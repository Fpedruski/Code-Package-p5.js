// P_1_2_3_04.pde
//
// Generative Gestaltung, ISBN: 978-3-87439-759-9
// First Edition, Hermann Schmidt, Mainz, 2009
// Hartmut Bohnacker, Benedikt Gross, Julia Laub, Claudius Lazzeroni
// Copyright 2009 Hartmut Bohnacker, Benedikt Gross, Julia Laub, Claudius Lazzeroni
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * generates a specific color palette and some random "rect-tilings"
 *
 * MOUSE
 * left click          : new composition
 *
 * KEYS
 * s                   : save png
 * c                   : save color palette
 */
"use strict";

var colorCount = 20;
var hueValues = [];
var saturationValues = [];
var brightnessValues = [];
var alphaValue = 27;
var actRandomSeed = 0;


function setup() {
  createCanvas(800,800);
  colorMode(HSB,360,100,100,100);
  noStroke();
}

function draw() {
  noLoop();
  background(0,0,0);
  randomSeed(actRandomSeed);

  // ------ colors ------
  // create palette
  for (var i=0; i<colorCount; i++) {
    if (i%2 == 0) {
      hueValues[i] = int(random(0,360));
      saturationValues[i] = 100;
      brightnessValues[i] = int(random(0,100));
    }
    else {
      hueValues[i] = 195;
      saturationValues[i] = int(random(0,20));
      brightnessValues[i] = 100;
    }
  }

  // ------ area tiling ------
  // count tiles
  var counter = 0;
  // row count and row height
  var rowCount = int(random(5,30));
  var rowHeight = height/rowCount;

  // seperate each line in parts
  for(var i=rowCount; i>=0; i--) {
    // how many fragments
    var partCount = i+1;
    var parts = [];

    for(var ii=0; ii<partCount; ii++) {
      // sub fragments or not?
      if (random(1) < 0.075) {
        // take care of big values
        var fragments = int(random(2,20));
        partCount = partCount + fragments;
        for(var iii=0; iii<fragments; iii++) {
          parts.push(random(2));
        }
      }
      else {
        parts.push(random(2,20));
      }
    }

    // add all subparts
    var sumPartsTotal = 0;
    for(var ii=0; ii<partCount; ii++) sumPartsTotal += parts[ii];

    // draw rects
    var sumPartsNow = 0;
    for(var ii=0; ii<parts.length; ii++) {
      sumPartsNow += parts[ii];

      if (random(1.0) < 0.45) {
        var x = map(sumPartsNow, 0,sumPartsTotal, 0,width);
        var y = rowHeight*i;
        var w = map(parts[ii], 0,sumPartsTotal, 0,width)*-1;
        var h = rowHeight*1.5;

        var index = counter % colorCount;
        var col1 = color("black");
        var col2 = color(hueValues[index],saturationValues[index],brightnessValues[index],alphaValue);
        gradient(x, y, w, h, col1, col2);
      }

      counter++;
    }
  }
}

function gradient(x, y, w, h, c1, c2) {
  var ctx = drawingContext; // global canvas context p5.js var
  var grd = ctx.createLinearGradient(x, y, x, y+h);
  grd.addColorStop(0, c1.toString());
  grd.addColorStop(1, c2.toString());
	ctx.fillStyle = grd;
	ctx.fillRect(x, y, w, h);
}

function mouseReleased() {
  actRandomSeed = int(random(100000));
  loop();
}

function keyPressed() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  if (key == 'c' || key == 'C') {
    // -- save an ase file (adobe swatch export) --
    var colors = [];
    for (var i=0; i<hueValues.length; i++) {
      colors.push(color(hueValues[i],saturationValues[i],brightnessValues[i]));
    }
    writeFile([gd.ase.encode(colors)], gd.timestamp(), 'ase');
  }
}