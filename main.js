"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ol_1 = require("ol");
var Tile_1 = __importDefault(require("ol/layer/Tile"));
var OSM_1 = __importDefault(require("ol/source/OSM"));
var map = new ol_1.Map({
    target: 'map',
    layers: [
        new Tile_1.default({
            source: new OSM_1.default()
        })
    ],
    view: new ol_1.View({
        center: [0, 0],
        zoom: 2
    })
});
