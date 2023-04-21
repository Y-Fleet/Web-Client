import React, { useState } from "react";
import "../Style/ItemForm.css";
import {useToken} from "../hooks/MemoryJwtToken"

const ItemForm = ({ action, onSubmit, item }) => {
  const { token } = useToken();
  const [formState, setFormState] = useState({
    name: item ? item.name : "",
    desc: item ? item.desc : "",
    Kg: item ? item.Kg : "",
  });
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const modifiedFormState = {
        ...formState,
        Kg: parseInt(formState.Kg, 10),
      };
    setShowForm(false);
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(modifiedFormState),
    };
    fetch('http://localhost:8080/AddItem', requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((jsonResponse) => {
        onSubmit(formState);
        setShowForm(false);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };
  

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Add Item</button>
      {showForm && (
        <div className="modal" onClick={() => setShowForm(false)}>
          <div
            className="card"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button className="closeButton" onClick={() => setShowForm(false)}>
              X
            </button>
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Name:</label>
              <input
                className="inputField"
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
              />
              <label htmlFor="desc">Description:</label>
              <input
                className="inputField"
                type="text"
                id="desc"
                name="desc"
                value={formState.desc}
                onChange={handleChange}
              />
              <label htmlFor="Kg">Weight (Kg):</label>
              <input
                className="inputField"
                type="number"
                id="Kg"
                name="Kg"
                value={formState.Kg}
                onChange={handleChange}
                required
              />
              <button className="inputButton" type="submit">
                {action} Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemForm;
