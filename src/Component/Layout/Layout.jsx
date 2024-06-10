import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Container, Form, Image, Modal, Row } from 'react-bootstrap'
import "./Layout.css"
import { Rnd } from "react-rnd";
import Box from "../../../src/assets/Box.jpg"
import { addData, getAllData, deleteDataById, updatestore, clearStore } from '../../../db/dbFunctions';
import axios from 'axios';
import { Trash } from 'lucide-react';

const Layout = () => {
    const [item, Setitem] = useState(["item 1"])
    const [ActiveCard, setActiveCard] = useState(null)
    const [modalshow, setModalShow] = useState(false)
    const [preview, setPreview] = useState(null);
    const [Workflows, SetWorkflows] = useState([])
    const [Fetch, SetFetch] = useState(true)

    const AddWorkflowstodb = async ({ obj }) => {
        const data = await addData({ storeName: "Workflows", newData: obj })
    }

    const getWorkflows = async () => {
        const data = await getAllData({ storeName: "Workflows" })
        SetWorkflows(data)
    }
    useEffect(() => {
        if (preview !== null && Workflows[preview]) {
            console.log(Workflows[preview]);
        }
    }, [Workflows, preview])
    useEffect(() => {
        setActiveCard(null)
    }, [preview])
    useEffect(() => {
        getWorkflows()
    }, [Fetch])
    // clearStore({ storeName: "Workflows" })

    const productConfig = ({ type } = {}) => {
        if (type == "rounded") {
            return { width: 200, height: 200, x: 0, y: 0, shape: "rounded" };
        } else {
            return { width: 200, height: 200, x: 0, y: 0, shape: "box" };
        }
    };

    const AddNewProduct = ({ type }) => {
        // const config = productConfig({ type })
        const newProduct = { name: "Edit this name", config: productConfig({ type }) };
        // console.log({ name: "Edit this name", config });
        if (preview != null) {
            SetWorkflows(prev => {
                const updatedWorkflows = [...prev];
                updatedWorkflows[preview] = {
                    ...updatedWorkflows[preview],
                    products: [...updatedWorkflows[preview].products, newProduct]
                };
                return updatedWorkflows;
            })
        }
    }



    const fobj = {
        "name": "Workflow 2",
        "products": [
            { name: "one", config: { width: "200", height: "100", x: 0, y: 30, shape: "box" }, wp: true, msg: false },
            { name: "two", config: { width: "100", height: "200", x: 220, y: 130, shape: "box" }, wp: true, msg: false },
            { name: "three", config: { width: "300", height: "20", x: 200, y: 350, shape: "rounded" }, wp: true, msg: false },
        ]
    }
    // AddWorkflowstodb({ obj: fobj })

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };
    const Addsteps = () => {
        Setitem(prevItems => [...prevItems, `item ${prevItems.length + 1}`]);
    };
    const Updateproduct = () => {
        // updatestore({storeName:"Workflows",updatedData:Workflows})
        console.log(Workflows);
    }
    const editFunction = ({ id, updatedState }) => {
        if (preview !== null) {
            SetWorkflows(prevWorkflows => {
                const updatedWorkflows = [...prevWorkflows];
                const workflow = updatedWorkflows[preview];
                workflow.products = workflow.products.map((product, index) => {
                    if (index === id) {
                        return { ...product, config: updatedState };
                    }
                    return product;
                });
                return updatedWorkflows;
            });
        }
    };


    return (
        <>
            <Container>
                <Container fluid className='Layout bg-white h-100 p-2' style={{ width: "1100px" }}>
                    <Container fluid className='p-0 d-flex justify-content-evenly h-100 w-100 align-items-center align-items-start'>
                        <div>
                            {preview !== null &&
                                <div  className='bg-dark text-white p-2 mb-2 rounded-3'>
                                    {Workflows[preview].name}
                                </div>
                            }
                            <div style={{ height: "500px", width: "600px" }} className='rounded-3 bg-dark d-inline-block'>
                                <div className='border w-100 h-100 border-dark border-3 rounded-3 w-100 boundingbox p-2'>
                                    <div className='h-100 w-100 position-relative' >
                                        <div style={{ width: "40px", height: "40px" }} onClick={() => { AddNewProduct({ type: "box" }) }} className='d-inline-block position-absolute bg-white top-0 end-0 p-1 z-3'>
                                            <div className='h-100 w-100 bg-black'></div>
                                        </div>
                                        <div style={{ width: "40px", height: "40px", right: "45px" }} onClick={() => { AddNewProduct({ type: "rounded" }) }} className='d-d-inline-block position-absolute top-0 p-1 bg-white z-3'>
                                            <div className='h-100 w-100 bg-black rounded-2'></div>
                                        </div>
                                        {preview !== null && <Button
                                            onClick={Updateproduct}
                                            className='position-absolute end-0 bottom-0 z-3'
                                            variant='success'>{preview !== null ? "Update WorkFlow" : "Save WorkFlow"}
                                        </Button>}
                                        {
                                            preview !== null && Workflows[preview] && [Workflows[preview]].map((i, index) => {
                                                return (
                                                    i?.products.map((i, index) => (
                                                        <Component key={index} editFunction={editFunction} setActiveCard={setActiveCard} ActiveCard={ActiveCard} id={index} text={i.name} config={i?.config} />
                                                    ))
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ height: "500px", width: "400px" }} className='rounded-3 bg-dark p-2'>
                            <div className='border border-dark border-3 h-100 w-100 rounded-3 w-100 position-relative overflow-auto hidescrollbar'>
                                <p className='border-bottom border-dark border-2 w-100 p-2 sticky-top z-3 bg-dark'>Product setup</p>
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
                                        <Button size='sm' className='ms-auto m-2' onClick={Addsteps} variant='success'>
                                            Add Steps
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </div>

                    </Container >
                </Container >
            </Container>
            <Container style={{ width: "1100px" }} className=''>
                <Container fluid className='p-0 d-flex justify-content-evenly h-100 w-100 align-items-center align-items-start'>
                    <div className='rounded-3 bg-dark p-2 w-100'>
                            <p className='border-bottom border-dark border-2 w-100 p-2 sticky-top z-3'>layouts</p>
                        <Row className=' h-100 w-100 p-2'>
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
                        </Row>
                    </div>
                </Container>
            </Container>
        </>
    )
}



const Component = ({ position, id, text, editFunction, ActiveCard, setActiveCard, config }) => {

    const [state, setState] = useState({
        width: config?.width || 100,
        height: config?.height || 100,
        x: config?.x || 0,
        y: config?.y || 0,
        img: config?.img || null
    });

    useEffect(() => {
        console.log(config?.img, state?.img);
        // editFunction({id:id, updatedState:state}) ;
    }, [state])
    const handleFocus = (id) => {
        setActiveCard(id)
    }
    const triggerImageInput = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setState((prev) => (
                        {
                            ...prev,
                            img: reader.result
                        }
                    ))
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    };

    return (
        <Rnd
            size={{ width: state?.width, height: state?.height }}
            position={{ x: state?.x, y: state?.y }}
            onDragStop={(e, d) => {
                setState((prev) => (
                    {
                        ...prev,
                        x: d?.x,
                        y: d?.y
                    }

                ))
            }}
            onClick={() => handleFocus(id)}
            onResizeStop={(e, direction, ref, delta, position) => {
                setState((prev) => (
                    {
                        ...prev,
                        width: ref.style.width,
                        height: ref.style.height
                    }
                ));
            }}
            minWidth={100}
            minHeight={100}
            bounds="parent"
            // className={`rounded-1 text-dark text-center bg-dark-subtle d-flex ${ActiveCard === id ? 'border border-3 border-primary' : ''}`}
            className={`${config?.shape == "rounded" && "rounded-2"} text-dark text-center bg-dark-subtle d-flex ${ActiveCard == id && "border border-2 border-info"}`}
        >
            <Card className='w-100 position-relative Layoutcard'>
                <Image onClick={() => triggerImageInput()} style={{ minHeight: "20px", minWidth: "20px" }} src='https://uxwing.com/wp-content/themes/uxwing/download/editing-user-action/edit-round-line-icon.png' width={"10%"} className='position-absolute ratio-1x1 z-3 m-2 layout-cardimg top-0 end-0  bg-light text-white rounded-circle' />
                <Card.Body className='p-1'>
                    <div className='h-75 d-flex'
                        style={{
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundImage: `url(${state.img || Box})`
                        }}
                    >
                        {!state.img && <p className='m-auto text-dark-emphasis bg-dark-subtle'>change the default image</p>}
                    </div>
                    <Card.Title className=' m-auto'>
                        {text}
                    </Card.Title>
                </Card.Body>
            </Card>
        </Rnd>
    );
};


export default Layout