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
var queryType = new GraphQLObjectType({
  name: "Query",
  fields: function() {
    return {
      books: {
        type: new GraphQLList(bookType),
        resolve: function() {
          const books = BookModel.find().exec();
          if (!books) {
            throw new Error("Error");
          }
          return books;
        }
      },
      book: {
        type: bookType,
        args: {
          id: {
            name: "_id",
            type: GraphQLString
          }
        },
        resolve: function(root, params) {
          const bookDetails = BookModel.findById(params.id).exec();
          if (!bookDetails) {
            throw new Error("Error");
          }
          return bookDetails;
        }
      }
    };
  }
});

module.exports = new GraphQLSchema({ query: queryType });

var mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: function() {
    return {
      //CREATE
      addBook: {
        type: bookType,
        args: {
          isbn: {
            type: new GraphQLNonNull(GraphQLString)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          author: {
            type: new GraphQLNonNull(GraphQLString)
          },
          description: {
            type: new GraphQLNonNull(GraphQLString)
          },
          published_year: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          publisher: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function(root, params) {
          const bookModel = new BookModel(params);
          const newBook = bookModel.save();
          if (!newBook) {
            throw new Error("Error");
          }
          return newBook;
        }
      },

      // READ, UPDATE
      updateBook: {
        type: bookType,
        args: {
          id: {
            name: "id",
            type: new GraphQLNonNull(GraphQLString)
          },
          isbn: {
            type: new GraphQLNonNull(GraphQLString)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          author: {
            type: new GraphQLNonNull(GraphQLString)
          },
          description: {
            type: new GraphQLNonNull(GraphQLString)
          },
          published_year: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          publisher: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          return BookModel.findByIdAndUpdate(
            params.id,
            {
              isbn: params.isbn,
              title: params.title,
              author: params.author,
              description: params.description,
              published_year: params.published_year,
              publisher: params.publisher,
              updated_date: new Date()
            },
            function(err) {
              if (err) return next(err);
            }
          );
        }
      },
      //DELETE
      removeBook: {
        type: bookType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          const remBook = BookModel.findByIdAndRemove(params.id).exec();
          if (!remBook) {
            throw new Error("Error");
          }
          return remBook;
        }
      }
    };
  }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
