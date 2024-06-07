import React, { useRef, useState } from 'react'
import { Button, Card, Col, Container, Form, Image, Modal, Row } from 'react-bootstrap'
import "./Layout.css"
import { Rnd } from "react-rnd";

const Layout = () => {
    const [item, Setitem] = useState(["item 1"])
    const [ActiveCard, setActiveCard] = useState(null)
    const [modalshow, setModalShow] = useState(false)
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };
    const add = () => {
        Setitem(prevItems => [...prevItems, `item ${prevItems.length + 1}`]);
    };
    const editFunction = ({ id }) => {
        setActiveCard(id);
        setModalShow(true);
        console.log(id);
    };

    return (
        <>
            <Container fluid className='Layout bg-white h-100' style={{ width: "1500px" }}>
                <Container fluid className='p-0 d-flex justify-content-evenly h-100 w-100 align-items-center align-items-start'>
                    <div style={{ height: "500px", width: "600px" }} className='rounded-3 bg-dark d-inline-block'>
                        <div className='border h-100 w-100 border-dark border-3 rounded-3 w-100 boundingbox p-2'>
                            <div className='h-100 w-100 position-relative'>
                                <Component id={1} ActiveCard={ActiveCard} setActiveCard={setActiveCard} editfunction={editFunction} />
                                <Component ActiveCard={ActiveCard} setActiveCard={setActiveCard} id={2} editfunction={editFunction} />
                            </div>
                        </div>
                    </div>
                    <div style={{ height: "500px", width: "400px" }} className='rounded-3 bg-dark p-2'>
                        <div className='border border-dark border-3 h-100 w-100 rounded-3 w-100 position-relative overflow-auto hidescrollbar'>
                            <p className='border-bottom border-dark border-2 w-100 p-2 sticky-top z-3 bg-dark'>Define WorkFlow</p>
                            <Form className='p-2'>
                                <input placeholder='Workflow Name' className='w-100 mb-3' />
                                <div className='w-100 ' style={{ minHeight: "100px" }}>
                                    {item.map((i, v) => (
                                        <div key={v} className='bg-dark-subtle cursor-pointer py-2 hidescrollbar my-2 text-dark text-capitalize text-center'>
                                            {i}
                                        </div>
                                    ))}
                                </div>
                                <div className='d-flex  sticky-bottom bg-dark'>
                                    <Button size='sm' className='ms-auto m-2' onClick={add} variant='success'>
                                        Add Steps
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                    <div style={{ width: "300px", height: "500px" }} className='rounded-3 bg-dark p-2'>
                        <p className='border-bottom border-dark border-2 w-100 p-2 sticky-top z-3 bg-dark'>layouts</p>
                    </div>
                </Container >
            </Container >
            <Editmodal show={modalshow} onHide={() => setModalShow(false)} id={ActiveCard} />

        </>
    )
}
const Editmodal = ({ show, onHide, id }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton />
            <Modal.Body>
                <Form>
                    <Container className=''>
                        <Image width="100%" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk9I4ShLVuwDVX2-9DHBxIjc0rm-mjbRlvVg&usqp=CAU' />
                    </Container>
                    <Container>
                        <Form.Control width="100%" style={{ width: "100%" }} value={"dhjkjl"} />
                        {id}
                    </Container>
                    <div className='d-flex p-2 mt-2'>
                        <Button variant='success' className='m-auto'>Submit</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}



const Component = ({ img, id, text, editfunction, ActiveCard, setActiveCard }) => {
    const [open, Setopen] = useState(false)
    const [state, setState] = useState({
        width: 100,
        height: 100,
        x: 0,
        y: 0,
    });
    const handleFocus = (id) => {
        setActiveCard(id)
    }
    const changeSize = (e, direction, ref, delta, position) => {
        handleFocus(id)
        // console.log(e, direction, ref, delta, position, 'e, direction, ref, delta, position')
        Setbox(id, {
            width: ref.style.width,
            height: ref.style.height,
            ...position
        });
    };
    const changePosition = (e, d) => {
        handleFocus(id)
        Setbox(id, { x: d.x, y: d.y });
    };
    const handleRightClick = (e, { id }) => {
        e.preventDefault();
        handleFocus(id)
        editfunction(id)
    };

    return (
        <>
            <Rnd
                onContextMenu={(e) => {
                    handleRightClick(e, { id: id });
                }}
                size={{ width: state.width, height: state.height }}
                position={{ x: state.x, y: state.y }}
                onDragStop={(e, d) => {
                    setState({ ...state, x: d.x, y: d.y });
                }}
                onClick={() => handleFocus(id)}
                onResizeStop={(e, direction, ref, delta, position) => {
                    setState({
                        width: ref.style.width,
                        height: ref.style.height,
                        ...position,
                    });
                }}
                minWidth={100}
                minHeight={100}
                bounds="parent"
                // className={`rounded-1 text-dark text-center bg-dark-subtle d-flex ${ActiveCard === id ? 'border border-3 border-primary' : ''}`}
                className={`rounded-1 text-dark text-center bg-dark-subtle d-flex ${ActiveCard == id && "border border-2 border-info"}`}
            >
                <Card className='w-100 position-relative Layoutcard'>
                    <Image onClick={() => { editfunction({ id: id }) }} style={{ minHeight: "20px", minWidth: "20px" }} src='https://uxwing.com/wp-content/themes/uxwing/download/editing-user-action/edit-round-line-icon.png' width={"10%"} className='position-absolute ratio-1x1 z-3 m-2 layout-cardimg top-0 end-0  bg-light text-white rounded-circle' />
                    <Card.Body className='p-1'>
                        <div className='h-75'
                            style={{
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundImage: `url("data:image/jpeg;base64,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")`,
                            }}
                        >

                        </div>
                        <Card.Title className=' m-auto'>
                            fdxgckj
                            {/* {`ActiveCard }`} */}
                        </Card.Title>
                    </Card.Body>
                </Card>
            </Rnd>
        </>
    );
};


export default Layout





// // import React, { useRef, useState } from 'react';
// // import { Button, Col, Container, Form, Row } from 'react-bootstrap';
// // import { Rnd } from 'react-rnd';
// // import './Layout.css';

// // const Layout = () => {
// //     const [item, setItem] = useState(['item 1']);

// //     const add = () => {
// //         setItem((prevItems) => [...prevItems, `item ${prevItems.length + 1}`]);
// //     };

// //     return (
// //         <Container className="Layout">
// //             <Container fluid className="p-5">
// //                 <Row>
// //                     <Col md="9" className="p-2">
// //                         <div className="rounded-3">
// //                             <div
// //                                 style={{
// //                                     height: '490px',
// //                                     backgroundColor: '#3F5469',
// //                                     position: 'relative',
// //                                 }}
// //                                 className="border border-dark border-3 rounded-3 w-100 boundingbox p-2"
// //                             >
// //                                 <Component />
// //                             </div>
// //                         </div>
// //                     </Col>
// //                     <Col md="3" className="p-2">
// //                         <div className="rounded-3">
// //                             <div
// //                                 style={{ maxHeight: '490px', minHeight: '200px', backgroundColor: '#3F5469' }}
// //                                 className="border border-dark border-3 rounded-3 w-100 position-relative overflow-auto hidescrollbar"
// //                             >
// //                                 <p
// //                                     style={{ backgroundColor: '#3F5469' }}
// //                                     className="border-bottom border-dark border-2 w-100 p-2 sticky-top"
// //                                 >
// //                                     Define WorkFlow
// //                                 </p>
// //                                 <Form className="p-2">
// //                                     <input placeholder="Workflow Name" className="w-100 mb-3" />
// //                                     <div className="w-100" style={{ minHeight: '100px' }}>
// //                                         {item.map((i, v) => (
// //                                             <div
// //                                                 key={v}
// //                                                 className="bg-dark-subtle cursor-pointer py-2 hidescrollbar my-2 text-dark text-capitalize text-center"
// //                                             >
// //                                                 {i}
// //                                             </div>
// //                                         ))}
// //                                     </div>
// //                                     <div style={{ backgroundColor: '#3F5469' }} className="d-flex sticky-bottom">
// //                                         <Button size="sm" className="ms-auto m-2" onClick={add} variant="success">
// //                                             Add Steps
// //                                         </Button>
// //                                     </div>
// //                                 </Form>
// //                             </div>
// //                         </div>
// //                     </Col>
// //                 </Row>
// //             </Container>
// //         </Container>
// //     );
// // };

// // const Component = () => {
// //     const [state, setState] = useState({
// //         width: 200,
// //         height: 200,
// //         x: 100,
// //         y: 100,
// //     });

// //     return (
// //         <Rnd
// //             style={{
// //                 border: 'solid 1px #ddd',
// //                 background: '#fff',
// //                 display: 'flex',
// //                 alignItems: 'center',
// //                 justifyContent: 'center',
// //             }}
// //             size={{ width: state.width, height: state.height }}
// //             position={{ x: state.x, y: state.y }}
// //             onDragStop={(e, d) => {
// //                 setState({ ...state, x: d.x, y: d.y });
// //             }}
// //             onResizeStop={(e, direction, ref, delta, position) => {
// //                 setState({
// //                     width: ref.style.width,
// //                     height: ref.style.height,
// //                     ...position,
// //                 });
// //             }}
// //             minWidth={100}
// //             minHeight={100}
// //             bounds="parent"
// //         >
// //             <div>
// //                 <h3>Draggable and Resizable Box</h3>
// //                 <p>Drag me around and resize me!</p>
// //             </div>
// //         </Rnd>
// //     );
// // };

// // export default Layout;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';  // Axios is used for making HTTP requests

// function App() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [preview, setPreview] = useState(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setPreview(URL.createObjectURL(file));  // Optionally set a preview
//     }
//   };


//   useEffect(()=>{
//     console.log(preview);
//   },[preview])

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) return;

//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       const response = await axios.post('/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       console.log('File uploaded successfully:', response.data);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input type="file" onChange={handleFileChange} />
//         <button type="submit">Upload</button>
//       </form>
//       {preview && <img src={preview} alt="Preview" style={{ width: '300px', marginTop: '20px' }} />}
//     </div>
//   );
// }

// export default App;
