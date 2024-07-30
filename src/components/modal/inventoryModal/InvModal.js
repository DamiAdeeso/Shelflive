import React, { useEffect, useRef } from 'react';
import ReactDom from "react-dom";
import { RiCloseLine } from 'react-icons/ri';
import style from "./inventoryModal.module.scss"

const InvModal = ({setHandleModal}) => {
    const modalRef = useRef();
    //const boxRef = useRef(0)
    const closeModal = (e) => {
      if (e.target === modalRef.current) {
        setHandleModal(false);
      }
    };
    
  return ReactDom.createPortal (
    <div 
        ref={modalRef} 
        onClick={closeModal} 
        // className={style.topModal}
        className={style.darkBG}  
        // id="demo-modal"
    >
        <div className={style.centered}>
            <div className={style.modal}>
                <button className={style.closeBtn} onClick={() => setHandleModal(false)}>
                    <RiCloseLine />
                </button>
                <form>
                    <h2>Add Experiment</h2>
                    <div className={style.contentTop}>
                        <label>
                            <h3>Experiment Title</h3>
                            <input type="text" placeholder='Test' />
                        </label>

                        <label>
                            <h3>Experiment Handler</h3>
                            <input type="text" placeholder='Experiment Handler Name' />
                        </label>

                        <label>
                            <h3>Student Level</h3>
                            <select>
                                <option value="year1">Year One</option>
                                <option value="year2">Year Two</option>
                                <option value="year3">Year Three</option>
                                <option value="year4">Year Four</option>
                            </select>
                        </label>
                    </div>                    
                </form>
                <div className={style.modalActions}>
                    <div className={style.actionsContainer}>
                        <button 
                            className={style.cancelBtn}
                            onClick={() => setHandleModal(false)}
                        >
                            Add
                        </button>
                        <button
                            className={style.deleteBtn}
                            onClick={() => setHandleModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>,
    document.getElementById("portal")
  )
}

export default InvModal

// import React from 'react'

// const InvModal = ({setHandleModal}) => {
//   return (
//     <div onClick={()=> setHandleModal(false)}>
//         InvModal
//     </div>
//   )
// }

// export default InvModal