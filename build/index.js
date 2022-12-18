"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const getFileData = (path) => {
    try {
        return fs.readFileSync(path, 'utf8');
    }
    catch (error) {
        if (error instanceof Error)
            console.error(error.stack);
        return String(error);
    }
};
const transformAndRegroupData = (data) => {
    const groupedData = data.match(/[^\r\n]*/g);
    const parsedGroupedData = groupedData.filter((string) => string.trim());
    const rearrangedData = parsedGroupedData
        .filter((countryInfo) => {
        const parsedPopulationAndArea = countryInfo.match(/[0-9,]+/g);
        return parsedPopulationAndArea?.length === 2;
    })
        .map((countryInfo) => {
        const parsedCountryName = countryInfo.replace(/[\d,]+/g, '').trim();
        const parsedPopulationAndArea = countryInfo.match(/[0-9,]+/g);
        const population = Number(parsedPopulationAndArea[0].replaceAll(',', ''));
        const area = Number(parsedPopulationAndArea[1].replaceAll(',', ''));
        return {
            country: parsedCountryName,
            population,
            area,
            density: Number((population / area).toFixed(2)),
        };
    });
    return rearrangedData;
};
const calculatePopulationDensity = (data) => data.sort((a, b) => b.density - a.density);
const saveCountriesDataToCSV = ({ dataToSave, filePath, }) => {
    fs.writeFileSync(filePath, `Country,Density`);
    dataToSave.forEach((country) => fs.appendFileSync(filePath, `\r\n${country.country},${country.density}`));
};
const getPopulationDensity = () => {
    const data = getFileData('./listCountries.txt');
    const parsedData = transformAndRegroupData(data);
    const populationDensity = calculatePopulationDensity(parsedData);
    saveCountriesDataToCSV({
        dataToSave: populationDensity,
        filePath: './countries.csv',
    });
};
getPopulationDensity();
//# sourceMappingURL=index.js.map