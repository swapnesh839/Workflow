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
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [preview, setPreview] = useState(null);
  const [newItinerary, setNewItinerary] = useState({
    name: `Itinerary ${itineraries.length + 1}`,
    products: [{ name: "one", config: { width: 400, height: 70, x: 0, y: 0 } }]
  });
  const [Itinerarytoshow, SetItinerarytoshow] = useState(preview != null ? itineraries[preview] : isAdding && newItinerary)
  useEffect(() => {
    setNewItinerary({
      name: `Itinerary ${itineraries.length + 1}`,
      products: [{ name: "one", config: { width: 400, height: 70, x: 0, y: 0 } }]
    })
  }, [itineraries])
  useEffect(() => {
    SetItinerarytoshow(preview != null ? itineraries[preview] : newItinerary && newItinerary)
  }, [itineraries, preview, newItinerary])

  useEffect(() => {
    // console.log(newItinerary);
  }, [newItinerary])

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

  // const addItinerary = (name) => {
  const addproduct = ({ text }) => {
    const newProduct = {
      config: { width: 400, height: 70, x: 0, y: 60, text: text }
    };
    if (preview != null) {
      setItineraries(prev => {
        const updatedItineraries = [...prev];
        updatedItineraries[preview] = {
          ...updatedItineraries[preview],
          products: [...updatedItineraries[preview].products, newProduct]
        };
        return updatedItineraries;
      })
    } else {
      setNewItinerary(prev => {
        console.log(newItinerary);
        return ({
          ...prev,
          products: [...prev.products, newProduct],
        })
      });
    }


    // setNewItinerary(newIti);
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
    updatestore({ storeName: "Itineraries", updatedData: itineraries })
    console.log(itineraries);
  }

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

  return (
    <Container className='overflow-auto'>
      <Row>
        <Col>
          <Container>
            <Container fluid className='Layout bg-white h-100 p-2'>
              <Container fluid className='p-0 d-flex justify-content-evenly h-100 w-100 align-items-center align-items-start'>
                <div>
                  <div className='bg-dark text-white p-2 mb-2 rounded-3'>
                    {"Itinerary Setup"}
                  </div>
                  <div style={{ height: "500px", width: "600px" }} className='rounded-3 bg-dark d-inline-block'>
                    <div className='border w-100 h-100 border-dark border-3 rounded-3 w-100 boundingbox p-2'>
                      <div className='h-100 w-100 position-relative text-white position-static'>
                        {(isAdding && preview === null) && (
                          <div className='bg-dark text-white p-2 mb-2 rounded-3 d-flex'>
                            <span onClick={saveNewItineraryToDB} className='my-auto ms-auto bg-success rounded-1 py-1 px-2 cursor-pointer z-3'>Save New Itinerary</span>
                          </div>
                        )}
                        {preview !== null && (
                          <Button onClick={updateItinerary} className='position-absolute top-0 end-0 m-1 z-3'>Save Changes</Button>
                        )}
                        {
                          (isAdding || preview != null) && Itinerarytoshow?.products.map((i, index) => {
                            return <Component key={index} index={index}
                              editFunction={editFunction}
                              id={index} text={i.text} config={i?.config} />
                          })
                        }

                        {(!isAdding && preview === null) && (
                          <div className='h-100 w-100 d-flex align-items-center justify-content-center text-white'>
                            <span>No Itinerary Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className='bg-dark text-white p-2 mb-2 rounded-3'>
                    {"Components"}
                  </div>
                  <div style={{ height: "500px", width: "400px" }} className='rounded-3 bg-dark overflow-x-auto'>
                    <Row className='p-3'>
                      {obj.map((i) => (
                        <Col key={i.name} xxl="6" xl="6" md="6" xs="6" className='p-1'>
                          <div className='d-flex text-black bg-dark-subtle h-100 p-2 flex-column' onClick={() => addproduct({ text: i.name })}>
                            <Image src={i.img} className='mx-auto' width={80} />
                            <p className='mx-auto text-center'>{i.name}</p>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
              </Container>
            </Container>
          </Container>
        </Col>
      </Row>
      <Row>
        <Col>
          <Container className=''>
            <Container fluid className='p-0 d-flex justify-content-evenly h-100 w-100 align-items-center align-items-start'>
              <div className='rounded-3 bg-dark p-2 w-100 position-relative'>
                <p className='border-bottom border-dark border-2 w-100 p-2 sticky-top z-3 text-white'>Itineraries</p>
                {preview !== null && (
                  <Button className='position-absolute top-0 m-1 z-3 end-0' onClick={clearItinerarySelected}>
                    Clear selected Itinerary
                  </Button>
                )}
                <Row className=' h-100 w-100 p-2'>
                  {itineraries?.map((i, index) => (
                    <Col key={index} lg="3" md="3" sm="3" xs="3" xxl="3" onClick={() => { setPreview(index) }} className="text-center p-2 cursor-pointer">
                      <div className={`p-3 bg-dark-subtle position-relative text-dark ${preview === index && "border border-info border-2"}`}>
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

const Component = ({ index, config, deleteItinerary, editFunction, isLast }) => {
  const [state, setState] = useState({
    width: config?.width || 400,
    height: config?.height || 70,
    x: config?.x || 0,
    y: config?.y || 0,
    text: config?.text || ""
  });

  useEffect(() => {
    editFunction({ id: index, updatedState: state });
  }, [state])


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
      className='text-dark text-center bg-dark-subtle d-flex rounded-2'
    >
      <div className='bg-white h-100 d-flex p-2 rounded-2 text-dark w-100 m-auto position-relative'>
        <span className='m-auto p-1 text-dark'>{state.text}</span>
        <p className='text-black w-100 text-start position-absolute start-0 top-0 p-1'>step {index + 1}</p>
        {isLast && (
          <Trash onClick={() => deleteItinerary(index)} className='position-absolute top-0 end-0 bg-danger rounded-4 p-1 m-1 text-white cursor-pointer' />
        )}
      </div>
    </Rnd>
  );
};


export default Itinerary;