import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

import gql from "graphql-tag";
import { Query } from "react-apollo";

const GET_BOOKS = gql`
  {
    books {
      _id
      title
      author
    }
  }
`;

function App() {
  return <div className="App" />;
}

export default App;
