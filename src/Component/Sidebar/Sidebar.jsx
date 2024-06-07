import React, { useState } from 'react'
import "./Sidebar.css"
import { AlignLeft, AlignRight, ArrowLeftCircle, ArrowRightCircle, Settings } from 'lucide-react'

const Sidebar = () => {
  const [open, SetOpen] = useState(false)
  return (
    <div className={`Navbar top-0 position-absolute p-3 ${open && "open"}`}>
      <div onClick={()=>{SetOpen(i=>!i)}} className='d-flex position-absolute top-0 end-0 rounded-circle p-1'>
       
          {
            open ? <ArrowLeftCircle width={32} height={32}className='navtogglericon p-1 rounded-circle' /> : <ArrowRightCircle width={32} height={32} className='navtogglericon p-1 rounded-circle' />
          }
      </div>
      {
        open && <div className='d-flex justify-content-center align-items-center mt-5'>
        <Settings color='white' /> <span className='ms-2'>Workspace settings</span>
      </div>
      }
    </div>
  )
}

export default Sidebar