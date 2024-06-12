const options = [
  { value: 'chocolate', label: 'Chocolate', Alerts: ["Alert1", "Alert2", "Alert3", "Alert4"] },
  { value: 'strawberry', label: 'Strawberry', Alerts: ["Alert1", "Alert2", "Alert3", "Alert4"] },
  { value: 'vanilla', label: 'Vanilla', Alerts: ["Alert1", "Alert2", "Alert3", "Alert4"] },
];

import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import Select from 'react-select';
import { Rnd } from 'react-rnd';
import { Trash } from 'lucide-react';
import { addData, getAllData, updatestore, deleteDataById } from '../../../db/dbFunctions';

const Recipe = () => {
  const [Recipes, SetRecipes] = useState([]);
  const [Fetch, SetFetch] = useState(true);
  const [Selectedoption, SetSelectedoption] = useState(null);
  const [ActiveRecipe, setActiveRecipe] = useState(null);
  const [isAdding, SetisAdding] = useState(false);
  const [preview, setPreview] = useState(null);
  const [NewRecipe, SetNewRecipe] = useState({
    name: `Recipes ${Recipes.length + 1}`,
    products: [{ name: "one", config: { width: 400, height: 70, x: 0, y: 0 } }]
  });

  const [Recipestoshow, SetRecipestoshow] = useState(preview != null ? Recipes[preview] : isAdding && NewRecipe)
  useEffect(() => {
    SetRecipestoshow(preview != null ? Recipes[preview] : NewRecipe && NewRecipe)
  }, [Recipes, preview, NewRecipe])


  useEffect(() => {
    getRecipes();
  }, [Fetch]);

  const getRecipes = async () => {
    try {
      const data = await getAllData({ storeName: "Recipes" });
      SetRecipes(data || []);
      SetNewRecipe({
        name: `Recipe ${data?.length + 1 || 1}`,
        config: { width: "400", height: "70", x: 0, y: 60, text: "" }
      });
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const AddRecipes = async (alert) => {
    const newRecipe = {
      name: `Recipe ${Recipes.length + 1}`,
      config: { width: "400", height: "70", x: 0, y: 60, text: alert }
    };

    SetNewRecipe(newRecipe);
    SetisAdding(true);
  };

  const saveNewRecipeToDB = async () => {
    try {
      await addData({ storeName: "Recipes", newData: NewRecipe });
      SetFetch(prev => !prev);
      SetisAdding(false);
    } catch (error) {
      console.error('Error adding new recipe:', error);
    }
  };

  const deleteLastConfig = async () => {
    try {
      const lastRecipeId = Recipes?.[Recipes.length - 1]?.id;
      if (lastRecipeId) {
        await deleteDataById({ storeName: "Recipes", id: lastRecipeId });
        SetFetch(prev => !prev);
      }
    } catch (error) {
      console.error('Error deleting last config:', error);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await deleteDataById({ storeName: "Recipes", id });
      SetFetch(prev => !prev);
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const updateRecipe = async () => {
    try {
      await updatestore({ storeName: "Recipes", updatedData: Recipes });
      console.log('Recipes updated:', Recipes);
    } catch (error) {
      console.error('Error updating recipes:', error);
    }
  };

  const handleSelectChange = (selectedOption) => {
    SetSelectedoption(selectedOption);
  };

  const handleRecipeNameChange = (e) => {
    const newName = e.target.value;
    if (ActiveRecipe !== null) {
      SetRecipes(prev => {
        const updatedRecipes = [...prev];
        updatedRecipes[ActiveRecipe] = {
          ...updatedRecipes[ActiveRecipe],
          name: newName
        };
        return updatedRecipes;
      });
    } else if (isAdding) {
      SetNewRecipe(prev => ({
        ...prev,
        name: newName
      }));
    }
  };

  const clearRecipeSelected = () => {
    setPreview(null);
    SetisAdding(false);
  };
  

  return (
    <Container className='overflow-auto'>
      <Row>
        <Col>
          <Container>
            <Container fluid className='Layout bg-white h-100 p-2'>
              <Container fluid className='p-0 d-flex justify-content-evenly h-100 w-100 align-items-center align-items-start'>
                <div className=' position-relative'>
                  <div className='text-black p-2 mb-2 rounded-3'>
                    <span className=' border-bottom border-2 p-1'>
                    {"Recipe Setup"}

                    </span>
                  </div>
                  {
                    preview != null || !isAdding && <div className='position-absolute translate-middle top-50' style={{ left: "-50px" }}>
                      <span onClick={() => {
                        SetisAdding(true)
                      }} className='bg-success cursor-pointer p-1 rounded-2'>Create New</span>
                    </div>
                  }
                  <div style={{ height: "500px", width: "600px" }} className='rounded-3  d-inline-block'>
                    <div className='border w-100 h-100 border-3 rounded-3 w-100 boundingbox p-2'>
                      <div className='h-100 w-100 position-relative text-white position-static'>
                        {(isAdding && preview === null) && (
                          <div className=' text-white p-2 m-1 rounded-3 position-absolute bottom-0 end-0 d-flex'>
                            {/* <span className='me-auto my-auto'>{NewRecipe.name}</span> */}
                            <span onClick={saveNewRecipeToDB} className='my-auto ms-auto bg-success rounded-1 py-1 px-2 cursor-pointer z-3'>Save</span>
                          </div>
                        )}
                        {/* {
                          (isAdding || preview != null) && Recipestoshow?.products.map((i, index) => {
                            return <Component key={index} index={index}
                              // editFunction={editFunction}
                              id={index} text={i.text} config={i?.config} />
                          })
                        } */}
                      </div>
                    </div>
                  </div>
                </div>

                {
                  (isAdding
                    || preview != null
                  ) && <div>
                    <div className='text-black p-2 mb-2 rounded-3'>
                      <span className='border-bottom border-2 p-1'>
                        {"Alerts "}
                        
                        </span>
                    </div>
                    <div style={{ height: "500px", width: "400px" }} className='rounded-3 border border-3 d-inline-block p-0'>
                      <div className='p-2'>
                        <Select
                          onChange={handleSelectChange}
                          className='text-black'
                          options={options}
                          value={Selectedoption}
                        />
                        <Row className='mt-3'>
                          {Selectedoption?.Alerts?.map((alert, index) => (
                            <Col className='' key={index} xxl="6" xl="6" md="6" sm="6">
                              <div onClick={() => { AddRecipes(alert) }} className='bg-light border text-black p-2 mb-2 rounded cursor-pointer'>
                                {alert}
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </div>
                  </div>
                }
              </Container>
            </Container>
          </Container>
        </Col>
      </Row>
      <Row>
        <Col>
          <Container className=''>
            <Container fluid className='p-0 d-flex justify-content-evenly h-100 w-100 align-items-center align-items-start'>
              <div className='rounded-3  p-2 w-100 position-relative border border-2 border-rpl'>
                <p className='border-bottom border-rpl border-2 w-100 p-2 sticky-top z-3 text-black'>Recipes</p>
                {preview !== null && (
                  <Button className='position-absolute top-0 end-0 m-1 z-3' onClick={clearRecipeSelected}>
                    Clear selected Recipe
                  </Button>
                )}
                <Row className=' h-100 w-100 p-2'>
                  {Recipes?.map((i, index) => (
                    <Col key={index} lg="3" md="3" sm="3" xs="3" xxl="3" onClick={() => { setPreview(index) }} className="text-center p-2 cursor-pointer">
                      <div className={`p-3 -subtle position-relative text-dark ${preview === index && "border border-info border-2"}`}>
                        <Trash onClick={(e) => {
                          e.stopPropagation();
                          deleteRecipe(i.id);
                        }} className='position-absolute top-0 end-0 bg-danger text-white rounded-2 p-1 m-1' />
                        {i.name}
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Container>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

const Component = ({ index, config, setActiveRecipe, deleteRecipe, isLast, text, ActiveRecipe }) => {
  const [state, setState] = useState({
    width: config?.width || 400,
    height: config?.height || 70,
    x: config?.x || 0,
    y: config?.y || 0,
    text: config?.text || ""
  });

  const handleFocus = (id) => {
    setActiveRecipe(id);
  }

  return (
    <Rnd
      size={{ width: state.width, height: state.height }}
      position={{ x: state.x, y: state.y }}
      onDragStop={(e, d) => {
        setState((prev) => ({
          ...prev,
          x: d.x,
          y: d.y
        }));
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setState((prev) => ({
          ...prev,
          width: ref.style.width,
          height: ref.style.height
        }));
      }}
      minWidth={100}
      minHeight={50}
      bounds="parent"
      className='text-dark text-center -subtle d-flex rounded-2'
      onClick={() => handleFocus(index)}
    >
      <div className='bg-white h-100 d-flex p-2 rounded-2 text-dark w-100 m-auto position-relative'>
        <span className='m-auto p-1 text-dark'>{state.text}</span>
        <p className='text-black w-100 text-start position-absolute start-0 top-0 p-1'>step {index + 1}</p>
        {isLast && (
          <Trash onClick={() => deleteRecipe(index)} className='position-absolute top-0 end-0 bg-danger rounded-4 p-1 m-1 text-white cursor-pointer' />
        )}
      </div>
    </Rnd>
  );
};

export default Recipe;

