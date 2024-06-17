import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Button, Image } from 'react-bootstrap';
import { Rnd } from 'react-rnd';
import { Trash } from 'lucide-react';
import Wp from "../../assets/WP.png";
import CRM from "../../assets/CRM.png";
import SMS from "../../assets/SMS.png";
import Mail from "../../assets/Mail.png";
import Erp from "../../assets/erp.svg";
import { addData, getAllData, updatestore, deleteDataById } from '../../../db/dbFunctions';

const obj = [
  { name: "Wp", img: Wp },
  { name: "CRM", img: CRM },
  { name: "SMS", img: SMS },
  { name: "Mail", img: Mail },
  { name: "Erp", img: Erp }
];

const Itinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [fetch, setFetch] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [preview, setPreview] = useState(null);
  const [newItinerary, setNewItinerary] = useState({
    name: `Itinerary ${itineraries.length + 1}`,
    products: []
  });

  const [Itinerarytoshow, SetItinerarytoshow] = useState(preview != null ? itineraries[preview] : isAdding && newItinerary);

  useEffect(() => {
    setNewItinerary({
      name: `Itinerary ${itineraries.length + 1}`,
      products: []
    });
  }, [itineraries]);

  useEffect(() => {
    SetItinerarytoshow(preview != null ? itineraries[preview] : newItinerary && newItinerary);
  }, [itineraries, preview, newItinerary]);

  useEffect(() => {
    getItineraries();
  }, [fetch]);

  const getItineraries = async () => {
    try {
      const data = await getAllData({ storeName: "Itineraries" });
      setItineraries(data || []);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    }
  };

  const addproduct = ({ text }) => {
    const newProduct = {
      config: { width: 400, height: 70, x: 0, y: 60, text: text }
    };

    // Prevent double addition by checking and managing states more carefully
    if (preview !== null) {
      setItineraries(prev => {
        const updatedItineraries = [...prev];
        updatedItineraries[preview] = {
          ...updatedItineraries[preview],
          products: [...updatedItineraries[preview].products, newProduct]
        };
        return updatedItineraries;
      });
    } else {
      setNewItinerary(prev => ({
        ...prev,
        products: [...prev.products, newProduct]
      }));
    }
    setIsAdding(true);
  };

  const saveNewItineraryToDB = async () => {
    try {
      await addData({ storeName: "Itineraries", newData: newItinerary });
      setFetch(prev => !prev);
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding new itinerary:', error);
    }
  };

  const deleteItinerary = async (id) => {
    try {
      await deleteDataById({ storeName: "Itineraries", id });
      setFetch(prev => !prev);
    } catch (error) {
      console.error('Error deleting itinerary:', error);
    }
  };

  const updateItinerary = () => {
    updatestore({ storeName: "Itineraries", updatedData: itineraries });
    console.log(itineraries);
  };

  const clearItinerarySelected = () => {
    setPreview(null);
    setIsAdding(false);
  };

  const editFunction = ({ id, updatedState }) => {
    if (preview !== null) {
      setItineraries(prev => {
        const updatedItineraries = [...prev];
        const Itinerary = updatedItineraries[preview];
        Itinerary.products = Itinerary.products.map((product, index) => {
          if (index === id) {
            return { ...product, config: updatedState };
          }
          return product;
        });
        return updatedItineraries;
      });
    }
  };

  const deleteLastProduct = () => {
    if (preview !== null) {
      setItineraries((prev) => {
        const updatedWorkflows = [...prev];
        if (updatedWorkflows[preview].products.length > 0) {
          updatedWorkflows[preview].products.pop();
        }
        return updatedWorkflows;
      });
    } else {
      setNewItinerary((prev) => ({
        ...prev,
        products: prev.products.slice(0, -1)
      }));
    }
  };

  const updateProductName = (e, id) => {
    const newName = e.target.value;

    if (preview !== null) {
      setItineraries(prev => {
        const updatedRecipes = prev.map((recipe, recipeIndex) => {
          if (recipeIndex === preview) {
            return {
              ...recipe,
              products: recipe.products.map((product, productIndex) => {
                if (productIndex === id) {
                  return {
                    ...product,
                    name: newName
                  };
                }
                return product;
              })
            };
          }
          return recipe;
        });
        return updatedRecipes;
      });
    } else {
      setNewItinerary(prev => {
        const updatedProducts = prev.products.map((product, productIndex) => {
          if (productIndex === id) {
            return {
              ...product,
              name: newName
            };
          }
          return product;
        });

        return {
          ...prev,
          products: updatedProducts
        };
      });
    }
  };
  useEffect(() => {
    if (preview != null) {
        setNewItinerary({
          name: `Itinerary ${itineraries.length + 1}`,
          products: []
        })
        setIsAdding(true)
    }
  }, [preview])

  const handleitineraryNameChange = (e) => {
    const newName = e.target.value;
    if (preview !== null) {
      setItineraries(prev => {
        const updatedWorkflows = [...prev];
        updatedWorkflows[preview].name = newName;
        return updatedWorkflows;
      });
    } else {
      setNewItinerary(prev => ({
        ...prev,
        name: newName
      }));
    }
  };

  return (
    <Container className='overflow-auto'>
      <Row>
        <Col>
          <Container>
            <Container fluid className='Layout bg-white h-100 p-2'>
              <Container fluid className='p-0 d-flex justify-content-evenly h-100 w-100 align-items-center align-items-start'>
                <div className='position-relative'>
                  <div className='text-black p-2 mb-2 rounded-3 position-relative d-lg-flex'>
                    <input value={Itinerarytoshow.name} onChange={(e) => { handleitineraryNameChange(e) }} className='me-auto my-auto w-100 border-top-0 border-end-0 border-start-0' />
                    {/* {preview !== null && (
                      <Button className='position-absolute top-0 m-1 z-3 end-0' onClick={clearItinerarySelected}>
                        Add new
                      </Button>
                    )} */}
                  </div>
                  {(preview !== null || !isAdding) && (
                    <div className='position-absolute translate-middle top-50' style={{ left: "-50px" }}>
                      <span onClick={() => { setIsAdding(true) }} className='bg-success cursor-pointer p-1 rounded-2'>Create New</span>
                    </div>
                  )}
                  <div style={{ height: "500px", width: "600px" }} className='rounded-3 d-inline-block'>
                    <div className='border w-100 h-100 border-rpl border-3 rounded-3 w-100 boundingbox p-2'>
                      <div className='h-100 w-100 position-relative text-white position-static'>
                        {(isAdding && preview === null) && (
                          <div className='text-white p-2 mb-2 rounded-3 d-flex position-absolute bottom-0 end-0 m-1 z-3'>
                            <span onClick={saveNewItineraryToDB} className='my-auto ms-auto bg-success rounded-1 py-1 px-2 cursor-pointer z-3'>Save</span>
                          </div>
                        )}
                        {preview !== null && (
                          <Button onClick={updateItinerary} className='position-absolute bottom-0 end-0 m-1 z-3'>update</Button>
                        )}
                        {(isAdding || preview !== null) && Itinerarytoshow?.products.map((i, index) => (
                          <Component key={index} index={index}
                            deleteLastProduct={deleteLastProduct}
                            isLast={index === Itinerarytoshow?.products.length - 1}
                            editFunction={editFunction}
                            updateProductName={updateProductName}
                            id={index} productname={i.name} config={i?.config} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {(isAdding || preview !== null) && (
                  <div>
                    <div className='text-black p-2 mb-2 rounded-3'>
                      <span className='border-bottom border-2 p-1'>{"Components"}</span>
                    </div>
                    <div style={{ height: "500px", width: "400px" }} className='rounded-3 border border-2'>
                      <Row className='p-3'>
                        {obj.map((i) => (
                          <Col key={i.name} xxl="6" xl="6" md="6" xs="6" className='p-1'>
                            <div className='d-flex text-black-subtle h-100 p-2 flex-column' onClick={() => addproduct({ text: i.name })}>
                              <Image src={i.img} className='mx-auto cursor-pointer p-3 border' width={80} />
                              <p className='mx-auto text-center'>{i.name}</p>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </div>
                )}
              </Container>
            </Container>
          </Container>
        </Col>
      </Row>
      <Row>
        <Col>
          <Container className=''>
            <Container fluid className='p-0 d-flex justify-content-evenly h-100 w-100 align-items-center align-items-start'>
              <div className='rounded-3 p-2 w-100 position-relative border-rpl'>
                <p className='border-rpl border-2 w-100 p-2 sticky-top z-3 text-black'>Itineraries</p>
                <Row className='h-100 w-100 p-2'>
                  {itineraries?.map((i, index) => (
                    <Col key={index} lg="3" md="3" sm="3" xs="3" xxl="3" onClick={() => { setPreview(index) }} className="text-center p-2 cursor-pointer">
                      <div style={{ backgroundColor: "#BA7FF2" }} className={`p-3 text-white rounded-2 position-relative text-dark ${preview === index && "border border-rpl border-2"}`}>
                        <Trash onClick={(e) => {
                          e.stopPropagation();
                          deleteItinerary(i.id);
                        }} className='position-absolute top-0 end-0 bg-danger text-white rounded-2 p-1 m-1' />
                        Itinerary {index + 1}
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

const Component = ({ index, deleteLastProduct, config, editFunction, isLast, updateProductName, productname }) => {
  const [state, setState] = useState({
    width: config?.width || 400,
    height: config?.height || 70,
    x: config?.x || 0,
    y: config?.y || 0,
    text: config?.text || ""
  });

  useEffect(() => {
    editFunction({ id: index, updatedState: state });
  }, [state]);

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
      className='text-dark text-center bg-white border d-flex rounded-2'
    >
      <div className='h-100 d-flex p-2 rounded-2 text-dark w-100 m-auto position-relative'>
        <input
          placeholder='Alert Name'
          value={productname}
          onChange={(e) => { updateProductName(e, index) }}
          className='w-100 mb-3 border-0 position-absolute rounded-2 bg-transparent z-2 start-0 top-0 p-1'
        />
        <span className='m-auto p-1 text-dark'>{state.text}</span>
        {isLast && (
          <Trash onClick={deleteLastProduct} className='position-absolute z-3 top-0 end-0 bg-danger rounded-4 p-1 m-1 text-white cursor-pointer' />
        )}
      </div>
    </Rnd>
  );
};

export default Itinerary;
