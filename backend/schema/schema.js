const graphql = require("graphql");
const User = require("../models/User");
const Terms = require("../models/Terms");
const registerUser = require("../utils/registerUser");
const deleteUser = require("../utils/deleteUser");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
} = graphql;

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        role: { type: GraphQLString },
    }),
});

const TermType = new GraphQLObjectType({
    name: "Terms",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
    }),
});

// const AuthorType = new GraphQLObjectType({
//     name: 'Author',
//     fields: ( ) => ({
//         id: { type: GraphQLID },
//         name: { type: GraphQLString },
//         age: { type: GraphQLInt },
//         books: {
//             type: new GraphQLList(BookType),
//             resolve(parent, args){
//                 return Book.find({ authorId: parent.id });
//             }
//         }
//     })
// });

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        users: {
            type: GraphQLList(UserType),
            resolve() {
                return User.find({});
            },
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                const { id } = args;
                return User.findById(id);
            },
        },
        terms: {
            type: GraphQLList(TermType),
            resolve() {
                return Terms.find({});
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: UserType,
            args: {
                username: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
                role: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                const { username, password, role } = args;
                return registerUser(username, password, role);
            },
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                const { id } = args;
                return deleteUser(id);
            },
        },
        addTerms: {
            type: TermType,
            args: {
                title: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                const { title } = args;
                const terms = new Terms({ title });
                return terms.save();
            },
        },
        deleteTerms: {
            type: TermType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                const { id } = args;
                const terms = await Terms.findById(id);
                await terms.delete();
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
