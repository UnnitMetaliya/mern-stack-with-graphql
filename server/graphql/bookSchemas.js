// declaring all the required modules

var GraphQLSchema = require("graphql").GraphQLSchema;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLList = require("graphql").GraphQLList;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLNonNull = require("graphql").GraphQLNonNull;
var GraphQLID = require("graphql").GraphQLID;
var GraphQLString = require("graphql").GraphQLString;
var GraphQLInt = require("graphql").GraphQLInt;
var GraphQLDate = require("graphql-date");

// declaring all the required models
var BookModel = require("../models/Book");

// creating GraphQL Object Type for Book Models
var bookType = new GraphQLObjectType({
  name: "book",
  fields: function() {
    return {
      _id: {
        type: GraphQLString
      },
      isbn: {
        type: GraphQLString
      },
      title: {
        type: GraphQLString
      },
      author: {
        type: GraphQLString
      },
      description: {
        type: GraphQLString
      },
      published_year: {
        type: GraphQLInt
      },
      publisher: {
        type: GraphQLString
      },
      updated_date: {
        type: GraphQLDate
      }
    };
  }
});

// creating GraphQL queryType that calls a list of books and a single book by ID
