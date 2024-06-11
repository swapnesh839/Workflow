import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Select from 'react-select';
import { Rnd } from 'react-rnd';
import { Trash } from 'lucide-react';

const Recipe = () => {

  const [Selectedoption, SetSelectedoption] = useState(null)
  const options = [
    { value: 'chocolate', label: 'Chocolate', Alerts: ["Alert1", "Alert2", "Alert3", "Alert4"] },
    { value: 'strawberry', label: 'Strawberry', Alerts: ["Alert1", "Alert2", "Alert3", "Alert4"] },
    { value: 'vanilla', label: 'Vanilla', Alerts: ["Alert1", "Alert2", "Alert3", "Alert4"] },
  ];
  const handleSelectChange = (selectedOption) => {
    SetSelectedoption(selectedOption);
  };
  return (
    <>
      <Container>
        <Container fluid className='Layout bg-white h-100 p-2' style={{ width: "1100px" }}>
          <Container fluid className='p-0 d-flex justify-content-evenly h-100 w-100 align-items-center align-items-start'>
            <div>
              <div className='bg-dark text-white p-2 mb-2 rounded-3'>
                {"Recipe Setup"}
              </div>
              <div style={{ height: "500px", width: "600px" }} className='rounded-3 bg-dark d-inline-block'>
                <div className='border w-100 h-100 border-dark border-3 rounded-3 w-100 boundingbox p-2'>
                  <div className='h-100 w-100 position-relative text-white' >
                    <Component />
                    {/* <Component/> */}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className='bg-dark text-white p-2 mb-2 rounded-3'>
                {"Alerts "}
              </div>
              <div style={{ height: "500px", width: "400px" }} className='rounded-3 bg-dark d-inline-block p-0'>
                <div className='p-2'>
                  <Select
                    onChange={handleSelectChange}
                    className='text-black'
                    options={options}
                    value={Selectedoption}
                  />
                  <Row className='mt-3'>
                    {Selectedoption?.Alerts.map((alert, index) => (
                      <Col key={index} xxl="6" xl="6" md="6" sm="6">
                        <div className='bg-light text-black p-2 mb-2 rounded'>
                          {alert}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </div>

          </Container>
        </Container>
      </Container>
      <Container style={{ width: "1060px" }} className=''>
        <Container fluid className='p-0 d-flex justify-content-evenly h-100 w-100 align-items-center align-items-start'>
          <div className='rounded-3 bg-dark p-2 w-100'>
            <p className='border-bottom border-dark border-2 w-100 p-2 sticky-top z-3 text-white'>Recipes</p>
            <Row className=' h-100 w-100 p-2'>

              <Col  lg="3" md="3" sm="3" xs="3" xxl="3" onClick={() => { setPreview(index) }} className="text-center p-2 cursor-pointer">
                <div className={`p-3 bg-dark-subtle position-relative text-dark ${true == true && "border border-info border-2"}`}>
                  <Trash
                    //  onClick={(e) => {
                    //     e.stopPropagation()
                    //     deleteDataById({ storeName: "Workflows", id: i.id })
                    //     SetFetch(i => !i)
                    // }}
                    className='position-absolute top-0 end-0 bg-danger text-white rounded-2 p-1 m-1' />
                  name
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </Container>
    </>
  )
}

const Component = () => {

  // const [state, setState] = useState({
  //     width: config?.width || 100,
  //     height: config?.height || 100,
  //     x: config?.x || 0,
  //     y: config?.y || 0,
  //     img: config?.img
  // });

  return (
    <Rnd
      size={{ width: 300, height: 70 }}
      position={{ x: 0, y: 0 }}
      // onDragStop={(e, d) => {
      //     setState((prev) => (
      //         {
      //             ...prev,
      //             x: d?.x,
      //             y: d?.y
      //         }

      //     ))
      // }}
      // onClick={() => handleFocus(id)}
      // onResizeStop={(e, direction, ref, delta, position) => {
      //     setState((prev) => (
      //         {
      //             ...prev,
      //             width: ref.style.width,
      //             height: ref.style.height
      //         }
      //     ));
      // }}
      minWidth={100}
      minHeight={50}
      bounds="parent"
      className='text-dark text-center bg-dark-subtle d-flex'
    >
      <div className='bg-white h-100 d-flex p-2 text-dark w-100 m-auto'>
        <span className='m-auto'>Alert</span>
      </div>

    </Rnd>
  );
};


export default Recipe