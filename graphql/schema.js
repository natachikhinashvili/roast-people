const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String
        imageUrl: String
        creator: User!
        likes: Int!
        likers : [User!]
        createdAt: String!
        updatedAt: String!
    }
    type Message {
        _id: ID!
        text: String!
        creator: User!
        place: String!
        createdAt: String!
    }

    type Comment {
        _id: ID!
        text: String!
        creator: User!
        place: String!
        createdAt: String!
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
        comments(id: ID!): [Comment!]!
    }

    type roomData{
        roomID : ID!
        people:[User!]!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(title: String!,imageUrl: String!, id: ID!): Post!
        createMessage(text: String!,place: String!,id: ID!): Message!
        updatePost(id: ID!,text: String!,place: String!): Post!
        deletePost(id: ID!, userid: ID!): Boolean!
        updateStatus(status : String): User!
        likepost(userid : ID!, postid: ID!): [Post!]
        createRoom(userInput: ID!): roomData!
        addComment(text: String!,place: String!,id: ID!): Comment!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
