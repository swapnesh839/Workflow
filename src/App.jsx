import React, { useState, useEffect } from 'react';
import { getDataById, getAllData, addData, clearStore } from '../db/dbFunctions';
import { Container } from 'react-bootstrap';
import Sidebar from './Component/Sidebar/Sidebar';
import Layout from './Component/Layout/Layout';
import Approuter from '../App-router';
import "./App.css"


function App() {

  const [data, setData] = useState([]);

  // useEffect(()=>{
  //   getDataById({ storeName: 'Workflows',id:1 }).then((i)=>setData(i))
  // },[])
  // useEffect(()=>{
  //   console.log(data);
  // },[data])
  return (
    <Container className='p-0 vh-100 text-light d-flex' fluid>
      <Sidebar />
      <Approuter />
    </Container>
  );
}



export default App;
