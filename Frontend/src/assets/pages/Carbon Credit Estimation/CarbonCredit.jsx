import React, { useState } from 'react';

function CarbonCredit() {
    const [formData, setFormData] = useState({
        base_credits: '',
        rarity: 'high',
        biodiversity: 'high',
        location: 'rainforest',
        endangered_species: 'critically_endangered',
    });
    const [totalCredits, setTotalCredits] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/calculateCarbonCredits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setTotalCredits(data.total_credits);
        } catch (error) {
            console.error('Error calculating carbon credits:', error);
        }
    };

    return (
        <div>
            <form className='w-full pl-5' onSubmit={handleSubmit}>
                {/* Form Fields */}
                <div className='flex flex-col mt-5'>
                    <span className='font-semibold'>Carbon Sequestered</span>
                    <input
                        className='border-slate-700 border-2 py-1 px-2'
                        type="number"
                        required
                        name='base_credits'
                        placeholder='Enter value'
                        value={formData.base_credits}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex flex-col mt-5'>
                    <span className='font-semibold'>Rarity of Tree Species</span>
                    <select
                        className='border-slate-700 border-2 py-1'
                        name="rarity"
                        value={formData.rarity}
                        onChange={handleChange}
                    >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <div className='flex flex-col mt-5'>
                    <span className='font-semibold'>Biodiversity</span>
                    <select
                        className='border-slate-700 border-2 py-1'
                        name="biodiversity"
                        value={formData.biodiversity}
                        onChange={handleChange}
                    >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <div className='flex flex-col mt-5'>
                    <span className='font-semibold'>Location</span>
                    <select
                        className='border-slate-700 border-2 py-1'
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    >
                        <option value="rainforest">Rainforest</option>
                        <option value="savanna">Savanna</option>
                        <option value="desert">Desert</option>
                        <option value="urban">Urban</option>
                    </select>
                </div>
                <div className='flex flex-col mt-5'>
                    <span className='font-semibold'>Presence of Endangered Species</span>
                    <select
                        className='border-slate-700 border-2 py-1'
                        name="endangered_species"
                        value={formData.endangered_species}
                        onChange={handleChange}
                    >
                        <option value="critically_endangered">Critically Endangered</option>
                        <option value="endangered">Endangered</option>
                        <option value="vulnerable">Vulnerable</option>
                        <option value="none">None</option>
                    </select>
                </div>
                <button className='px-2 py-1 mt-4 bg-green-500 text-white hover:bg-white hover:text-green-800 border-2 border-green-800'>Submit</button>
            </form>
            {totalCredits !== null && (
                <div className='mt-5'>
                    <span className='font-semibold'>Total Carbon Credits: </span>{totalCredits}
                </div>
            )}
        </div>
    );
}

export default  CarbonCredit;

