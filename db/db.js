import Dexie from 'dexie';

// Initialize Dexie database
const db = new Dexie('Spectraworkflow');
db.version(1).stores({
  Workflows:'++id,name,config',
  Layouts:'++id,name,config',
  Recipes:'++id,name,config',
  Itineraries:'++id,name,config',
  products:'++id,name,config',
  // workflow: '++id, Workflows, Layouts, Recipes, Itineraries, products'
});
// const dummyData = {
//   Workflows: [
//     { id: 1, name: 'Workflow 1', status: 'active' },
//     { id: 2, name: 'Workflow 2', status: 'inactive' },
//     { id: 3, name: 'Workflow 3', status: 'active' }
//   ],
//   Layouts: [
//     { id: 1, name: 'Layout 1', type: 'basic' },
//     { id: 2, name: 'Layout 2', type: 'advanced' },
//     { id: 3, name: 'Layout 3', type: 'custom' }
//   ],
//   Recipes: [
//     { id: 1, name: 'Recipe 1', ingredients: ['Ingredient 1', 'Ingredient 2'] },
//     { id: 2, name: 'Recipe 2', ingredients: ['Ingredient 3', 'Ingredient 4'] },
//     { id: 3, name: 'Recipe 3', ingredients: ['Ingredient 5', 'Ingredient 6'] }
//   ],
//   Itineraries: [
//     { id: 1, name: 'Itinerary 1', destinations: ['Destination 1', 'Destination 2'] },
//     { id: 2, name: 'Itinerary 2', destinations: ['Destination 3', 'Destination 4'] },
//     { id: 3, name: 'Itinerary 3', destinations: ['Destination 5', 'Destination 6'] }
//   ],
//   products: [
//     { id: 1, name: 'Product 1', price: 10.99 },
//     { id: 2, name: 'Product 2', price: 19.99 },
//     { id: 3, name: 'Product 3', price: 29.99 }
//   ]
// };

// await db.workflow.add(dummyData);

export default db;
