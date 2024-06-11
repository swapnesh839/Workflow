import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap'
import "./Layout.css"
import { Rnd } from "react-rnd";
import Box from "../../../src/assets/Box.jpg"
import { addData, getAllData, deleteDataById, updatestore, clearStore } from '../../../db/dbFunctions';
import axios from 'axios';
import Wp from "../../assets/WP.png"
import CRM from "../../assets/CRM.png"
import SMS from "../../assets/SMS.png"
import Mail from "../../assets/Mail.png"
import Erp from "../../assets/erp.svg"
import { Trash } from 'lucide-react';

const stepinput = [
    { value: "Wp", img: Wp },
    { value: "CRM", img: CRM },
    { value: "SMS", img: SMS },
    { value: "Mail", img: Mail },
    { value: "Erp", img: Erp },
]

const Layout = () => {
    const [step, Setstep] = useState(["step 1"])
    const [ActiveCard, setActiveCard] = useState(null)
    const [IneditMode, setIneditMode] = useState(false)
    const [preview, setPreview] = useState(null);
    const [Workflows, SetWorkflows] = useState([])
    const [Fetch, SetFetch] = useState(true)
    const [isAdding, SetisAdding] = useState(false)
    const [NewWorkflow, SetNewWorkflow] = useState({
        "name": `Workflow ${Workflows.length + 1}`,
        "products": [{ name: "one", config: { width: "200", height: "100", x: 0, y: 30, shape: "box" }, steps: [{ name: "stnklm", Wp: true, CRM: true, Erp: false, SMS: true, Mail: false }] }]
    })
    const [Workflowtoshow, SetWorkflowtoshow] = useState(preview != null ? Workflows[preview] : isAdding && NewWorkflow)


    useEffect(() => {
        SetNewWorkflow({
            "name": `Workflow ${Workflows.length + 1}`,
            "products": [{ name: "one", config: { width: "200", height: "100", x: 0, y: 30, shape: "box" }, steps: [{ name: "stnklm", Wp: true, CRM: true, Erp: false, SMS: true, Mail: false }] }]
        })
    }, [Workflows])


    useEffect(() => {
        SetWorkflowtoshow(preview != null ? Workflows[preview] : NewWorkflow && NewWorkflow)
    }, [Workflows, preview, ActiveCard, NewWorkflow])


    const AddWorkflowstodb = async () => {
        await addData({ storeName: "Workflows", newData: NewWorkflow })
        SetFetch(i => !i)
        SetisAdding(false)
    }
    const handleSetupscheckboxChange = (stepIndex, checkboxValue) => {
        if (ActiveCard !== null) {

            if (preview !== null) {
                SetWorkflows(prev => {
                    if (!prev || prev.length <= preview) return prev; // Prevent errors if workflows are not yet loaded
                    if (!prev[preview]?.products[ActiveCard]) return prev; // Prevent errors if product does not exist

                    const updatedWorkflows = [...prev];
                    const currentWorkflow = { ...updatedWorkflows[preview] };
                    const currentProduct = { ...currentWorkflow.products[ActiveCard] };
                    const updatedSteps = [...currentProduct.steps];

                    updatedSteps[stepIndex] = {
                        ...updatedSteps[stepIndex],
                        [checkboxValue]: !updatedSteps[stepIndex][checkboxValue],
                    };

                    currentProduct.steps = updatedSteps;
                    currentWorkflow.products[ActiveCard] = currentProduct;
                    updatedWorkflows[preview] = currentWorkflow;

                    console.log("Updated Workflows:", updatedWorkflows);
                    return updatedWorkflows;
                });
            } else {
                SetNewWorkflow(prev => {
                    if (!prev || !prev.products || !prev.products[ActiveCard]) return prev; // Prevent errors if new workflow or products are not yet loaded

                    const updatedProducts = [...prev.products];
                    const currentProduct = { ...updatedProducts[ActiveCard] };
                    const updatedSteps = [...currentProduct.steps];

                    updatedSteps[stepIndex] = {
                        ...updatedSteps[stepIndex],
                        [checkboxValue]: !updatedSteps[stepIndex][checkboxValue],
                    };

                    currentProduct.steps = updatedSteps;
                    updatedProducts[ActiveCard] = currentProduct;

                    const newState = {
                        ...prev,
                        products: updatedProducts,
                    };

                    console.log("Updated NewWorkflow:", newState);
                    return newState;
                });
            }
        }
        else{
            window.alert("Select an ActiveCard");
        }
    };


    const getWorkflows = async () => {
        const data = await getAllData({ storeName: "Workflows" })
        SetWorkflows(data)
    }
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
        SetisAdding(true)
        const newProduct = { name: "Edit this name", config: productConfig({ type }), steps: [{ name: "stnklm", Wp: true, CRM: true, Erp: false, SMS: true, Mail: false }] };

        if (preview != null) {
            SetWorkflows(prev => {
                const updatedWorkflows = [...prev];
                updatedWorkflows[preview] = {
                    ...updatedWorkflows[preview],
                    products: [...updatedWorkflows[preview].products, newProduct]
                };
                return updatedWorkflows;
            })
        } else {
            SetNewWorkflow(prev => {
                console.log(prev);
                return ({
                    ...prev,
                    products: [...prev.products, newProduct],
                })
            });
        }
    }



    const fobj = {
        "name": "Workflow 2",
        "products": [
            { name: "one", config: { width: "200", height: "100", x: 0, y: 30, shape: "box" }, steps: [{ name: "stnklm", Wp: true, CRM: true, Erp: false, SMS: true, Mail: false }] },
            { name: "two", config: { width: "100", height: "200", x: 220, y: 130, shape: "box" }, steps: [{ name: "ghgjk", Wp: true, CRM: true, Erp: false, SMS: true, Mail: false }] },
            { name: "three", config: { width: "300", height: "20", x: 200, y: 350, shape: "rounded" }, steps: [{ name: "rtyu", Wp: true, CRM: true, Erp: false, SMS: true, Mail: false }] },
        ]
    }
    // AddWorkflowstodb({ obj: fobj })
    const Addsteps = () => {
        const newStep = { name: `step ${Workflowtoshow.products[ActiveCard || 0]?.steps.length + 1}`, Wp: false, CRM: false, Erp: false, SMS: false, Mail: false };

        if (preview !== null) {
            SetWorkflows(prev => {
                if (!prev || prev.length <= preview) return prev; // Prevent errors if workflows are not yet loaded

                const updatedWorkflows = [...prev];
                const currentWorkflow = updatedWorkflows[preview];

                if (!currentWorkflow?.products) return prev; // Prevent errors if products are not yet loaded

                currentWorkflow.products = currentWorkflow.products.map(product => ({
                    ...product,
                    steps: [...product.steps, newStep]
                }));

                return updatedWorkflows;
            });
        } else {
            console.log("kj", NewWorkflow);

            SetNewWorkflow(prev => {
                const updatedProducts = prev.products.map(product => ({
                    ...product,
                    steps: [...product.steps, newStep]
                }));

                return {
                    ...prev,
                    products: updatedProducts
                };
            });
        }
    };


    const Updateproduct = () => {
        updatestore({ storeName: "Workflows", updatedData: Workflows })
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
    const handleProductnamechange = (e) => {
        const newName = e.target.value;

        if (preview !== null && ActiveCard !== null) {
            SetWorkflows(prev => {
                const updatedWorkflows = [...prev];
                updatedWorkflows[preview] = {
                    ...updatedWorkflows[preview],
                    products: updatedWorkflows[preview].products.map((product, index) => {
                        if (index === ActiveCard) {
                            return { ...product, name: newName };
                        }
                        return product;
                    })
                };
                return updatedWorkflows;
            });
        }
    };

    const clearWorkflowSelected = () => {
        setPreview(null)
    }



    return (
        <>
            <Container>
                <Container fluid className='Layout bg-white h-100 p-2' style={{ width: "1100px" }}>
                    <Container fluid className='p-0 d-flex justify-content-evenly h-100 w-100 align-items-center align-items-start'>
                        <div>
                            {
                                <div className='bg-dark text-white p-2 mb-2 rounded-3 d-flex'>
                                    <span className='me-auto my-auto'>{Workflowtoshow?.name} </span>
                                    {
                                        (isAdding && preview == null) && <span onClick={AddWorkflowstodb} className='my-auto ms-auto bg-success rounded-1 py-1 px-2'>Save New Workflow</span>
                                    }
                                </div>
                            }
                            <div style={{ height: "500px", width: "600px" }} className='rounded-3 bg-dark d-inline-block'>
                                <div className='border w-100 h-100 border-dark border-3 rounded-3 w-100 boundingbox p-2'>
                                    <div className='h-100 w-100 position-relative' >
                                        <div style={{ width: "40px", height: "40px" }} onClick={() => { AddNewProduct({ type: "box" }) }} className='d-inline-block position-absolute cursor-pointer bg-white top-0 end-0 p-1 z-3 text-white'>
                                            <div className='h-100 w-100 bg-black d-flex'>
                                                <span className='m-auto fs-6' >+</span>
                                            </div>
                                        </div>
                                        <div style={{ width: "40px", height: "40px", right: "45px" }} onClick={() => { AddNewProduct({ type: "rounded" }) }} className='d-d-inline-block cursor-pointer position-absolute top-0 p-1 bg-white z-3 text-white'>
                                            <div className='h-100 w-100 bg-black rounded-2 d-flex'>
                                                <span className='m-auto fs-6' >+</span>
                                            </div>
                                        </div>
                                        {ActiveCard != null && <Trash onClick={(e) => {
                                            e.stopPropagation()
                                            // deleteDataById({ storeName: "Workflows", id: i.id })
                                            // SetFetch(i => !i)
                                        }} className='position-absolute top-0 bg-danger text-white rounded-2 p-1 m-2 z-3' style={{ right: "80px" }} />}
                                        {preview !== null && <Button
                                            onClick={Updateproduct}
                                            className='position-absolute end-0 bottom-0 z-3'
                                            variant='success'>{preview !== null ? "Update WorkFlow" : "Save WorkFlow"}
                                        </Button>}
                                        {
                                            (isAdding || preview != null) && Workflowtoshow?.products.map((i, index) => {
                                                return <Component key={index} editFunction={editFunction} setActiveCard={setActiveCard} ActiveCard={ActiveCard} id={index} text={i.name} config={i?.config} />
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            {
                                <div className='bg-dark text-white p-2 mb-2 rounded-3'>
                                    {"Product setup"}
                                </div>
                            }
                            <div style={{ height: "500px", width: "400px" }} className='rounded-3 bg-dark d-inline-block'>
                                <div className='border border-dark border-3 h-100 w-100 rounded-3 w-100 position-relative overflow-auto hidescrollbar'>
                                    <Form className='p-2'>
                                        <div className='py-2 sticky-top bg-dark'>Add Setups</div>
                                        <input placeholder='Workflow Name'
                                            value={(isAdding || preview != null) ? Workflowtoshow?.products[ActiveCard || 0]?.name : ""}
                                            onChange={handleProductnamechange} className='w-100 mb-3' />
                                        <div className='w-100 ' style={{ minHeight: "100px" }}>
                                            {
                                                (isAdding || preview != null) && Workflowtoshow?.products[ActiveCard || 0]?.steps.map((i, v) => (
                                                    <div key={v} className='w-100 bg-white text p-2 my-1'>
                                                        <input readOnly className='w-100' value={i?.name && i?.name} />
                                                        <Row className=' p-2'>
                                                            {
                                                                stepinput.map((o, index) => (
                                                                    <Col key={index} className='bg-dark-subtle d-flex flex-column rounded-2 text-center mx-1 p-2 justify-content-center align-content-center'>
                                                                        <input value={o.value}
                                                                            onChange={() => handleSetupscheckboxChange(v, o.value)}
                                                                            checked={i?.[o.value] === true || false}
                                                                            className="mx-auto" type='checkbox' name={o.value} id={o.value} />
                                                                        <div className=''>
                                                                            <label className='d-inline' htmlFor={o.value}>
                                                                                <Image src={o.img} width={30} className='p-1' />
                                                                            </label>
                                                                        </div>
                                                                    </Col>
                                                                ))
                                                            }

                                                        </Row>
                                                    </div>
                                                ))
                                            }
                                            <div onClick={Addsteps} className='bg-dark-subtle fs-3 cursor-pointer py-1 hidescrollbar my-2 text-dark text-capitalize text-center'>
                                                +
                                            </div>
                                        </div>
                                        <div className='d-flex sticky-bottom bg-dark'>
                                            <Button size='sm' className='ms-auto m-2' onClick={Addsteps} variant='success'>
                                                save
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>

                    </Container >
                </Container >
            </Container >
            <Container style={{ width: "1060px" }} className='position-relative'>
                <Container fluid className='p-0 d-flex justify-align-content-around h-100 w-100 align-items-center '>
                    <div className='rounded-3 bg-dark p-2 w-100 position-relative'>
                        <p className='border-bottom border-dark border-2 w-100 p-2 sticky-top z-3'>layouts</p>
                        {
                            preview != null && (
                                <Button
                                    className='position-absolute top-0 end-0 m-1 z-3'
                                    onClick={() => {
                                        clearWorkflowSelected();
                                    }}
                                >
                                    Clear selected Workflow
                                </Button>
                            )
                        }
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
        img: config?.img,
        shape: config?.shape
    });

    useEffect(() => {
        // console.log(config?.img, state?.img);
        editFunction({ id: id, updatedState: state });
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
            <div className={`w-100 position-relative Layoutcard d-flex ${config?.shape == "rounded" && "rounded-2"}`}>
                <Image onClick={() => triggerImageInput()} style={{ minHeight: "20px", minWidth: "20px" }} src='https://uxwing.com/wp-content/themes/uxwing/download/editing-user-action/edit-round-line-icon.png' width={"10%"} className='position-absolute ratio-1x1 z-3 m-2 layout-cardimg top-0 end-0  bg-light text-white rounded-circle' />
                <div className={`p-1 w-100 d-flex ${config?.shape == "rounded" && "rounded-2"}`}
                    style={{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundImage: `url(${state.img || Box})`
                    }}>
                    {/* {!state.img && <p className='m-auto text-dark-emphasis bg-dark-subtle'>change the default image</p>} */}
                    <p className='mt-auto bg-dark-subtle w-100 mx-auto'>
                        {text}
                    </p>
                </div>
            </div>
        </Rnd>
    );
};


export default Layout