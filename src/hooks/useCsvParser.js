import { useCallback } from 'react';

const useCsvParser = () => {
  const parseCSV = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const rows = text.split(/\r\n|\n/).filter(row => row.trim() !== '');
          if (rows.length < 2) {
            reject(new Error("CSV file must contain a header row and at least one data row."));
            return;
          }
          const header = rows[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
          const data = rows.slice(1).map(row => {
            // Basic CSV parsing, doesn't handle commas within quoted fields
            const values = row.split(','); 
            return header.reduce((obj, nextKey, index) => {
              obj[nextKey] = values[index] ? values[index].trim() : '';
              return obj;
            }, {});
          });
          resolve(data);
        } catch (e) {
          reject(new Error(`Error parsing CSV content: ${e.message}`));
        }
      };
      reader.onerror = (error) => reject(new Error(`FileReader error: ${error.message}`));
      reader.readAsText(file);
    });
  }, []);

  return { parseCSV };
};

export default useCsvParser;