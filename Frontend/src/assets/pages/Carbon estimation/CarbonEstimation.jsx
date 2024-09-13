import React, { useState } from 'react';
import img1 from '../../images/columnsDataset.png'
function CarbonEstimation() {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDiv, setShowdiv] = useState(true)
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!file) {
      setError('Please select a file first!');
      return;
    } else {
      setLoading(true);
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/carbonEstimation', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process file');
      }

      const responseData = await response.json();

      // Set the download URL for the processed file
      const downloadUrl = `http://127.0.0.1:5000${responseData.file_url}`;
      setDownloadUrl(downloadUrl);

      // Set the summary data
      setSummary(responseData.summary);

      setError(null);
      setLoading(false);
      setShowdiv(false)
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className='overflow-y-auto pb-[50px]'>
      <div className='px-5 my-7'>
        <span className='text-3xl font-bold'>How to use the program</span>
        <div>
          <br />
          <p className='underline underline-offset-2 font-semibold'>1-Columns title</p>
          <p>The program requires 3 columns which are <b className='font-semibold'>Species</b>, <b className='font-semibold'>DBH</b> and <b className='font-semibold'>Height</b>.</p>
          <p>Make sure these columns are titled like that </p>
          <p className='text-red-500'>Having some extra columns will not affect the program</p>
          <br />
          <img src={img1} alt="" />
        </div>
        <div>
          <br />
          <p className='underline underline-offset-2 font-semibold'>2-Metrics</p>
          <p>The Height should be in <b className='font-semibold'>meters (m)</b> and the DBH in <b className='font-semibold'>milimeters (mm)</b></p>
          <p>This is important since the program uses some allometric equations that requires the DBh to be in mm </p>
        </div>
        <div>
          <br />
          <p className='underline underline-offset-2 font-semibold'>3-Result</p>
          <p>After choosing the file and uploading it to be processed, a download button will appear containing all the new calculations that was made</p>
          <p>This is important since the program uses some allometric equations that requires the DBh to be in mm </p>
        </div>
      </div>
      <div className="w-full pl-5 border-green-700 border-t-4 pt-4">
        <p className='text-3xl text-green-700 mb-3'>Carbon sequestered estimation</p>
        <div className={showDiv ?"block" :"hidden"  }>
          <span>Upload Excel File for Processing</span>
          <form onSubmit={handleSubmit} className='flex flex-col'>
            <input type="file" onChange={handleFileChange} className='bg-white mt-3'/>
            <button className='hover:bg-white hover:text-green-700 border-2 border-green-700 bg-green-700 text-white my-4 rounded-lg w-[200px] py-1' type="submit">Upload and Process</button>
          </form>
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading && 
          <div className='bg-green-600 flex flex-row px-2 py-1 rounded w-[300px]'> 
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className='text-white'>Processing... Please wait.</span>
          </div>
        }

        

        {summary && (
          <div className="my-4">
            <h3>Summary Data:</h3>
            <table className="table-auto border-collapse border border-green-800">
              <thead>
                <tr>
                  <th className="border border-green-600 px-4 py-2">AGB (kg)</th>
                  <th className="border border-green-600 px-4 py-2">Total Biomass (kg)</th>
                  <th className="border border-green-600 px-4 py-2">Total Dry Weight(kg)</th>
                  <th className="border border-green-600 px-4 py-2">Total Carbon (kg)</th>
                  <th className="border border-green-600 px-4 py-2">C02 Weight (kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-green-600 px-4 py-2">{summary['AGB']}</td>
                  <td className="border border-green-600 px-4 py-2">{summary['Total biomass']}</td>
                  <td className="border border-green-600 px-4 py-2">{summary['Total dry weight']}</td>
                  <td className="border border-green-600 px-4 py-2">{summary['Total Carbon']}</td>
                  <td className="border border-green-600 px-4 py-2">{summary['C02 weight']}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {downloadUrl && (
          <a href={downloadUrl} download="processed_file.xlsx" className='bg-green-700 text-white px-2 py-1 rounded '>
            Download Processed File
          </a>
        )}
      </div>
    </div>
    
  );
}

export default CarbonEstimation;
