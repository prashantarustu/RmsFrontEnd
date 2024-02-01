import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toastifyError, toastifySuccess } from "../../../Common/AlertMsg";
import { Decrypt_Id_Name } from "../../../Common/Utility";
import { AddDeleteUpadate, fetchPostData } from "../../../hooks/Api";

const Module = () => {

  const [characters, updateCharacters] = useState([]);
  useEffect(() => {
    get_SubModules()
  }, [])

  const get_SubModules = () => {
    const val = {
      AgencyID: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID')
    }
    fetchPostData('SubModules/GetData_SubModule', val)
      .then(res => {
        if (res) updateCharacters(res)
        else updateCharacters([])
      })
  }

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(characters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateCharacters(items);
    submit_SubModul(items)
  }

  const submit_SubModul = (val) => {
    AddDeleteUpadate('SubModules/Update_SubModule', val)
      .then(res => {
        if (res.success) {
          toastifySuccess(res.Message);
        } else {
          toastifyError(res.data.Message)
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  return (
    <>
      <div className="section-body view_page_design pt-3">
        <div className="row clearfix" >
          <div className="col-12 col-sm-12">
            <div className="card Agency">
              <div className="card-body">
                <div className="row" style={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0px 1px 2px #ccc",
                }}>

                  <div className="App" style={{margin:'auto'}}>
                    <header className="App-header">
                      <h1 style={{ fontSize: '25px' }}>Sub Module</h1>
                      <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="characters">
                          {(provided) => (
                            <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                              {characters.map(({ Code, Description }, index) => {
                                return (
                                  <Draggable key={Code} draggableId={Code} index={index}>
                                    {(provided) => (
                                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <p>
                                          {Description}
                                        </p>
                                      </li>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </ul>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </header>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Module;
