$(function login() {
  /**
   * Updates the DOM
   * @param {*} data XHR result
   */
  function checkUser(data) {
    const render = [];
    // Reset all status messages
    $('.login-status').empty();

    //check user if in database


    // All went well
    if (!data.errors && data.login) {
      // The input was valid - reset the form
      $('.login-form').trigger('reset');

      // Output the success message
      $('.login-status').html(`<div class="alert alert-success">${data.successMessage}</div>`);
    } else {
      // There was an error
      // Create a list of errors
      $.each(data.errors, function createHtml(key, error) {
        render.push(`
          <li>${error.msg}</li>
        `);
      });
      // Set the status message
      $('.login-status').html(
        `<div class="alert alert-danger"><ul>${render.join('\n')}</ul></div>`
      );
    }
  }

  /**
   * Attaches to the form and sends the data to our REST endpoint
   */
  $('.login-form').submit(function submitLogin(e) {
    // Prevent the default submit form event
    e.preventDefault();

    // XHR POST request
    $.post(
      '/login/api',
      // Gather all data from the form and create a JSON object from it
      {
        username: $('#login-form-username').val(),
        password: $('#login-form-password').val(),
      },
      // Callback to be called with the data
      checkUser
    );
  });
});
