import "./App.css";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { debounce } from "lodash";

function App() {
  const [list, setList] = useState([]);
  const [default_country, setDefault_country] = useState("india");
  const onChange = (e) => {
    const { value } = e.target;
    handleSearch(value);
  };

  const handleSearch = useCallback(
    debounce((value) => {
      setDefault_country(value);
      fetchByCountry(value);
    }, 1000),
    []
  );
  function fetchByCountry(country) {
    axios
      .get("http://universities.hipolabs.com/search?country=" + country)
      .then(({ data }) => {
        if (data.length > 0) {
          setList([...data]);
          const rowth = parseInt((data.length / 2).toFixed(0));
          setTimeout(() => {
            document.getElementById("country_table").rows[rowth].style.color =
              "yellow";
          }, 0);
        } else {
          setList([]);
        }
      })
      .catch((err) => {
        console.log("error " + err);
        setList([]);
      });
  }

  useEffect(() => {
    fetchByCountry(default_country);
  }, [default_country]);

  return (
    <div className="App">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Enter country </Form.Label>
        <Form.Control
          className="mb-3"
          size="lg"
          type="text"
          onChange={(e) => {
            onChange(e);
          }}
          placeholder="Country..."
        />
      </Form.Group>
      <br />
      <br />
      <Table id="country_table" striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>University Name</th>
            <th>Website</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {list.map((data, index) => {
            const { name, web_pages, country } = data;
            return (
              <tr key={index}>
                <td>{index}</td>
                <td>{name}</td>
                <td>{web_pages[0]}</td>
                <td>{country}</td>
              </tr>
            );
          })}
          <tr></tr>
        </tbody>
      </Table>
    </div>
  );
}

export default App;
