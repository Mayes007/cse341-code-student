function createContact(data) {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    favoriteColor: data.favoriteColor,
    birthday: data.birthday
  };
}

module.exports = { createContact };
