const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String
        imageUrl: String
        creator: User!
        likes: Int!
        createdAt: String!
        updatedAt: String!
    }
    type Message {
        _id: ID!
        text: String!
        creator: User!
        place: String!
    }

    type User {
        _id: ID!
        name: String!
        pic: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]! 
        likedposts: [Post]
    }

    type PostData {
        posts: [Post!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    input UserInputData {
        email: String!
        name: String!
        pic: String!
        password: String!
    }

    input PostInputData {
        title: String!
        imageUrl: String!
    }
    input MessageInputData {
        text: String!
        place: String!
        id: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        posts: [Post!]!
        post(id: ID!): Post!
        usersposts(id: ID!) : [Post!] 
        user(id: ID!): User!
        users: [User!]! 
        messages(id: ID!): [Message!]!
        otheruser(id: ID!): User!
        message : Message
    }

    type roomData{
        roomID : ID!
        people:[User!]!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
        createMessage(messageInput: MessageInputData): Message!
        updatePost(id: ID!, postInput: PostInputData): Post!
        deletePost(id: ID!): Boolean!
        updateStatus(status : String): User!
        likepost(id : ID!, userid: ID!): Post!
        createRoom(userInput: ID!): roomData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
