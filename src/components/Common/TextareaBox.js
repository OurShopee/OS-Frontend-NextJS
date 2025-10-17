import React from "react";

const TextareaBox = ({ id, label, value, onChange, placeholder, error }) => (
    <div className="form-group mb-3">
        <label htmlFor={id} className="inputbox-title">{label}</label>
        <textarea
            id={id}
            className={`form-control textareabox ${error ? 'is-invalid' : ''}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={5}
        />
        {error && <div className="invalid-feedback">{error}</div>}
    </div>
);

export default TextareaBox;
