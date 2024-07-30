import React from 'react'
import {AiTwotoneFilter, AiOutlinePlus} from "react-icons/ai"
import {BsDot, BsTrash} from "react-icons/bs"
import {FiEdit} from "react-icons/fi"
import style from "./electronics.module.scss"

const Electronics = () => {
  return (
    <section>
      <div className={style.inventory}>
        <div>
          <h2 style={{color: "#0d1e6d", fontSize:"30px"}}>Category</h2>
          <p>All your items categoried for easy access</p>
        </div>
        {/* <div>
            <hp>Electronics components</hp>
            <hp>Electronics components</hp>
            <hp>Electronics components</hp>
        </div> */}

        <div className={style.content}>
          <div className={style.icon} style={{marginRight:"20px", color:"#0d1e6d"}}>
            <span className={style.filter}>
              <AiTwotoneFilter size={30} />
            </span>
            <h2>Filter</h2>
          </div>
          <div className={style.icon} style={{backgroundColor:"#0d1e6d", color:"white"}}>
            <span className={style.filter}>
              <AiOutlinePlus size={30} />
            </span>
            <h2>Add To Inventory</h2>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" disabled />
            </th>
            <th>Name</th>
            <th>Category</th>
            <th>Last Modification</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input type="checkbox" />
            </td>
            <td>Resistor</td>
            <td>Electronic Component</td>
            <td>31 Dec 2022</td>
            <td>34</td>
            <td>
              <div className={style.status} style={{backgroundColor: "#B5e4b5", color:"#066B06"}}>  
                <BsDot style={{marginTop:"2px"}}/>
                Available
              </div>
            </td>
            <td className={style.icons}>  
              <FiEdit color="#151596"/>
              <BsTrash color="#Bf1111" /> 
            </td>
          </tr>

          <tr>
            <td>
              <input type="checkbox" />
            </td>
            <td>Resistor</td>
            <td>Electronic Component</td>
            <td>31 Dec 2022</td>
            <td>34</td>
            <td>
              {/* <div className={style.filter}>
                <BsDot />
              </div> */}
              <div className={style.status} style={{backgroundColor: "#E69696", color:"#870B0B"}}>  
                <BsDot style={{marginTop:"2px"}}/>
                Damaged
              </div>
            </td>
            <td className={style.icons}>  
              <FiEdit color="#151596"/>
              <BsTrash color="#Bf1111" /> 
            </td>
          </tr>

          <tr>
            <td>
              <input type="checkbox" />
            </td>
            <td>Resistor</td>
            <td>Electronic Component</td>
            <td>31 Dec 2022</td>
            <td>34</td>
            <td>
              {/* <div className={style.filter}>
                <BsDot />
              </div> */}
              <div className={style.status} style={{backgroundColor: "#E2dada", color:"#524f4f"}}>  
                <BsDot style={{marginTop:"2px"}}/>
                Not Available
              </div>
            </td>
            <td className={style.icons}>  
              <FiEdit color="#151596"/>
              <BsTrash color="#Bf1111" /> 
            </td>
          </tr>

          <tr>
            <td>
              <input type="checkbox" />
            </td>
            <td>Resistor</td>
            <td>Electronic Component</td>
            <td>31 Dec 2022</td>
            <td>34</td>
            <td>
              <div className={style.status} style={{backgroundColor: "#B5e4b5", color:"#066B06"}}>  
                <BsDot style={{marginTop:"2px"}}/>
                Available
              </div>
            </td>
            <td className={style.icons}>  
              <FiEdit color="#151596"/>
              <BsTrash color="#Bf1111" /> 
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export default Electronics