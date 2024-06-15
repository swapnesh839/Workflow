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
import { Edit, Eye, Trash, Upload } from 'lucide-react';
import { X } from 'lucide-react';
import RingLoader from "react-spinners/RingLoader";
const stepinput = [
    { value: "Wp", img: Wp },
    { value: "CRM", img: CRM },
    { value: "SMS", img: SMS },
    { value: "Mail", img: Mail },
    { value: "Erp", img: Erp },
]

const Layout = () => {
    const [ActiveCard, setActiveCard] = useState(null)
    const [preview, setPreview] = useState(null);
    const [Workflows, SetWorkflows] = useState([])
    const [Fetch, SetFetch] = useState(true)
    const [isAdding, SetisAdding] = useState(false)
    const [isEditing, SetisEditing] = useState(false)
    const [activeplay, setActiveplay] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [NewWorkflow, SetNewWorkflow] = useState({
        "name": `Name of the Layout`,
        "products": []
    })
    const [Workflowtoshow, SetWorkflowtoshow] = useState(preview != null ? Workflows[preview] : isAdding && NewWorkflow)


    useEffect(() => {
        setActiveCard(null)
    }, [preview])
    const playactiveplay = () => {
        console.log(Workflowtoshow?.products[ActiveCard].steps.length);
        setIsLoading(true);
        console.log(stepinput.length - 1);
        const interval = setInterval(() => {
            setActiveplay((prevActiveplay) => {
                if (prevActiveplay < Workflowtoshow?.products[ActiveCard].steps.length - 1) {
                    return prevActiveplay + 1;
                } else {
                    clearInterval(interval);
                    setIsLoading(false);
                    setActiveplay(-1)
                    return prevActiveplay;
                }
            });
            console.log(activeplay);
        }, 3000);
    };

    useEffect(() => {
        return () => {
            setIsLoading(false); // Clean up function to set isLoading to false when component unmounts
        };
    }, []);



    useEffect(() => {
        if (preview != null) {
            SetisAdding(true)
        }
    }, [preview])

    const deleteProduct = (productId) => {
        if (preview !== null) {
            SetWorkflows((prev) => {
                const updatedWorkflows = [...prev];
                updatedWorkflows[preview].products = updatedWorkflows[preview].products.filter((product, index) => index !== productId);
                return updatedWorkflows;
            });
        } else {
            SetNewWorkflow((prev) => ({
                ...prev,
                products: prev.products.filter((product, index) => index !== productId),
            }));
        }
    };


    useEffect(() => {
        SetNewWorkflow({
            "name": `Layout ${Workflows.length + 1}`,
            "products": []
        })
    }, [Workflows])


    useEffect(() => {
        SetWorkflowtoshow(preview != null ? Workflows[preview] : NewWorkflow && NewWorkflow)
    }, [Workflows, preview, ActiveCard, NewWorkflow])


    const AddWorkflowstodb = async () => {
        console.log(NewWorkflow);

        await addData({ storeName: "Workflows", newData: NewWorkflow })
        SetFetch(i => !i)
        // SetisAdding(false)
    }
    const handleSetupCheckboxChange = (stepIndex, checkboxValue) => {
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
                        ...Object.keys(updatedSteps[stepIndex]).reduce((acc, key) => {
                            if (key !== 'name') {
                                acc[key] = false;
                            }
                            return acc;
                        }, {}),
                        [checkboxValue]: true,
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
                        ...Object.keys(updatedSteps[stepIndex]).reduce((acc, key) => {
                            if (key !== 'name') {
                                acc[key] = false;
                            }
                            return acc;
                        }, {}),
                        [checkboxValue]: true,
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
        } else {
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

    const productConfig = ({ type } = {}) => {
        if (type == "rounded") {
            return { width: 100, height: 100, x: 0, y: 0, shape: "rounded", img: null };
        }
        else if (type == "circle") {
            return { width: 100, height: 100, x: 0, y: 0, shape: "circle", img: null };
        }
        else {
            return { width: 100, height: 100, x: 0, y: 0, shape: "box", img: null };
        }
    };

    const AddNewProduct = ({ type }) => {
        SetisAdding(true);

        const newProduct = { name: "", config: productConfig({ type }), steps: [] };

        if (preview !== null) {
            SetWorkflows(prev => {
                const updatedWorkflows = [...prev];
                updatedWorkflows[preview] = {
                    ...updatedWorkflows[preview],
                    products: [...updatedWorkflows[preview].products, newProduct]
                };
                return updatedWorkflows;
            });
        } else {
            SetNewWorkflow(prev => {
                // const isFirstAddition = prev.products.length === 1 &&
                //     prev.products[0].name === "" &&
                //     prev.products[0].config.width === "200" &&
                //     prev.products[0].config.height === "200" &&
                //     prev.products[0].steps.length === 1 &&
                //     prev.products[0].steps[0].name === "step-1" &&
                //     prev.products[0].steps[0].Wp === false &&
                //     prev.products[0].steps[0].CRM === false &&
                //     prev.products[0].steps[0].Erp === false &&
                //     prev.products[0].steps[0].SMS === false &&
                //     prev.products[0].steps[0].Mail === false;

                const newProducts = [...prev.products, newProduct];

                return {
                    ...prev,
                    products: newProducts,
                };
            });
        }
    };

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
        } else {
            SetNewWorkflow(prev => {
                const updatedProducts = prev.products.map((product, index) => {
                    if (index === id) {
                        return { ...product, config: updatedState };
                    }
                    return product;
                });

                return {
                    ...prev,
                    products: updatedProducts,
                };
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
        } else if (ActiveCard !== null) {
            SetNewWorkflow(prev => {
                const updatedProducts = prev.products.map((product, index) => {
                    if (index === ActiveCard) {
                        return { ...product, name: newName };
                    }
                    return product;
                });

                return {
                    ...prev,
                    products: updatedProducts,
                };
            });
        }
    };


    const clearWorkflowSelected = () => {
        setPreview(null)
    }
    const handleWorkflowNameChange = (e) => {
        const newName = e.target.value;
        if (preview !== null) {
            SetWorkflows(prev => {
                const updatedWorkflows = [...prev];
                updatedWorkflows[preview].name = newName;
                return updatedWorkflows;
            });
        } else {
            SetNewWorkflow(prev => ({
                ...prev,
                name: newName,
            }));
        }
    };

    const handleStepNameChange = (e, stepIndex) => {
        const newName = e.target.value;

        if (preview !== null) {
            SetWorkflows(prev => {
                const updatedWorkflows = [...prev];
                const currentWorkflow = updatedWorkflows[preview];
                const currentProduct = currentWorkflow.products[ActiveCard || 0];
                const updatedSteps = [...currentProduct.steps];

                updatedSteps[stepIndex] = {
                    ...updatedSteps[stepIndex],
                    name: newName,
                };

                currentProduct.steps = updatedSteps;
                currentWorkflow.products[ActiveCard || 0] = currentProduct;
                updatedWorkflows[preview] = currentWorkflow;

                return updatedWorkflows;
            });
        } else {
            SetNewWorkflow(prev => {
                const updatedProducts = [...prev.products];
                const currentProduct = updatedProducts[ActiveCard || 0];
                const updatedSteps = [...currentProduct.steps];

                updatedSteps[stepIndex] = {
                    ...updatedSteps[stepIndex],
                    name: newName,
                };

                currentProduct.steps = updatedSteps;
                updatedProducts[ActiveCard || 0] = currentProduct;

                return {
                    ...prev,
                    products: updatedProducts,
                };
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

                                <div className='position-relative'>
                                    <div className='w-100'>
                                        {
                                            <div className=' text-white p-2 mb-2 me-auto rounded-3 w-100'>
                                                {
                                                    isAdding && <input className='me-auto w-100 my-auto layout-naneinput' onChange={(e) => { handleWorkflowNameChange(e) }} value={Workflowtoshow?.name} />
                                                }
                                            </div>
                                        }
                                        {/* {
                                            preview != null && (
                                                <span
                                                    className='ms-auto bg-success my-auto rounded-2 p-2 cursor-pointer'
                                                    onClick={() => {
                                                        clearWorkflowSelected();
                                                    }}
                                                >
                                                    Add New Workflow
                                                </span>
                                            )
                                        } */}
                                    </div>
                                    <div style={{ height: "500px", width: "600px" }} className='rounded-3  d-inline-block position-relative'>
                                        <div className='position-absolute top-50 d-flex flex-column p-1 translate-middle' style={{ left: "-20px" }}>

                                            <div style={{ width: "40px", height: "40px" }} onClick={() => { AddNewProduct({ type: "box" }) }} className='d-inline-block  cursor-pointer p-0 bg-white m-1  p-1 z-3 text-white'>
                                                <div className='h-100 w-100 boeder-1 border d-flex' style={{ backgroundColor: "#9333ea" }}>
                                                    <span className='m-auto fs-6' >+</span>
                                                </div>
                                            </div>
                                            {/* <div style={{ width: "40px", height: "40px"}} onClick={() => { AddNewProduct({ type: "rounded" }) }} className='d-d-inline-block cursor-pointer p-0 m-1 bg-white z-3 text-white'> */}
                                            <div style={{ width: "40px", height: "40px" }} onClick={() => { AddNewProduct({ type: "rounded" }) }} className='d-inline-block  cursor-pointer p-0 bg-white m-1  p-1 z-3 text-white'>
                                                <div className='h-100 w-100 boeder-1 border d-flex rounded-2' style={{ backgroundColor: "#9333ea" }}>
                                                    <span className='m-auto fs-6' >+</span>
                                                </div>
                                            </div>
                                            <div style={{ width: "40px", height: "40px" }} onClick={() => { AddNewProduct({ type: "circle" }) }} className='d-inline-block  cursor-pointer p-0 bg-white m-1  p-1 z-3 text-white'>
                                                <div className='h-100 w-100 boeder-1 border d-flex rounded-circle' style={{ backgroundColor: "#9333ea" }}>
                                                    <span className='m-auto fs-6' >+</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='border w-100 h-100  border-3 rounded-3 w-100 boundingbox p-2'>
                                            <div className='h-100 w-100 position-relative' >

                                                {preview !== null && <span
                                                    onClick={Updateproduct}
                                                    className='position-absolute end-0 bottom-0 z-3 bg-success rounded-1 py-1 px-2 cursor-pointer'
                                                >{"Update"}
                                                </span>}
                                                {
                                                    (isAdding && preview == null) &&
                                                    <span onClick={AddWorkflowstodb} className='position-absolute end-0 bottom-0 z-3 bg-success rounded-1 py-1 px-2 cursor-pointer'>Save</span>
                                                }
                                                {
                                                    (isAdding || preview != null) && Workflowtoshow?.products.map((i, index) => {
                                                        return <Component deleteProduct={deleteProduct} handleProductnamechange={handleProductnamechange} key={index} editFunction={editFunction} setActiveCard={setActiveCard} ActiveCard={ActiveCard} id={index} text={i.name} config={i?.config} />
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {(ActiveCard != null && Workflowtoshow?.products[ActiveCard]?.config?.img != null) &&
                                    (
                                        preview != null ?
                                            isEditing ? <div>
                                                {
                                                    <div className='text-black p-2 mb-2 d-flex'>

                                                        <div className='ms-auto'>
                                                            {
                                                                isEditing ? <Eye onClick={() => { SetisEditing(false) }} /> : <Edit onClick={() => { SetisEditing(true) }} />
                                                            }
                                                        </div>

                                                    </div>
                                                }
                                                <div style={{ height: "500px", width: "400px" }} className='rounded-3 mt-auto d-inline-block'>
                                                    <div className='border  border-3 h-100 w-100 d-flex flex-column rounded-3 w-100 position-relative overflow-auto hidescrollbar'>
                                                        <Form className='p-2 w-100 h-100 overflow-auto hidescrollbar'>
                                                            <div className='py-2 sticky-top text-black bg-white'>
                                                                <div className='d-flex'>
                                                                    <input placeholder='Workflow Name'
                                                                        value={(isAdding || preview != null) ? Workflowtoshow?.products[ActiveCard || 0]?.name : ""}
                                                                        onChange={handleProductnamechange} className='w-100 mb-3 border-0 me-auto border-bottom border-2' />
                                                                    {
                                                                        ActiveCard != null && <X className="ms-auto  fs-4 cursor-pointer" onClick={() => { setActiveCard(null) }} />
                                                                    }
                                                                </div>
                                                                {/* Workflow */}
                                                            </div>
                                                            <div className='w-100 ' style={{ minHeight: "100px" }}>
                                                                {
                                                                    (isAdding || preview != null) && Workflowtoshow?.products[ActiveCard || 0]?.steps.map((i, v) => (
                                                                        <div key={v} className='w-100 bg-white text p-2 my-1'>
                                                                            {/* <input readOnly className='w-100' value={i?.name && i?.name} /> */}
                                                                            {/* <div className='d-flex'> */}
                                                                            <input
                                                                                className='w-100 me-auto'
                                                                                value={i?.name}
                                                                                required
                                                                                onChange={(e) => handleStepNameChange(e, v)}
                                                                            />

                                                                            {/* </div> */}
                                                                            <Row className=' p-2'>
                                                                                {
                                                                                    stepinput.map((o, index) => (
                                                                                        <Col key={index} className='-subtle d-flex flex-column rounded-2 text-center mx-1 p-2 justify-content-center align-content-center'>
                                                                                            <input value={o.value}
                                                                                                onChange={() => handleSetupCheckboxChange(v, o.value)}
                                                                                                checked={i?.[o.value] === true || false}
                                                                                                className="mx-auto" type='radio'
                                                                                                required
                                                                                                name={`step-${v}`}
                                                                                                id={`step-${v}-${o.value}`} />
                                                                                            <div className=''>
                                                                                                <label className='d-inline' htmlFor={`step-${v}-${o.value}`}>
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
                                                                <div onClick={Addsteps} className='rounded-2 fs-3 cursor-pointer text-white py-1 my-2 text-dark text-capitalize text-center' style={{ background: "#9333ea" }}>
                                                                    +
                                                                </div>
                                                            </div>
                                                        </Form>
                                                        <div className='d-flex mt-auto rounded-1 sticky-bottom bg-white'>
                                                            {preview !== null && <Button size='sm' className='ms-auto m-2 border-0' onClick={Updateproduct} variant='success'>
                                                                Update
                                                            </Button>}
                                                            {
                                                                (isAdding && preview == null) && <Button size='sm' className='ms-auto m-2 border-0' variant='success'>
                                                                    Save
                                                                </Button>
                                                            }
                                                            {/* <Button size='sm' className='ms-auto m-2 border-0' onClick={AddWorkflowstodb} variant='success'>
                                                        Save
                                                    </Button> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> : <div>
                                                {
                                                    <div className='text-black p-2 mb-2 d-flex '>
                                                        <span className='border-bottom border-2 p-1 me-auto'>
                                                            {/* {"Product setup"} */}
                                                            {/* {"Define WorkFlow"} */}
                                                        </span>
                                                        {
                                                            isEditing ? <Eye onClick={() => { SetisEditing(false) }} /> : <Edit onClick={() => { SetisEditing(true) }} />
                                                        }
                                                    </div>
                                                }
                                                <div style={{ height: "500px", width: "400px" }} className='rounded-3 mt-auto d-inline-block text-black'>
                                                    <div className='border d-flex flex-column border-3 h-100 w-100 rounded-3 w-100 position-relative overflow-auto hidescrollbar'>
                                                        <Container className='sticky-top bg-white'>
                                                            <h4 className='p-1 mt-1'>
                                                                Workflow name :- {Workflowtoshow.name}
                                                            </h4>
                                                        </Container>
                                                        <Container className='ps-4 pe-0'>
                                                            <Row className='p-2 w-100'>
                                                                {
                                                                    Workflowtoshow?.products.map((i, index) => {
                                                                        if (ActiveCard == index) {
                                                                            return (
                                                                                i?.steps?.map((step, index) => {
                                                                                    console.log(step);
                                                                                    const img = step?.Wp && Wp || step.CRM && CRM || step.Erp && Erp || step.Mail && Mail || SMS
                                                                                    const Msg = step?.Wp && "Whatsapp" || step.CRM && "CRM" || step.Erp && "Erp" || step.Mail && "Mail" || "SMS"
                                                                                    return (
                                                                                        <Col key={index} sm="12" className={`${activeplay === index && 'border border-2'}`}>
                                                                                            <div className='p-2 d-flex'>
                                                                                                <span>
                                                                                                    {/* {(isLoading && index == activeplay) && "Sending"} */}
                                                                                                    {""}{step.name}</span>
                                                                                                <img
                                                                                                    width="40px"
                                                                                                    className="ms-auto "
                                                                                                    src={img}
                                                                                                    alt={`Step ${index}`}
                                                                                                />
                                                                                            </div>
                                                                                            {/* {isLoading && <div>
                                                                                                {Msg} sent
                                                                                            </div>} */}
                                                                                        </Col>
                                                                                    )
                                                                                })
                                                                            )
                                                                        }

                                                                    })
                                                                }
                                                            </Row>
                                                        </Container>

                                                        <Container className='mt-auto p-3 bg-white sticky-bottom d-flex'>
                                                            <Button className='border-0 me-auto my-auto' onClick={playactiveplay}>{isLoading ? "Wait" : "Run"}</Button>
                                                            <Container className=''>
                                                                {isLoading &&
                                                                    // <img className='p-3' src={loader} height={"60px"} />
                                                                    <RingLoader loading={isLoading} size={30} />
                                                                }
                                                            </Container>
                                                        </Container>
                                                    </div>
                                                </div></div>
                                            : <div>
                                                {
                                                    <div className='text-black p-2 mb-2'>
                                                        <span className='border-bottom border-2 p-1'>
                                                            {/* {"Product setup"} */}
                                                            {/* {"Define WorkFlow"} */}
                                                        </span>
                                                    </div>
                                                }
                                                <div style={{ height: "500px", width: "400px" }} className='rounded-3 mt-auto d-inline-block'>
                                                    <div className='border  border-3 h-100 w-100 d-flex flex-column rounded-3 w-100 position-relative'>
                                                        <Form className='p-2 w-100 h-100 overflow-auto hidescrollbar'>
                                                            <div className='py-2 sticky-top text-black bg-white'>
                                                                <div className='d-flex'>
                                                                    <input placeholder='Workflow Name'
                                                                        value={(isAdding || preview != null) ? Workflowtoshow?.products[ActiveCard || 0]?.name : ""}
                                                                        onChange={handleProductnamechange} className='w-100 mb-3 border-0 me-auto border-bottom border-2' />
                                                                    {
                                                                        ActiveCard != null && <X className="ms-auto  fs-4 cursor-pointer" onClick={() => { setActiveCard(null) }} />
                                                                    }
                                                                </div>
                                                                {/* Workflow */}
                                                            </div>
                                                            <div className='w-100 ' style={{ minHeight: "100px" }}>
                                                                {
                                                                    (isAdding || preview != null) && Workflowtoshow?.products[ActiveCard || 0]?.steps.map((i, v) => (
                                                                        <div key={v} className='w-100 bg-white text p-2 my-1'>
                                                                            {/* <input readOnly className='w-100' value={i?.name && i?.name} /> */}
                                                                            {/* <div className='d-flex'> */}
                                                                            <input
                                                                                className='w-100 me-auto'
                                                                                value={i?.name}
                                                                                onChange={(e) => handleStepNameChange(e, v)}
                                                                            />

                                                                            {/* </div> */}
                                                                            <Row className=' p-2'>
                                                                                {
                                                                                    stepinput.map((o, index) => (
                                                                                        <Col key={index} className='-subtle d-flex flex-column rounded-2 text-center mx-1 p-2 justify-content-center align-content-center'>
                                                                                            <input value={o.value}
                                                                                                onChange={() => handleSetupCheckboxChange(v, o.value)}
                                                                                                checked={i?.[o.value] === true || false}
                                                                                                className="mx-auto" type='radio'
                                                                                                name={`step-${v}`}
                                                                                                id={`step-${v}-${o.value}`} />
                                                                                            <div className=''>
                                                                                                <label className='d-inline' htmlFor={`step-${v}-${o.value}`}>
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
                                                                <div onClick={Addsteps} className='rounded-2 fs-3 cursor-pointer text-white py-1 my-2 text-dark text-capitalize text-center' style={{ background: "#9333ea" }}>
                                                                    +
                                                                </div>
                                                            </div>
                                                        </Form>
                                                        <div className='d-flex mt-auto rounded-1 sticky-bottom bg-white'>
                                                            {preview !== null && <Button size='sm' className='ms-auto m-2 border-0' onClick={Updateproduct} variant='success'>
                                                                Update
                                                            </Button>}
                                                            {
                                                                (isAdding && preview == null) && <Button size='sm' className='ms-auto m-2 border-0' variant='success'>
                                                                    Save
                                                                </Button>
                                                            }
                                                            {/* <Button size='sm' className='ms-auto m-2 border-0' onClick={AddWorkflowstodb} variant='success'>
                                                        Save
                                                    </Button> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    )
                                }

                            </Container >
                        </Container >
                    </Container >
                </Col>
            </Row>
            <Row>
                <Col>
                    <Container className='position-relative'>
                        <Container fluid className='p-0 d-flex justify-align-content-around h-100 w-100 align-items-center border-3 rounded-1  border-rpl'>
                            <div className='rounded-3  p-2 w-100 position-relative '>
                                <p className='border-rpl border-2 w-100 p-2 sticky-top z-3 text-black'>Layouts</p>

                                <Row className=' h-100 w-100 p-2'>
                                    {
                                        Workflows.map((i, index) => (
                                            <Col key={index} lg="3" md="3" sm="3" xs="3" xxl="3" onClick={() => { setPreview(index) }} className="text-center p-2 cursor-pointer">
                                                <div className={`p-3 -subtle position-relative text-white rounded-2 bg-rpl2 ${preview == index && "border border-rpl border-2"}`}>
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
                    </Container></Col>
            </Row>
        </Container>
    )
}



const Component = ({ position, deleteProduct, id, text, editFunction, ActiveCard, setActiveCard, config, handleProductnamechange }) => {

    const [state, setState] = useState({
        width: config?.width || 100,
        height: config?.height || 100,
        x: config?.x || 0,
        y: config?.y || 0,
        img: config?.img,
        shape: config?.shape
    });

    useEffect(() => {
        // console.log(config?.img);
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
            style={{ backgroundColor: "#BACFE3" }}
            // className={`rounded-1 text-dark text-center -subtle d-flex ${ActiveCard === id ? 'border border-3 border-primary' : ''}`}
            className={`
                ${config?.shape == "rounded" && "rounded-2"} {"}
                ${config?.shape == "circle" && "rounded-circle"}
             text-dark text-center d-flex p-2 ${ActiveCard == id && "border border-2 border-rpl"}`}
        >
            <div title={text} className={`w-100 position-relative Layoutcard d-flex flex-column
                 ${config?.shape == "rounded" && "rounded-2"} {""}
                 ${config?.shape == "circle" && "rounded-circle"}
                  `}
            >
                <div className='position-absolute translate-middle top-50 d-flex flex-column rounded-end py-1 z-3' style={{ backgroundColor: "#BACFE3", left: "103%" }}>
                    <Upload size={18} className=' cursor-pointer top-0 end-0  rounded-circle p-1 text-white m-1 layout-cardimg' style={{ backgroundColor: "#9333EA" }} onClick={() => triggerImageInput()} />
                    <Trash size={18} onClick={(e) => {
                        e.stopPropagation()
                        deleteProduct(id)
                        // deleteDataById({ storeName: "Workflows", id: i.id })
                        // SetFetch(i => !i)
                    }} className=' cursor-pointer top-0 bg-danger text-white rounded-2 p-1 m-1 z-3 layout-cardimg' style={{ right: "30px" }} />
                </div>
                <div className={`p-1 w-100 h-100 d-flex ${config?.shape == "rounded" && "rounded-2"} {""} ${config?.shape == "circle" && "rounded-circle"} `}
                    style={{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundImage: `url(${state.img})`
                    }}>
                    {/* {!state.img && <p className='m-auto text-dark-emphasis -subtle rounded-circle'>change the default image</p>} */}
                </div>
                {/* {<input placeholder='Workflow Name'
                    // value={(isAdding || preview != null) ? Workflowtoshow?.products[ActiveCard || 0]?.name : ""}
                    value={text}
                    onChange={handleProductnamechange} className='w-100 mb-3 border-0 ' />} */}
            </div>
        </Rnd>
    );
};


export default Layout