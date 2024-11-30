export const constants = {
  CURRENT_TOKEN: 'CURRENT_TOKEN',
};

const apiurl = 'http://localhost:8000/api';

export const apiEndpoint = {
  AuthEndpoint: {
    login: `${apiurl}/auth/login`,
    register: `${apiurl}/auth/register`, // Add this line
    logout: `${apiurl}/auth/logout`,
    loggedUser: `${apiurl}/auth/user`,
  },
  TodoEndpoint: {
    getAllTodo: `${apiurl}/todos`,
    addTodo: `${apiurl}/todos`,
    updateTodo: `${apiurl}/todos`,
    deleteTodo: `${apiurl}/todos`, // Ensure deleteTodo is included
  },
};