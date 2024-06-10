import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const Itinerary = () => {
  return (
    <>
      <Container>
        <Container fluid className='Layout bg-white h-100 p-2' style={{ width: "1060px" }}>
          <Container fluid className='p-0 d-flex justify-content-evenly h-100 w-100 align-items-center align-items-start'>
            <div>
              <div className='bg-dark text-white p-2 mb-2 rounded-3'>
                {"workflow name"}
              </div>
              <div style={{ height: "500px", width: "600px" }} className='rounded-3 bg-dark d-inline-block'>
              </div>
            </div>
            <div>
              <div className='bg-dark text-white p-2 mb-2 rounded-3'>
                Components
              </div>
              <div style={{ height: "500px", width: "400px" }} className='rounded-3 bg-dark '>
                <div className='border'>jhbk</div>
              </div>
            </div>
          </Container>
        </Container>
      </Container><Container style={{ width: "1100px" }} className=''>
        <Container fluid className='p-0 d-flex justify-content-evenly h-100 w-100 align-items-center align-items-start'>
          <div className='rounded-3 bg-dark p-2 w-100'>
            <p className='border-bottom border-dark border-2 w-100 p-2 sticky-top z-3'>Itineraries</p>
            {/* <Row className=' h-100 w-100 p-2'>
                            {
                                Workflows.map((i, index) => (
                                    <Col key={index} lg="3" md="3" sm="3" xs="3" xxl="3" onClick={() => { setPreview(index) }} className="text-center p-2 cursor-pointer">
                                        <div className={`p-3 bg-dark-subtle position-relative text-dark ${preview == index && "border border-info border-2"}`}>
                                            <Trash onClick={(e) => {
                                                e.stopPropagation()
                                                deleteDataById({ storeName: "Workflows", id: i.id })
                                                SetFetch(i => !i)
                                            }} className='position-absolute top-0 end-0 bg-danger text-white rounded-2 p-1 m-1' />
                                            {i.name}
                                        </div>
                                    </Col>
                                ))
                            }
                        </Row> */}
          </div>
        </Container>
      </Container>
    </>
  )
}

export default Itinerary
