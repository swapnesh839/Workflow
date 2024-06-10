import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import "./Sidebar.css"
import { AlignLeft, AlignRight, ArrowLeftCircle, ArrowRightCircle, Settings } from 'lucide-react'

const Sidebar = () => {

  const pathobj = [
    { path: "/", text: "Layout" },
    // { path: "/BOYD", text: "BOYD" },
    { path: "/Itinerary", text: "Itinerary" },
    { path: "/Workflow", text: "Workflow" },
    { path: "/Recipe", text: "Recipe" },
  ]
  const [open, SetOpen] = useState(false)
  return (
    <div className={`Navbar top-0 position-absolute p-3 ${open && "open"}`}>
      <div onClick={() => { SetOpen(i => !i) }} className='d-flex position-absolute top-0 end-0 rounded-circle p-1'>

        {
          open ? <ArrowLeftCircle width={32} height={32} className='navtogglericon p-1 rounded-circle' /> : <ArrowRightCircle width={32} height={32} className='navtogglericon p-1 rounded-circle' />
        }
      </div>
      {
        open &&
        <div className='d-flex flex-column  align-items-center mt-5'>
          {/* <Settings color='white' />  */}
            <Link className='text-white d-block py-4 link-offset-3-hover nav-underline' to="/BOYD">
              {/* <Settings color='white' /> */}
              <span className='ms-2'>BOYD</span></Link>
          <span className='ms-2'>Workspace settings</span>
          {pathobj.map((i) => (
            <Link className='text-white d-block py-4 link-offset-3-hover nav-underline' to={i.path}>
              {/* <Settings color='white' /> */}
              <span className='ms-2'>{i.text}</span></Link>
          ))}
        </div>
      }
    </div>
  )
}

export default Sidebar