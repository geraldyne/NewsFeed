import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// Configurar el link HTTP para conectar con el backend GraphQL
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql", // URL del servidor GraphQL
  credentials: "same-origin", // Incluir cookies si es necesario
});

// Crear el cliente Apollo con caché en memoria
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    // Configuración del caché
    typePolicies: {
      Post: {
        fields: {
          id: {
            read(existing) {
              return existing;
            },
          },
        },
      },
    },
  }),

  // Configuraciones adicionales
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all", // Mostrar datos parciales aunque haya errores
    },
    query: {
      errorPolicy: "all",
    },
  },

  connectToDevTools: process.env.NODE_ENV === "development",
});

export default client;
