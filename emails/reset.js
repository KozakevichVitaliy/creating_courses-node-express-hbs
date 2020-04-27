const keys = require('../keys');

module.exports = function (email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Password recovery',
    html: `
      <h1>Forgot password?</h1>
      <p>If you are not, ignore this mail</p>
      <p>Else click the link below</p>
      <p><a href="${keys.BASE_URL}/auth/password/${token}">Restore access</a></p>
      <hr />
      <a href="${keys.BASE_URL}">Courses Shop</a>
    `,
  };
};
