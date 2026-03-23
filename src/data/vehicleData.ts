export interface VehicleModel {
  name: string;
  startYear: number;
  endYear: number | null; // null = still in production
}

export interface VehicleMake {
  name: string;
  models: VehicleModel[];
}

const currentYear = new Date().getFullYear() + 1; // include next model year

export const vehicleData: VehicleMake[] = [
  {
    name: "Acura",
    models: [
      { name: "ILX", startYear: 2013, endYear: 2022 },
      { name: "Integra", startYear: 2023, endYear: null },
      { name: "MDX", startYear: 2001, endYear: null },
      { name: "RDX", startYear: 2007, endYear: null },
      { name: "TLX", startYear: 2015, endYear: null },
      { name: "NSX", startYear: 2017, endYear: 2022 },
    ],
  },
  {
    name: "Audi",
    models: [
      { name: "A3", startYear: 2006, endYear: null },
      { name: "A4", startYear: 1996, endYear: null },
      { name: "A5", startYear: 2008, endYear: null },
      { name: "A6", startYear: 1995, endYear: null },
      { name: "A7", startYear: 2012, endYear: null },
      { name: "A8", startYear: 1997, endYear: null },
      { name: "Q3", startYear: 2015, endYear: null },
      { name: "Q5", startYear: 2009, endYear: null },
      { name: "Q7", startYear: 2007, endYear: null },
      { name: "Q8", startYear: 2019, endYear: null },
      { name: "e-tron", startYear: 2019, endYear: null },
      { name: "RS5", startYear: 2018, endYear: null },
      { name: "RS7", startYear: 2021, endYear: null },
      { name: "TT", startYear: 2000, endYear: 2023 },
    ],
  },
  {
    name: "BMW",
    models: [
      { name: "2 Series", startYear: 2014, endYear: null },
      { name: "3 Series", startYear: 1977, endYear: null },
      { name: "4 Series", startYear: 2014, endYear: null },
      { name: "5 Series", startYear: 1975, endYear: null },
      { name: "7 Series", startYear: 1977, endYear: null },
      { name: "8 Series", startYear: 2019, endYear: null },
      { name: "X1", startYear: 2013, endYear: null },
      { name: "X3", startYear: 2004, endYear: null },
      { name: "X5", startYear: 2000, endYear: null },
      { name: "X7", startYear: 2019, endYear: null },
      { name: "iX", startYear: 2022, endYear: null },
      { name: "i4", startYear: 2022, endYear: null },
      { name: "M3", startYear: 1994, endYear: null },
      { name: "M4", startYear: 2015, endYear: null },
      { name: "M5", startYear: 2005, endYear: null },
      { name: "Z4", startYear: 2003, endYear: null },
    ],
  },
  {
    name: "Buick",
    models: [
      { name: "Enclave", startYear: 2008, endYear: null },
      { name: "Encore", startYear: 2013, endYear: null },
      { name: "Encore GX", startYear: 2020, endYear: null },
      { name: "Envista", startYear: 2024, endYear: null },
    ],
  },
  {
    name: "Cadillac",
    models: [
      { name: "CT4", startYear: 2020, endYear: null },
      { name: "CT5", startYear: 2020, endYear: null },
      { name: "Escalade", startYear: 1999, endYear: null },
      { name: "XT4", startYear: 2019, endYear: null },
      { name: "XT5", startYear: 2017, endYear: null },
      { name: "XT6", startYear: 2020, endYear: null },
      { name: "LYRIQ", startYear: 2023, endYear: null },
      { name: "CTS", startYear: 2003, endYear: 2019 },
    ],
  },
  {
    name: "Chevrolet",
    models: [
      { name: "Blazer", startYear: 2019, endYear: null },
      { name: "Camaro", startYear: 2010, endYear: 2024 },
      { name: "Colorado", startYear: 2004, endYear: null },
      { name: "Corvette", startYear: 1953, endYear: null },
      { name: "Equinox", startYear: 2005, endYear: null },
      { name: "Impala", startYear: 2000, endYear: 2020 },
      { name: "Malibu", startYear: 1997, endYear: 2024 },
      { name: "Silverado 1500", startYear: 1999, endYear: null },
      { name: "Silverado 2500HD", startYear: 2001, endYear: null },
      { name: "Suburban", startYear: 2000, endYear: null },
      { name: "Tahoe", startYear: 1995, endYear: null },
      { name: "Trailblazer", startYear: 2021, endYear: null },
      { name: "Traverse", startYear: 2009, endYear: null },
      { name: "Trax", startYear: 2015, endYear: null },
      { name: "Bolt EV", startYear: 2017, endYear: 2023 },
      { name: "Bolt EUV", startYear: 2022, endYear: 2023 },
    ],
  },
  {
    name: "Chrysler",
    models: [
      { name: "300", startYear: 2005, endYear: 2023 },
      { name: "Pacifica", startYear: 2017, endYear: null },
    ],
  },
  {
    name: "Dodge",
    models: [
      { name: "Challenger", startYear: 2008, endYear: 2023 },
      { name: "Charger", startYear: 2006, endYear: null },
      { name: "Durango", startYear: 1998, endYear: null },
      { name: "Hornet", startYear: 2023, endYear: null },
    ],
  },
  {
    name: "Ford",
    models: [
      { name: "Bronco", startYear: 2021, endYear: null },
      { name: "Bronco Sport", startYear: 2021, endYear: null },
      { name: "Edge", startYear: 2007, endYear: 2024 },
      { name: "Escape", startYear: 2001, endYear: null },
      { name: "Expedition", startYear: 1997, endYear: null },
      { name: "Explorer", startYear: 1991, endYear: null },
      { name: "F-150", startYear: 1975, endYear: null },
      { name: "F-150 Lightning", startYear: 2022, endYear: null },
      { name: "F-250 Super Duty", startYear: 1999, endYear: null },
      { name: "Fusion", startYear: 2006, endYear: 2020 },
      { name: "Maverick", startYear: 2022, endYear: null },
      { name: "Mustang", startYear: 1964, endYear: null },
      { name: "Mustang Mach-E", startYear: 2021, endYear: null },
      { name: "Ranger", startYear: 1998, endYear: null },
      { name: "Transit", startYear: 2015, endYear: null },
    ],
  },
  {
    name: "Genesis",
    models: [
      { name: "G70", startYear: 2019, endYear: null },
      { name: "G80", startYear: 2017, endYear: null },
      { name: "G90", startYear: 2017, endYear: null },
      { name: "GV70", startYear: 2022, endYear: null },
      { name: "GV80", startYear: 2021, endYear: null },
    ],
  },
  {
    name: "GMC",
    models: [
      { name: "Acadia", startYear: 2007, endYear: null },
      { name: "Canyon", startYear: 2004, endYear: null },
      { name: "Sierra 1500", startYear: 1999, endYear: null },
      { name: "Sierra 2500HD", startYear: 2001, endYear: null },
      { name: "Terrain", startYear: 2010, endYear: null },
      { name: "Yukon", startYear: 1995, endYear: null },
      { name: "Hummer EV", startYear: 2022, endYear: null },
    ],
  },
  {
    name: "Honda",
    models: [
      { name: "Accord", startYear: 1976, endYear: null },
      { name: "Civic", startYear: 1973, endYear: null },
      { name: "CR-V", startYear: 1997, endYear: null },
      { name: "Fit", startYear: 2007, endYear: 2020 },
      { name: "HR-V", startYear: 2016, endYear: null },
      { name: "Insight", startYear: 2019, endYear: 2022 },
      { name: "Odyssey", startYear: 1995, endYear: null },
      { name: "Passport", startYear: 2019, endYear: null },
      { name: "Pilot", startYear: 2003, endYear: null },
      { name: "Ridgeline", startYear: 2006, endYear: null },
      { name: "Prologue", startYear: 2024, endYear: null },
    ],
  },
  {
    name: "Hyundai",
    models: [
      { name: "Accent", startYear: 2000, endYear: 2022 },
      { name: "Elantra", startYear: 2001, endYear: null },
      { name: "IONIQ 5", startYear: 2022, endYear: null },
      { name: "IONIQ 6", startYear: 2023, endYear: null },
      { name: "Kona", startYear: 2018, endYear: null },
      { name: "Palisade", startYear: 2020, endYear: null },
      { name: "Santa Cruz", startYear: 2022, endYear: null },
      { name: "Santa Fe", startYear: 2001, endYear: null },
      { name: "Sonata", startYear: 1999, endYear: null },
      { name: "Tucson", startYear: 2005, endYear: null },
      { name: "Veloster", startYear: 2012, endYear: 2021 },
      { name: "Venue", startYear: 2020, endYear: null },
    ],
  },
  {
    name: "Infiniti",
    models: [
      { name: "Q50", startYear: 2014, endYear: null },
      { name: "Q60", startYear: 2017, endYear: null },
      { name: "QX50", startYear: 2019, endYear: null },
      { name: "QX55", startYear: 2022, endYear: null },
      { name: "QX60", startYear: 2013, endYear: null },
      { name: "QX80", startYear: 2011, endYear: null },
    ],
  },
  {
    name: "Jeep",
    models: [
      { name: "Cherokee", startYear: 2014, endYear: 2023 },
      { name: "Compass", startYear: 2007, endYear: null },
      { name: "Gladiator", startYear: 2020, endYear: null },
      { name: "Grand Cherokee", startYear: 1993, endYear: null },
      { name: "Grand Cherokee L", startYear: 2021, endYear: null },
      { name: "Renegade", startYear: 2015, endYear: null },
      { name: "Wagoneer", startYear: 2022, endYear: null },
      { name: "Wrangler", startYear: 1987, endYear: null },
    ],
  },
  {
    name: "Kia",
    models: [
      { name: "Carnival", startYear: 2022, endYear: null },
      { name: "EV6", startYear: 2022, endYear: null },
      { name: "EV9", startYear: 2024, endYear: null },
      { name: "Forte", startYear: 2010, endYear: null },
      { name: "K5", startYear: 2021, endYear: null },
      { name: "Niro", startYear: 2017, endYear: null },
      { name: "Seltos", startYear: 2021, endYear: null },
      { name: "Sorento", startYear: 2003, endYear: null },
      { name: "Soul", startYear: 2010, endYear: null },
      { name: "Sportage", startYear: 2005, endYear: null },
      { name: "Stinger", startYear: 2018, endYear: 2023 },
      { name: "Telluride", startYear: 2020, endYear: null },
    ],
  },
  {
    name: "Land Rover",
    models: [
      { name: "Defender", startYear: 2020, endYear: null },
      { name: "Discovery", startYear: 2017, endYear: null },
      { name: "Discovery Sport", startYear: 2015, endYear: null },
      { name: "Range Rover", startYear: 2003, endYear: null },
      { name: "Range Rover Evoque", startYear: 2012, endYear: null },
      { name: "Range Rover Sport", startYear: 2006, endYear: null },
      { name: "Range Rover Velar", startYear: 2018, endYear: null },
    ],
  },
  {
    name: "Lexus",
    models: [
      { name: "ES", startYear: 2007, endYear: null },
      { name: "GX", startYear: 2003, endYear: null },
      { name: "IS", startYear: 2001, endYear: null },
      { name: "LC", startYear: 2018, endYear: null },
      { name: "LX", startYear: 2008, endYear: null },
      { name: "NX", startYear: 2015, endYear: null },
      { name: "RC", startYear: 2015, endYear: null },
      { name: "RX", startYear: 2004, endYear: null },
      { name: "RZ", startYear: 2023, endYear: null },
      { name: "TX", startYear: 2024, endYear: null },
      { name: "UX", startYear: 2019, endYear: null },
    ],
  },
  {
    name: "Lincoln",
    models: [
      { name: "Aviator", startYear: 2020, endYear: null },
      { name: "Corsair", startYear: 2020, endYear: null },
      { name: "Nautilus", startYear: 2019, endYear: null },
      { name: "Navigator", startYear: 1998, endYear: null },
    ],
  },
  {
    name: "Mazda",
    models: [
      { name: "CX-30", startYear: 2020, endYear: null },
      { name: "CX-5", startYear: 2013, endYear: null },
      { name: "CX-50", startYear: 2023, endYear: null },
      { name: "CX-70", startYear: 2025, endYear: null },
      { name: "CX-90", startYear: 2024, endYear: null },
      { name: "Mazda3", startYear: 2004, endYear: null },
      { name: "MX-5 Miata", startYear: 1990, endYear: null },
      { name: "CX-9", startYear: 2007, endYear: 2023 },
    ],
  },
  {
    name: "Mercedes-Benz",
    models: [
      { name: "A-Class", startYear: 2019, endYear: 2022 },
      { name: "C-Class", startYear: 1994, endYear: null },
      { name: "CLA", startYear: 2014, endYear: null },
      { name: "E-Class", startYear: 1994, endYear: null },
      { name: "GLA", startYear: 2015, endYear: null },
      { name: "GLB", startYear: 2020, endYear: null },
      { name: "GLC", startYear: 2016, endYear: null },
      { name: "GLE", startYear: 2016, endYear: null },
      { name: "GLS", startYear: 2017, endYear: null },
      { name: "S-Class", startYear: 1994, endYear: null },
      { name: "EQB", startYear: 2022, endYear: null },
      { name: "EQE", startYear: 2023, endYear: null },
      { name: "EQS", startYear: 2022, endYear: null },
      { name: "AMG GT", startYear: 2016, endYear: null },
    ],
  },
  {
    name: "MINI",
    models: [
      { name: "Cooper", startYear: 2002, endYear: null },
      { name: "Countryman", startYear: 2011, endYear: null },
      { name: "Clubman", startYear: 2008, endYear: 2024 },
    ],
  },
  {
    name: "Mitsubishi",
    models: [
      { name: "Eclipse Cross", startYear: 2018, endYear: null },
      { name: "Mirage", startYear: 2014, endYear: null },
      { name: "Outlander", startYear: 2003, endYear: null },
      { name: "Outlander Sport", startYear: 2011, endYear: null },
    ],
  },
  {
    name: "Nissan",
    models: [
      { name: "Altima", startYear: 2002, endYear: null },
      { name: "Armada", startYear: 2004, endYear: null },
      { name: "Frontier", startYear: 2000, endYear: null },
      { name: "Kicks", startYear: 2018, endYear: null },
      { name: "LEAF", startYear: 2011, endYear: 2024 },
      { name: "Maxima", startYear: 2000, endYear: 2023 },
      { name: "Murano", startYear: 2003, endYear: null },
      { name: "Pathfinder", startYear: 2001, endYear: null },
      { name: "Rogue", startYear: 2008, endYear: null },
      { name: "Sentra", startYear: 2000, endYear: null },
      { name: "Titan", startYear: 2004, endYear: null },
      { name: "Versa", startYear: 2007, endYear: null },
      { name: "Z", startYear: 2023, endYear: null },
      { name: "Ariya", startYear: 2023, endYear: null },
    ],
  },
  {
    name: "Porsche",
    models: [
      { name: "911", startYear: 1999, endYear: null },
      { name: "718 Boxster", startYear: 2017, endYear: null },
      { name: "718 Cayman", startYear: 2017, endYear: null },
      { name: "Cayenne", startYear: 2003, endYear: null },
      { name: "Macan", startYear: 2015, endYear: null },
      { name: "Panamera", startYear: 2010, endYear: null },
      { name: "Taycan", startYear: 2020, endYear: null },
    ],
  },
  {
    name: "RAM",
    models: [
      { name: "1500", startYear: 2011, endYear: null },
      { name: "2500", startYear: 2011, endYear: null },
      { name: "3500", startYear: 2011, endYear: null },
      { name: "ProMaster", startYear: 2014, endYear: null },
    ],
  },
  {
    name: "Subaru",
    models: [
      { name: "Ascent", startYear: 2019, endYear: null },
      { name: "BRZ", startYear: 2013, endYear: null },
      { name: "Crosstrek", startYear: 2013, endYear: null },
      { name: "Forester", startYear: 1998, endYear: null },
      { name: "Impreza", startYear: 1993, endYear: null },
      { name: "Legacy", startYear: 1995, endYear: 2024 },
      { name: "Outback", startYear: 2000, endYear: null },
      { name: "Solterra", startYear: 2023, endYear: null },
      { name: "WRX", startYear: 2002, endYear: null },
    ],
  },
  {
    name: "Tesla",
    models: [
      { name: "Model 3", startYear: 2017, endYear: null },
      { name: "Model S", startYear: 2012, endYear: null },
      { name: "Model X", startYear: 2016, endYear: null },
      { name: "Model Y", startYear: 2020, endYear: null },
      { name: "Cybertruck", startYear: 2024, endYear: null },
    ],
  },
  {
    name: "Toyota",
    models: [
      { name: "4Runner", startYear: 1996, endYear: null },
      { name: "86", startYear: 2017, endYear: 2020 },
      { name: "Avalon", startYear: 2000, endYear: 2022 },
      { name: "Camry", startYear: 1992, endYear: null },
      { name: "Corolla", startYear: 1993, endYear: null },
      { name: "Corolla Cross", startYear: 2022, endYear: null },
      { name: "GR86", startYear: 2022, endYear: null },
      { name: "GR Supra", startYear: 2020, endYear: null },
      { name: "Grand Highlander", startYear: 2024, endYear: null },
      { name: "Highlander", startYear: 2001, endYear: null },
      { name: "Land Cruiser", startYear: 2008, endYear: null },
      { name: "Prius", startYear: 2001, endYear: null },
      { name: "RAV4", startYear: 1996, endYear: null },
      { name: "Sequoia", startYear: 2001, endYear: null },
      { name: "Sienna", startYear: 1998, endYear: null },
      { name: "Tacoma", startYear: 1995, endYear: null },
      { name: "Tundra", startYear: 2000, endYear: null },
      { name: "Venza", startYear: 2021, endYear: null },
      { name: "bZ4X", startYear: 2023, endYear: null },
      { name: "Crown", startYear: 2023, endYear: null },
    ],
  },
  {
    name: "Volkswagen",
    models: [
      { name: "Atlas", startYear: 2018, endYear: null },
      { name: "Atlas Cross Sport", startYear: 2020, endYear: null },
      { name: "Golf GTI", startYear: 2006, endYear: null },
      { name: "Golf R", startYear: 2015, endYear: null },
      { name: "ID.4", startYear: 2021, endYear: null },
      { name: "Jetta", startYear: 1999, endYear: null },
      { name: "Taos", startYear: 2022, endYear: null },
      { name: "Tiguan", startYear: 2009, endYear: null },
      { name: "Passat", startYear: 1998, endYear: 2022 },
    ],
  },
  {
    name: "Volvo",
    models: [
      { name: "S60", startYear: 2011, endYear: null },
      { name: "S90", startYear: 2017, endYear: null },
      { name: "V60", startYear: 2019, endYear: null },
      { name: "XC40", startYear: 2019, endYear: null },
      { name: "XC60", startYear: 2010, endYear: null },
      { name: "XC90", startYear: 2003, endYear: null },
      { name: "C40 Recharge", startYear: 2022, endYear: null },
      { name: "EX30", startYear: 2024, endYear: null },
      { name: "EX90", startYear: 2024, endYear: null },
    ],
  },
].sort((a, b) => a.name.localeCompare(b.name));

export function getMakes(): string[] {
  return vehicleData.map((m) => m.name);
}

export function getModels(make: string): VehicleModel[] {
  const found = vehicleData.find((m) => m.name === make);
  return found ? found.models.sort((a, b) => a.name.localeCompare(b.name)) : [];
}

export function getYears(make: string, model: string): number[] {
  const models = getModels(make);
  const found = models.find((m) => m.name === model);
  if (!found) return [];
  const end = found.endYear ?? currentYear;
  const start = Math.max(found.startYear, 1990); // limit to 1990+
  const years: number[] = [];
  for (let y = end; y >= start; y--) {
    years.push(y);
  }
  return years;
}
