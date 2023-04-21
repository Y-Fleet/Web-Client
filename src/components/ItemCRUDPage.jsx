import React, {useEffect} from "react";
import ItemForm from "./ItemForm";
import {useToken} from "../hooks/MemoryJwtToken"
import '../Style/ItemCrud.css';
import Sidebar from '../components/SideMenu';


const ItemCRUDPage = () => {
  const [items, setItems] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [formAction, setFormAction] = React.useState("Create");
  const { token } = useToken();

  useEffect(() => {
    const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:8080/GetItem', requestOptions);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data)
        setItems(data);
      } catch (error) {
        console.error("There was an error fetching items:", error);
      }
    };

    fetchItems();
  }, []);




  const handleCreateOrUpdate = (item) => {
    if (formAction === "Create") {
      setItems([...items, item]);
    } else {
      const updatedItems = items.map((i) =>
        i.uid === item.uid ? item : i
      );
      setItems(updatedItems);
    }
    setFormAction("Create");
    setSelectedItem(null);
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    setFormAction("Update");
  };

  const handleDelete = async (ID) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ID }),
    };
  
    try {
      const response = await fetch('http://localhost:8080/DelItem', requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const filteredItems = items.filter((item) => item.ID !== ID);
      setItems(filteredItems);
    } catch (error) {
      console.error('There was an error deleting the item:', error);
    }
  };

  return (
    <div className="ItemCRUDPage">
      <Sidebar />
      <h1>Item CRUD</h1>
      <ItemForm
        action={formAction}
        onSubmit={handleCreateOrUpdate}
        item={selectedItem}
      />
      <h2>Items List:</h2>
      <ul>
      {items.map((item) => (
  <li key={item.ID}>
    {item.name} ({item.kg} KG) - {item.desc}
    <button onClick={() => handleSelect(item)}>Edit</button>
    <button onClick={() => handleDelete(item.ID)}>Delete</button>
  </li>
))}
      </ul>
    </div>
  );
};

export default ItemCRUDPage;
