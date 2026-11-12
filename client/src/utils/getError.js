// gets the error message sent by backend
const getError = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return "Something went wrong. Please try again";
};

export default getError;