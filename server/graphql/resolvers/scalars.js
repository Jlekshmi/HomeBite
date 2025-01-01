import { GraphQLScalarType, Kind } from "graphql";

// Define a custom GraphQL scalar type for Date
export const GQLDate = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  // Function to parse the value from the client input
  parseValue(value) {
    return new Date(value);
  },
  // Function to serialize the value for the client output
  serialize(value) {
    return value.toISOString().slice(0, 10);
  },
  // Function to parse the value from the client query
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});
