import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Input,
} from "reactstrap";
import axios from "axios";

const PatientsModal = ({ isOpened, modalOnClose, changeEventHandler }) => {
  const [patients, setPatients] = useState([]);
  const [search,setSearch] = useState('');

  useEffect(() => {
    axios
      .get("https://localhost:7070/api/Patients")
      .then((response) => setPatients(response.data));
  }, []);

  const filteredPatients = useMemo(()=>{
    return patients?.filter((p)=> {return p.name.includes(search)})
  },[search,patients]);

  return (
    <Modal
      isOpen={isOpened}
      toggle={modalOnClose}
      fade={false}
      dark
      size="xl"
    >
      <ModalHeader toggle={modalOnClose}>Patients list</ModalHeader>
      <ModalBody>
        <Input placeholder="Search..." onChange={(e)=> setSearch(e.target.value)}/>
        <Table bordered dark hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone number</th>
              <th>Email</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients?.map((p,i) => (
              <tr key={p.id} onClick={()=> {changeEventHandler(p.id,'patientId');
              modalOnClose();}}>
                <th scope="row">{i+1}</th>
                <td>{p.name}</td>
                <td>{p.phoneNumber}</td>
                <td>{p.email}</td>
                <td>{p.address}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={modalOnClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { PatientsModal };
