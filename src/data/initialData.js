// Initial data for the NE quadrant - used as template for other quadrants
const neData = [
  { id: 'P12E', bank: 1, quadrant: 'NE' }, { id: 'F13E', bank: 1, quadrant: 'NE' }, { id: 'B13E', bank: 1, quadrant: 'NE' },
  { id: 'Q12E', bank: 2, quadrant: 'NE' }, { id: 'M12E', bank: 2, quadrant: 'NE' }, { id: 'C13E', bank: 2, quadrant: 'NE' },
  { id: 'L12E', bank: 3, quadrant: 'NE' }, { id: 'J12E', bank: 3, quadrant: 'NE' }, { id: 'G12E', bank: 3, quadrant: 'NE' }, { id: 'E12E', bank: 3, quadrant: 'NE' }, { id: 'A12E', bank: 3, quadrant: 'NE' }, { id: 'C12E', bank: 3, quadrant: 'NE' },
  { id: 'K12E', bank: 4, quadrant: 'NE' }, { id: 'H12E', bank: 4, quadrant: 'NE' }, { id: 'F12E', bank: 4, quadrant: 'NE' }, { id: 'D12E', bank: 4, quadrant: 'NE' }, { id: 'B12E', bank: 4, quadrant: 'NE' },
  { id: 'K11E', bank: 5, quadrant: 'NE' }, { id: 'H11E', bank: 5, quadrant: 'NE' }, { id: 'F11E', bank: 5, quadrant: 'NE' }, { id: 'D11E', bank: 5, quadrant: 'NE' }, { id: 'B11E', bank: 5, quadrant: 'NE' },
  { id: 'L11E', bank: 6, quadrant: 'NE' }, { id: 'J11E', bank: 6, quadrant: 'NE' }, { id: 'G11E', bank: 6, quadrant: 'NE' }, { id: 'E11E', bank: 6, quadrant: 'NE' }, { id: 'A11E', bank: 6, quadrant: 'NE' }, { id: 'C11E', bank: 6, quadrant: 'NE' },
  { id: 'L10E', bank: 7, quadrant: 'NE' }, { id: 'J10E', bank: 7, quadrant: 'NE' }, { id: 'G10E', bank: 7, quadrant: 'NE' }, { id: 'E10E', bank: 7, quadrant: 'NE' }, { id: 'A10E', bank: 7, quadrant: 'NE' }, { id: 'C10E', bank: 7, quadrant: 'NE' },
  { id: 'K10E', bank: 8, quadrant: 'NE' }, { id: 'H10E', bank: 8, quadrant: 'NE' }, { id: 'F10E', bank: 8, quadrant: 'NE' }, { id: 'D10E', bank: 8, quadrant: 'NE' }, { id: 'B10E', bank: 8, quadrant: 'NE' },
  { id: 'K09E', bank: 9, quadrant: 'NE' }, { id: 'H09E', bank: 9, quadrant: 'NE' }, { id: 'F09E', bank: 9, quadrant: 'NE' }, { id: 'D09E', bank: 9, quadrant: 'NE' }, { id: 'B09E', bank: 9, quadrant: 'NE' },
  { id: 'J09E', bank: 10, quadrant: 'NE' }, { id: 'L09E', bank: 10, quadrant: 'NE' }, { id: 'G09E', bank: 10, quadrant: 'NE' }, { id: 'E09E', bank: 10, quadrant: 'NE' }, { id: 'A09E', bank: 10, quadrant: 'NE' }, { id: 'C09E', bank: 10, quadrant: 'NE' },
  { id: 'L08E', bank: 11, quadrant: 'NE' }, { id: 'J08E', bank: 11, quadrant: 'NE' }, { id: 'G08E', bank: 11, quadrant: 'NE' }, { id: 'E08E', bank: 11, quadrant: 'NE' }, { id: 'A08E', bank: 11, quadrant: 'NE' }, { id: 'C08E', bank: 11, quadrant: 'NE' },
  { id: 'K08E', bank: 12, quadrant: 'NE' }, { id: 'H08E', bank: 12, quadrant: 'NE' }, { id: 'F08E', bank: 12, quadrant: 'NE' }, { id: 'D08E', bank: 12, quadrant: 'NE' }, { id: 'B08E', bank: 12, quadrant: 'NE' },
  { id: 'K07E', bank: 13, quadrant: 'NE' }, { id: 'H07E', bank: 13, quadrant: 'NE' }, { id: 'F07E', bank: 13, quadrant: 'NE' }, { id: 'D07E', bank: 13, quadrant: 'NE' }, { id: 'B07E', bank: 13, quadrant: 'NE' },
  { id: 'L07E', bank: 14, quadrant: 'NE' }, { id: 'J07E', bank: 14, quadrant: 'NE' }, { id: 'G07E', bank: 14, quadrant: 'NE' }, { id: 'E07E', bank: 14, quadrant: 'NE' }, { id: 'C07E', bank: 14, quadrant: 'NE' },
  { id: 'L06E', bank: 15, quadrant: 'NE' }, { id: 'J06E', bank: 15, quadrant: 'NE' }, { id: 'G06E', bank: 15, quadrant: 'NE' }, { id: 'E06E', bank: 15, quadrant: 'NE' }, { id: 'C06E', bank: 15, quadrant: 'NE' },
  { id: 'K06E', bank: 16, quadrant: 'NE' }, { id: 'H06E', bank: 16, quadrant: 'NE' }, { id: 'F06E', bank: 16, quadrant: 'NE' }, { id: 'D06E', bank: 16, quadrant: 'NE' }, { id: 'B06E', bank: 16, quadrant: 'NE' },
  { id: 'K05E', bank: 17, quadrant: 'NE' }, { id: 'H05E', bank: 17, quadrant: 'NE' }, { id: 'F05E', bank: 17, quadrant: 'NE' }, { id: 'D05E', bank: 17, quadrant: 'NE' },
  { id: 'L05E', bank: 18, quadrant: 'NE' }, { id: 'J05E', bank: 18, quadrant: 'NE' }, { id: 'G05E', bank: 18, quadrant: 'NE' }, { id: 'E05E', bank: 18, quadrant: 'NE' }, { id: 'C05E', bank: 18, quadrant: 'NE' },
  { id: 'L04E', bank: 19, quadrant: 'NE' }, { id: 'J04E', bank: 19, quadrant: 'NE' }, { id: 'G04E', bank: 19, quadrant: 'NE' }, { id: 'E04E', bank: 19, quadrant: 'NE' },
  { id: 'K04E', bank: 20, quadrant: 'NE' }, { id: 'H04E', bank: 20, quadrant: 'NE' }, { id: 'F04E', bank: 20, quadrant: 'NE' }, { id: 'D04E', bank: 20, quadrant: 'NE' },
  { id: 'K03E', bank: 21, quadrant: 'NE' }, { id: 'H03E', bank: 21, quadrant: 'NE' }, { id: 'F03E', bank: 21, quadrant: 'NE' },
  { id: 'L03E', bank: 22, quadrant: 'NE' }, { id: 'J03E', bank: 22, quadrant: 'NE' }, { id: 'G03E', bank: 22, quadrant: 'NE' }, { id: 'E03E', bank: 22, quadrant: 'NE' },
  { id: 'K01E', bank: 23, quadrant: 'NE' }, { id: 'L02E', bank: 23, quadrant: 'NE' }, { id: 'J02E', bank: 23, quadrant: 'NE' }, { id: 'G02E', bank: 23, quadrant: 'NE' },
  { id: 'L01E', bank: 24, quadrant: 'NE' }, { id: 'J01E', bank: 24, quadrant: 'NE' }, { id: 'K02E', bank: 24, quadrant: 'NE' }, { id: 'H02E', bank: 24, quadrant: 'NE' }, { id: 'F02E', bank: 24, quadrant: 'NE' },
  { id: 'M11E', bank: 25, quadrant: 'NE' }, { id: 'M09E', bank: 25, quadrant: 'NE' }, { id: 'M07E', bank: 25, quadrant: 'NE' }, { id: 'M05E', bank: 25, quadrant: 'NE' }, { id: 'M01E', bank: 25, quadrant: 'NE' }, { id: 'M03E', bank: 25, quadrant: 'NE' },
  { id: 'M10E', bank: 26, quadrant: 'NE' }, { id: 'M08E', bank: 26, quadrant: 'NE' }, { id: 'M06E', bank: 26, quadrant: 'NE' }, { id: 'M04E', bank: 26, quadrant: 'NE' }, { id: 'M02E', bank: 26, quadrant: 'NE' },
  { id: 'N10E', bank: 27, quadrant: 'NE' }, { id: 'N08E', bank: 27, quadrant: 'NE' }, { id: 'N06E', bank: 27, quadrant: 'NE' }, { id: 'N04E', bank: 27, quadrant: 'NE' }, { id: 'N02E', bank: 27, quadrant: 'NE' },
  { id: 'N09E', bank: 28, quadrant: 'NE' }, { id: 'N11E', bank: 28, quadrant: 'NE' }, { id: 'N07E', bank: 28, quadrant: 'NE' }, { id: 'N05E', bank: 28, quadrant: 'NE' }, { id: 'N01E', bank: 28, quadrant: 'NE' }, { id: 'N03E', bank: 28, quadrant: 'NE' },
  { id: 'O11E', bank: 29, quadrant: 'NE' }, { id: 'O09E', bank: 29, quadrant: 'NE' }, { id: 'O07E', bank: 29, quadrant: 'NE' }, { id: 'O05E', bank: 29, quadrant: 'NE' }, { id: 'O01E', bank: 29, quadrant: 'NE' }, { id: 'O03E', bank: 29, quadrant: 'NE' },
  { id: 'O10E', bank: 30, quadrant: 'NE' }, { id: 'O08E', bank: 30, quadrant: 'NE' }, { id: 'O06E', bank: 30, quadrant: 'NE' }, { id: 'O04E', bank: 30, quadrant: 'NE' }, { id: 'O02E', bank: 30, quadrant: 'NE' },
  { id: 'P10E', bank: 31, quadrant: 'NE' }, { id: 'P08E', bank: 31, quadrant: 'NE' }, { id: 'P06E', bank: 31, quadrant: 'NE' }, { id: 'P04E', bank: 31, quadrant: 'NE' }, { id: 'P02E', bank: 31, quadrant: 'NE' },
  { id: 'P09E', bank: 32, quadrant: 'NE' }, { id: 'P11E', bank: 32, quadrant: 'NE' }, { id: 'P07E', bank: 32, quadrant: 'NE' }, { id: 'P05E', bank: 32, quadrant: 'NE' }, { id: 'P01E', bank: 32, quadrant: 'NE' }, { id: 'P03E', bank: 32, quadrant: 'NE' },
  { id: 'Q11E', bank: 33, quadrant: 'NE' }, { id: 'Q09E', bank: 33, quadrant: 'NE' }, { id: 'Q07E', bank: 33, quadrant: 'NE' }, { id: 'Q05E', bank: 33, quadrant: 'NE' }, { id: 'Q01E', bank: 33, quadrant: 'NE' }, { id: 'Q03E', bank: 33, quadrant: 'NE' },
  { id: 'Q10E', bank: 34, quadrant: 'NE' }, { id: 'Q08E', bank: 34, quadrant: 'NE' }, { id: 'Q06E', bank: 34, quadrant: 'NE' }, { id: 'Q04E', bank: 34, quadrant: 'NE' }, { id: 'Q02E', bank: 34, quadrant: 'NE' },
  { id: 'R10E', bank: 35, quadrant: 'NE' }, { id: 'R12E', bank: 35, quadrant: 'NE' }, { id: 'R08E', bank: 35, quadrant: 'NE' }, { id: 'R06E', bank: 35, quadrant: 'NE' }, { id: 'R04E', bank: 35, quadrant: 'NE' }, { id: 'R02E', bank: 35, quadrant: 'NE' },
  { id: 'R11E', bank: 36, quadrant: 'NE' }, { id: 'R09E', bank: 36, quadrant: 'NE' }, { id: 'R07E', bank: 36, quadrant: 'NE' }, { id: 'R03E', bank: 36, quadrant: 'NE' }, { id: 'R05E', bank: 36, quadrant: 'NE' },
  { id: 'S11E', bank: 37, quadrant: 'NE' }, { id: 'S09E', bank: 37, quadrant: 'NE' }, { id: 'S07E', bank: 37, quadrant: 'NE' }, { id: 'S05E', bank: 37, quadrant: 'NE' }, { id: 'S03E', bank: 37, quadrant: 'NE' },
  { id: 'S12E', bank: 38, quadrant: 'NE' }, { id: 'S10E', bank: 38, quadrant: 'NE' }, { id: 'S08E', bank: 38, quadrant: 'NE' }, { id: 'S06E', bank: 38, quadrant: 'NE' }, { id: 'S02E', bank: 38, quadrant: 'NE' }, { id: 'S04E', bank: 38, quadrant: 'NE' },
  { id: 'T12E', bank: 39, quadrant: 'NE' }, { id: 'T10E', bank: 39, quadrant: 'NE' }, { id: 'T08E', bank: 39, quadrant: 'NE' }, { id: 'T06E', bank: 39, quadrant: 'NE' }, { id: 'T02E', bank: 39, quadrant: 'NE' }, { id: 'T04E', bank: 39, quadrant: 'NE' },
  { id: 'T11E', bank: 40, quadrant: 'NE' }, { id: 'T09E', bank: 40, quadrant: 'NE' }, { id: 'T07E', bank: 40, quadrant: 'NE' }, { id: 'T05E', bank: 40, quadrant: 'NE' }, { id: 'T03E', bank: 40, quadrant: 'NE' },
  { id: 'U11E', bank: 41, quadrant: 'NE' }, { id: 'U09E', bank: 41, quadrant: 'NE' }, { id: 'U07E', bank: 41, quadrant: 'NE' }, { id: 'U05E', bank: 41, quadrant: 'NE' }, { id: 'U03E', bank: 41, quadrant: 'NE' },
  { id: 'U12E', bank: 42, quadrant: 'NE' }, { id: 'U10E', bank: 42, quadrant: 'NE' }, { id: 'U08E', bank: 42, quadrant: 'NE' }, { id: 'U06E', bank: 42, quadrant: 'NE' }, { id: 'U04E', bank: 42, quadrant: 'NE' },
  { id: 'V12E', bank: 43, quadrant: 'NE' }, { id: 'V10E', bank: 43, quadrant: 'NE' }, { id: 'V08E', bank: 43, quadrant: 'NE' }, { id: 'V06E', bank: 43, quadrant: 'NE' }, { id: 'V04E', bank: 43, quadrant: 'NE' },
  { id: 'V11E', bank: 44, quadrant: 'NE' }, { id: 'V09E', bank: 44, quadrant: 'NE' }, { id: 'V07E', bank: 44, quadrant: 'NE' }, { id: 'V05E', bank: 44, quadrant: 'NE' },
  { id: 'W09E', bank: 45, quadrant: 'NE' }, { id: 'W11E', bank: 45, quadrant: 'NE' }, { id: 'W07E', bank: 45, quadrant: 'NE' }, { id: 'W05E', bank: 45, quadrant: 'NE' }, { id: 'X06E', bank: 45, quadrant: 'NE' },
  { id: 'W12E', bank: 46, quadrant: 'NE' }, { id: 'W10E', bank: 46, quadrant: 'NE' }, { id: 'W08E', bank: 46, quadrant: 'NE' }, { id: 'W06E', bank: 46, quadrant: 'NE' }, { id: 'X07E', bank: 46, quadrant: 'NE' },
  { id: 'Y09E', bank: 47, quadrant: 'NE' }, { id: 'Y11E', bank: 47, quadrant: 'NE' }, { id: 'X08E', bank: 47, quadrant: 'NE' }, { id: 'X12E', bank: 47, quadrant: 'NE' }, { id: 'X10E', bank: 47, quadrant: 'NE' },
  { id: 'Y08E', bank: 48, quadrant: 'NE' }, { id: 'Y10E', bank: 48, quadrant: 'NE' }, { id: 'Y12E', bank: 48, quadrant: 'NE' }, { id: 'X09E', bank: 48, quadrant: 'NE' }, { id: 'X11E', bank: 48, quadrant: 'NE' },
];

// Create data for other quadrants by transforming the NE data
const createQuadrantData = (quadrant, suffix) => {
  return neData.map(cell => ({
    ...cell,
    id: cell.id.replace('E', suffix),
    quadrant: quadrant,
  }));
};

// Combined initial cells data for all quadrants
export const initialCellsData = [
  ...neData,
  ...createQuadrantData('NW', 'W'),
  ...createQuadrantData('SE', 'S'),
  ...createQuadrantData('SW', 'X')
];

// Initial borescope inspection items
export const initialBorescopeData = [
  { id: '3E HD 2', quadrant: 'NE' }, { id: '3E HD 4', quadrant: 'NE' }, { id: '3E HD 6', quadrant: 'NE' },
  { id: '4E HD 2', quadrant: 'NE' }, { id: '4E HD 4', quadrant: 'NE' }, { id: '4E HD 6', quadrant: 'NE' },
  { id: '1W FR 10', quadrant: 'NW' }, { id: '1W FR 12', quadrant: 'NW' }, { id: '1W FR 14', quadrant: 'NW' },
  { id: '2W FR 21', quadrant: 'NW' }, { id: '2W FR 23', quadrant: 'NW' }, { id: '2W FR 25', quadrant: 'NW' },
  { id: '5S FR 30', quadrant: 'SE' }, { id: '5S FR 32', quadrant: 'SE' }, { id: '5S FR 34', quadrant: 'SE' },
  { id: '6S FR 41', quadrant: 'SE' }, { id: '6S FR 43', quadrant: 'SE' }, { id: '6S FR 45', quadrant: 'SE' },
  { id: '7X FR 50', quadrant: 'SW' }, { id: '7X FR 52', quadrant: 'SW' }, { id: '7X FR 54', quadrant: 'SW' },
  { id: '8X FR 61', quadrant: 'SW' }, { id: '8X FR 63', quadrant: 'SW' }, { id: '8X FR 65', quadrant: 'SW' },
];

// Export neData for use in sorting logic
export { neData };
