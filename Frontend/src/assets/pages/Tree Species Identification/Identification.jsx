import React, { useState } from 'react';

function Identification() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [processedImageUrl, setProcessedImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            alert('Please select a file first!');
            return;
        }
        else{
            setLoading(true)
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
                
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }
            
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setProcessedImageUrl(imageUrl);
            setLoading(false)
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className='px-5 my-5 overflow-auto'>
            <p className='text-3xl mb-2 text-green-700'>Image Upload for identification</p>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit" className='hover:bg-white hover:text-green-700 border-2 border-green-700 bg-green-700 text-white  rounded-lg w-[200px] py-1'>Upload and Process Image</button>
            </form>
            {loading && 
                <div className='bg-green-600 flex flex-row px-2 py-1 rounded w-[300px] mt-4'> 
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className='text-white'>Processing... Please wait.</span>
                </div>
            }
            {processedImageUrl && (
                <div className='mt-4'>
                    <h2>Processed Image:</h2>
                    <img src={processedImageUrl} className='size-8/12' alt="Processed" />
                </div>
            )}
        </div>
    );
}

export default Identification;
