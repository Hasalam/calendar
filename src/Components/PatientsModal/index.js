import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Input,
  PaginationLink,
  PaginationItem,
  Pagination,
} from "reactstrap";
import axios from "axios";

const PatientsModal = ({ isOpened, modalOnClose, changeEventHandler }) => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("https://localhost:7070/api/Patients")
      .then((response) => setPatients(response.data));
  }, []);

  const filteredPatients = useMemo(() => {
    return patients?.filter((p) => {
      return p.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, patients]);

  const closeBtn = (
    <button className="closeBtn" onClick={modalOnClose} type="button">
      &times;
    </button>
  );

  return (
    <Modal
      isOpen={isOpened}
      toggle={modalOnClose}
      fade={false}
      dark
      size="xl"
      scrollable
    >
      <ModalHeader toggle={modalOnClose} close={closeBtn}>
        Patients list
        <Input
          className="search"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </ModalHeader>
      <ModalBody>
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
            {filteredPatients?.map((p, i) => (
              <tr
                key={p.id}
                onClick={() => {
                  changeEventHandler(p.id, "patientId");
                  changeEventHandler(p.email, "email");
                  changeEventHandler(p.phoneNumber, "phoneNumber");
                  modalOnClose();
                }}
              >
                <th scope="row">{i + 1}</th>
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
