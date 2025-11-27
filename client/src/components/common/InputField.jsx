import React from 'react';

const InputField = ({ label, name, type, value, onChange, error, ...props }) => {
    return (
        <div className="flex flex-col space-y-1">
            <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            <input
                id={name}
                name={name}
                type={type}
                value={type !== 'file' ? value : undefined}
                onChange={onChange}
                className={`w-full p-3 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white placeholder-gray-400
                    ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 text-black'}
                `}
                {...props}
            />

            {error && (
                <p className="text-sm text-red-500 mt-1 font-medium">{error}</p>
            )}
        </div>
    );
};

export default InputField;