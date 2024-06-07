import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './src/Component/Layout/Layout'
import BYOD from './src/Component/BYOD/BYOD'
import Recipe from './src/Component/Recipe/Recipe'
import Itinerary from './src/Component/Itinerary/Itinerary'
import Workflow from './src/Component/Workflow/Workflow'

const Approuter = () => {
    return (
        <Routes>
            <Route path='/' element={<Layout />} />
            <Route path='/BOYD' element={<BYOD />} />
            <Route path='/Itinerary' element={<Itinerary />} />
            <Route path='/Workflow' element={<Workflow />} />
            <Route path='/Recipe' element={<Recipe />} />
            <Route path='*' element={<Layout />} />
        </Routes>
    )
}

export default Approuter