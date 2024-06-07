import db from './db';

// Function to add data to a specified store
export const addData = ({ storeName, newData }) => {
  return db[storeName].add(newData)
    .then(() => console.log('Data added successfully'))
    .catch((error) => {
      console.error('Error adding data:', error);
      return error;
    });
};

// Function to delete data from a specified store by ID
export const deleteDataById = ({ storeName, id }) => {
  return db[storeName].delete(id)
    .then(() => console.log('Data deleted successfully'))
    .catch((error) => {
      console.error('Error deleting data by ID:', error);
      return error;
    });
};

// Function to update data in a specified store by ID
export const updateDataById = ({ storeName, id, updatedData }) => {
  return db[storeName].update(id, updatedData)
    .then(() => console.log('Data updated successfully'))
    .catch((error) => {
      console.error('Error updating data by ID:', error);
      return error;
    });
};

// Function to get all data from a specified store
export const getAllData = ({ storeName }) => {
  return db[storeName].toArray()
    .then((data) => {
      // console.log(data);
      return data
    })
    .catch((error) => {
      console.error('Error getting all data:', error);
      return error;
    });
};

// Function to get data from a specified store by ID
export const getDataById = ({ storeName, id }) => {
  return db[storeName].get(id)
    .then((data) => data)
    .catch((error) => {
      console.error('Error getting data by ID:', error);
      return error;
    });
};

// Function to clear an entire store
export const clearStore = ({ storeName }) => {
  return db[storeName].clear()
    .then(() => console.log('Store cleared successfully'))
    .catch((error) => {
      console.error('Error clearing store:', error);
      return error;
    });
};
