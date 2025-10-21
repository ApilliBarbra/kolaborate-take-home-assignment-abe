import React from 'react';
import { useEffect, useState } from 'react';

export default function index() {

  const [message, setMessage] = useState("Loading");
  const [people, setPeople] = useState([]);



  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/home")
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      // message = "Loading"
      // once data is retrieved
      //message = data.message

      setMessage(data.message);
      setPeople(data.people);
      console.log(data.people);
    })
  }, [])

  return (
    <div>{message}</div>
  )
}
