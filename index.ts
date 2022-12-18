import * as fs from 'fs';

interface IPopulationArePerCountry {
  country: string;
  population: number;
  area: number;
  density: number;
}

const getFileData = (path: string): string => {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.stack);
    return String(error);
  }
};

const transformAndRegroupData = (data: string): IPopulationArePerCountry[] => {
  const groupedData = data.match(/[^\r\n]*/g);
  const parsedGroupedData = groupedData!.filter((string) => string.trim());
  const rearrangedData = parsedGroupedData
    .filter((countryInfo) => {
      const parsedPopulationAndArea = countryInfo.match(/[0-9,]+/g);
      return parsedPopulationAndArea?.length === 2;
    })
    .map((countryInfo) => {
      const parsedCountryName = countryInfo.replace(/[\d,]+/g, '').trim();
      const parsedPopulationAndArea = countryInfo.match(/[0-9,]+/g);
      const population = Number(
        parsedPopulationAndArea![0].replaceAll(',', '')
      );
      const area = Number(parsedPopulationAndArea![1].replaceAll(',', ''));
      return {
        country: parsedCountryName,
        population,
        area,
        density: Number((population / area).toFixed(2)),
      };
    });

  return rearrangedData;
};

const calculatePopulationDensity = (data: IPopulationArePerCountry[]) =>
  data.sort((a, b) => b.density - a.density);

const saveCountriesDataToCSV = ({
  dataToSave,
  filePath,
}: {
  dataToSave: IPopulationArePerCountry[];
  filePath: string;
}): void => {
  fs.writeFileSync(filePath, `Country,Density`);
  dataToSave.forEach((country) =>
    fs.appendFileSync(filePath, `\r\n${country.country},${country.density}`)
  );
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
