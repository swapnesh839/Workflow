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
// Function to update all data in a specified store
export const updatestore = async ({ storeName, updatedData }) => {
  try {
    // Start a transaction for the specified store
    await db.transaction('rw', db[storeName], async () => {
      // Get all existing data from the store
      const existingData = await db[storeName].toArray();

      // Check if the length of existing data matches the length of updated data
      if (existingData.length !== updatedData.length) {
        throw new Error('Mismatch in data lengths between existing and updated data');
      }

      // Update each entry
      for (let i = 0; i < existingData.length; i++) {
        const id = existingData[i].id;
        const newData = { ...updatedData[i], id }; // Ensure the ID is preserved
        await db[storeName].put(newData);
      }
    });

    console.log('All data updated successfully');
  } catch (error) {
    console.error('Error updating all data:', error);
    return error;
  }
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
